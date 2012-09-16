load('application');
before(use("get_periodic_settings"));
before(use("user_auth",{ except : ['update']} ));
before(loadUser, {only: ['show', 'edit', 'update', 'destroy']});
before(loadSelfLoggedInUser,{only:['updateinfo','completeregistration']})
before(use('require_login'), {only: 'edit'});
// console.info(require_login)

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

action(function create() {
    var bcrypt = require('bcrypt');
    var userdata = req.body.User;
    if(userdata.passwordconfirm!=userdata.password){
        delete userdata.passwordconfirm;
        flash('error', "confirmation password doesn't match");
        render('new', {
            user: userdata,
            title: 'New user'
        });
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
                User.create(userdata, function (err, user) {
                    console.log("created user")
                    // console.log(user)

                    if (err) {
                        console.log(err)
                        flash('error', 'User can not be created');
                        render('new', {
                            user: user,
                            title: 'New user'
                        });
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
    this.title = 'Users index';
    User.all(function (err, users) {
        render({
            users: users
        });
    });
});

action(function updateinfo() {
    // this.title = 'Complete your user registration';
    render();
});
action(function completeregistration() {
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
    this.title = 'User edit';
    render();
});

action(function update() {
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
});

action(function destroy() {
    this.user.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy user');
        } else {
            flash('info', 'User successfully removed');
        }
        send("'" + path_to.users() + "'");
    });
});


function loadUser() {
    User.findOne({where:{username:params.id}}, function (err, user) {
        queryId = params.id;
        if(queryId != null && 'number' != typeof queryId && (queryId.length != 12 && queryId.length != 24)){
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
            this.user = user;
            next();
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