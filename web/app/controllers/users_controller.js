load('application');
before(use("get_periodic_settings"));
before(use('user_auth', {except: ['update']}));
before(loadUser, {only: ['show', 'edit', 'update', 'destroy']});
before(loadSelfLoggedInUser,{only:['updateinfo','completeregistration']})
before(use('require_login'), {only: ['edit']});

var shared_functions = require(app.root+'/config/shared_functions.js');
// console.info(shared_functions)

action('new', function () {
    if(this.user_auth.loggedIn){
        flash('error', "you already have an account");
        redirect(path_to.users())
    }
    else{
        this.title = 'New user';
        this.user = new User;
        render();
    }
});


action('articles',function(){
    var shared_functions = require(app.root+'/config/shared_functions.js');
    console.log(params)

    // Post.all({where:{userid:params.id},limit:10,order:"originaldate",}, function (err, posts) {
    // //     if (err || !posts) {
    // //         send({err})    
    // //     } 
    // //     else {
    // //         // send({ "posts" : posts.sort(shared_functions.sort_by('originaldate', true, Date.parse))})
    // //         send({"data":"cool"})
    // //    }
    //     send(posts.reverse())
    //     // send(posts.sort(shared_functions.sort_by('originaldate', true, Date.parse)))

    //  })//.bind(this)

    //  // send({"data":"cool"})
    // // render("index")
    // Post.all({limit:5,order:'-originaldate'},function(err,data){for(x in data){console.log(data[x].title+', '+data[x].content)}})


    Post.all({where:{userid:params.id},order:'originaldate DESC',limit:40},function(err,data){
        if(err){
            send(err)
        }
        else{
            send(data)
        }
    }); 
});

action(function create() {
    var bcrypt = require('bcrypt');
    var userdata = req.body.User;

    console.log(req.body)
    if (
        userdata.password===undefined ||
        !userdata.password || 
        userdata.password==='' || 
        userdata.password===' ' || 
        userdata.passwordconfirm==undefined|| 
        !userdata.passwordconfirm || 
        userdata.passwordconfirm==='' || 
        userdata.passwordconfirm===' ' ){
        delete userdata.password;
        delete userdata.passwordconfirm;
        flash('error', "missing password");
        console.log("missing password");
        redirect(path_to.new_user());
    }
    else if(userdata.passwordconfirm!=userdata.password){
        delete userdata.password;
        delete userdata.passwordconfirm;
        flash('error', "confirmation password doesn't match");
        console.log("confirmation password doesn't match");
        redirect(path_to.new_user());
    }
    // else if(){}
    else{
        delete userdata.passwordconfirm;
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(userdata.password, salt, function(err, hash) {
                // Store hash in your password DB.
                userdata.password= hash;
                console.log("to save user")
                // console.log(userdata)
                userdata.username=shared_functions.make_user_name_nice(userdata.username);
                User.create(userdata, function (err, user) {
                    console.log("created user")
                    // console.log(user)

                    if (err) {
                        console.log(err)
                        delete user.password;
                        flash('error', 'User can not be created');
                        redirect(path_to.new_user());

                    } else {
                        flash('info', 'Thanks for signing up!');
                        redirect(path_to.login());
                    }
                });

            });
        });
    }
});

action(function index() {
    this.title = 'GetPeriodic - Collaborate';
    User.all(function (err, users) {
        render("search",{
            users: users
        });
    });
});

action(function search() {
    // var shared_functions = require(app.root+'/config/shared_functions.js');

    // console.log(body.search_text)
    // console.log(params.search_text)

    searchQuery = new RegExp(shared_functions.strip_tags(body.search_text),"gi");

    User.all({where:{username:searchQuery,email:searchQuery},limit:5},function(err,users){
        if(err){
            send(err)
        }
        else{
            send(users);
        }
        // this.users = users
    });
});


action(function updateinfo() {
    // this.title = 'Complete your user registration';
    render();
});
action(function completeregistration() {
    body.User.username = shared_functions.make_user_name_nice(body.User.username);
    this.user.updateAttributes(body.User, function (err) {
        if (!err) {
            flash('info', 'User updated');
            redirect(path_to.user(this.user));
        } else {
            flash('error', 'User can not be updated');
            render('updateinfo');     
        }
    }.bind(this));
});

action(function show() {
    this.title = 'User show';
    render();
});

action(function edit() {

    if(shared_functions.require_admin_user_access(this.user_auth,this.user)){
        this.title = 'User edit';
        render();
    }
    else{
        redirect(path_to.users())
    }

});

action(function update() {

    if(shared_functions.require_admin_user_access(this.user_auth,this.user)){
        body.User.updatedAt = new Date();
        this.user.updateAttributes(body.User, function (err) {
            if (!err) {
                flash('info', 'User updated');
                redirect(path_to.user(this.user));
            } else {
                flash('error', 'User can not be updated');
                // this.title = 'Edit user details';
                if(!this.user.username || !this.user.email){
                    render('updateinfo');     
                }else{
                    render('edit');
                }
            }
        }.bind(this));

    }
    else{
        render('edit'); 
        flash('error', 'user: Access denied');
    }

});

action(function destroy() {
    if(shared_functions.require_admin_user_access(this.user_auth,this.user)){
        this.user.destroy(function (error) {
            if (error) {
                flash('error', 'Can not destroy user');
            } else {
                flash('info', 'User successfully removed');
            }
            send("'" + path_to.users() + "'");
        });
    }
    else{
        // console.log(this)
        flash('error', 'user: Access denied');
    }
    send("'" + path_to.users() + "'");
});

function loadUser() {
    console.log(params)
    User.findOne({where:{username:params.id}}, function (err, user) {
        queryId = params.id;
        if(user){
            this.user = user;
            next();
        }
        else if(err || (queryId != null && 'number' != typeof queryId && (queryId.length != 12 && queryId.length != 24))){
            console.log("invalid id")
            redirect(path_to.users());      
        }
        else if (err || !user) {
            User.find(params.id, function (err, user) {
                if (err || !user) {
                    redirect(path_to.users());       
                } 
                else {
                    this.user = user;
                    next();
                }
            }.bind(this));
        } 
        else {
            console.log("invalid id")
            redirect(path_to.users());    
        }
    }.bind(this));
}

function loadSelfLoggedInUser() {
    console.log("loadding loggedin user")
    User.find(this.user_auth.data.id, function (err, user) {
        if (err || !user) {
            flash('error', 'Invalid user data');
            req.logOut();
            redirect('/');   
        } 
        else {
            // console.log(user)
            this.user = user;
            next();
        }
    }.bind(this));
}