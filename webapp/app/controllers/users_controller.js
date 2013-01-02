load('application');
before(use("get_periodic_settings"));
before(use('user_auth', {except: ['update']}));
before(loadUser, {only: ['show', 'edit', 'update', 'destroy']});
before(loadAllUserConnections, {only: ['index','search']});
before(loadAllUsers, {only: ['index']});
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


    if(this.user_auth.loggedIn){
        render("search");
    }
    else{
        render();
    }
});

function loadAllUsers(){
    var connections = this.userconnections;
    var followers = this.followers;
    var connections_array = new Array();
     // console.log(followers)
    for(x in connections){
        connection = connections[x];
        // console.log(connection.collaboratoruserid)
        connections_array.push(connection.collaboratorusername)
    }
    for(x in followers){
        follower = followers[x];
        // console.log(follower.username)
        // console.log(connection.collaboratoruserid)
        connections_array.push(follower.username)
    }
    // console.log(connections_array)
    this.users = new Array();
    if(connections_array.length>0){
        User.all({ 
                where: {
                    username: {
                        in: connections_array
                    }
                },
                limit: 100
            },
            function(err,users){
                // console.log(users)
                this.users = users;
                next();
            }.bind(this)
        ); 
    }
    else{
        next();
    }
}

function loadAllUserConnections(){
    console.log
    if(this.user_auth.loggedIn){
        userauthvar= this.user_auth;
        //first get the connections you sent
        Userconnection.all({where:{userid:userauthvar.data.id}},function(err,following){
            this.userconnections= following;
            //then get your connections you've recieved (followers)
            Userconnection.all({where:{collaboratoruserid:userauthvar.data.id}},
                function(err,followers){
                    // console.log(followers)
                    this.followers= followers;
                    next();
                }.bind(this)
            );
        }.bind(this));
    }
    else{
        next();
    }
}

action(function search() {
    // var shared_functions = require(app.root+'/config/shared_functions.js');

    // console.log(body.search_text)
    // console.log(params.search_text)
    searchQuery = new RegExp(shared_functions.strip_tags(body.search_text),"gi");
    // console.log("searchQuery")
    // console.log(searchQuery)
    var users_array = new Array();

    User.all({where:{email:searchQuery},limit:5},function(err,users){
        if(err){
            send(err)
        }
        else{
            // console.log(users)
            if(users){
                for(x in users){
                    users_array.push(users[x]);
                }
            }
            User.all({where:{username:searchQuery}},function(err,users_usernames){
                if(err){
                    send(err)
                }
                else{
                    for(x in users_usernames){
                        //do not dupilcate users
                        var is_a_duplicate = false;
                        for (y in users_array){
                            if(users_usernames[x].username==users_array[y].username){
                                is_a_duplicate = true;
                            }
                        }
                        if(!is_a_duplicate){
                            users_array.push(users_usernames[x]);
                        }
                    }
                    send({"users":users_array,"userconnections":this.userconnections});

                }
            }.bind(this));
        }
        // this.users = users
    }.bind(this));
});

action(function collaborate(){
    console.log(params)
    if(this.user_auth.loggedIn){
        Userconnection.findOne(
            {where: {
                userid:this.user_auth.data.id, 
                collaboratoruserid: params.id
                }
            },
            function(err,collaboration){
                // console.log(params)
                // console.log(this.user_auth.data.id)
                if (err) {
                    // console.info(err)
                    send({"result":"error","data":err});
                } 
                else if(collaboration){
                    console.info("already request/connection")
                    send({"result":"error","data":"already request/connection"});
                }
                else {
                    console.log("new request, create one")
                    var newconnection = {};
                    newconnection.userid = this.user_auth.data.id;
                    newconnection.username = this.user_auth.data.username;
                    newconnection.collaboratoruserid = params.id;
                    newconnection.collaboratorusername = params.username;
                    newconnection.confirmed = false;
                    Userconnection.create(newconnection, function (err, connection) {
                        if (err) {
                            // console.info(err)
                            send({"result":"error","data":err});
                        } else {
                            send({"result":"success","data":connection});
                        }
                    });
                }
            }.bind(this)
        );
    }
    else{
        send({"result":"error","data":"must be logged in"});
    }
});

action(function collaborate_remove(){
    if(this.user_auth.loggedIn){
        Userconnection.findOne(
            {where: {
                userid:this.user_auth.data.id, 
                collaboratoruserid: params.id
                }
            },
            function(err,collaboration){
                // console.log(params)
                // console.log(this.user_auth.data.id)
                if (err) {
                    console.info(err)
                    send({"result":"error","data":err});
                } 
                else{
                    if(collaboration){
                        collaboration.destroy(function(err){
                            if (err) {
                                console.info("ERROR removed request/connection")
                                console.info(err)
                                send({"result":"error","data":err});
                            } 
                            else {
                                console.info("removed request/connection")
                                send({"result":"success","data":"removed connection"});
                            }
                        });
                    }
                    else{
                        console.info("ERROR removed request/connection - invalid conneciton");
                        send({"result":"error","data":"ERROR removed request/connection - invalid conneciton"});
                    }
                    
                }
            }.bind(this)
        );
    }
    else{
        send({"result":"error","data":"must be logged in"});
    }
});

action(function updateinfo() {
    // this.title = 'Complete your user registration';
    render();
});
action(function completeregistration() {
    body.User.username = shared_functions.make_user_name_nice(body.User.username);

    if(body.User.username == this.user.username){
        delete body.User.username;
    }
    if(body.User.email == this.user.email){
        delete body.User.email;
    }

    console.log("sending data to update")
    console.log(body.User)
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