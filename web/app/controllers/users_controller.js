load('application');
before(use("user_auth"));
before(use("get_periodic_settings"));

before(loadUser, {only: ['show', 'edit', 'update', 'destroy']});
    var bcrypt = require('bcrypt');

action('new', function () {
    this.title = 'New user';
    this.user = new User;
    render();
});

action(function create() {
    var userdata = req.body.User;
    if(userdata.passwordconfirm!=userdata.password){
        delete userdata.passwordconfirm;
        flash('error', "confirmation password doesn't match");
        render('new', {
            user: userdata,
            title: 'New user'
        });
    }
    else{
        delete userdata.passwordconfirm;
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(userdata.password, salt, function(err, hash) {
                // Store hash in your password DB.
                userdata.description= userdata.password;
                userdata.password= hash;
                console.log("to save user")
                console.log(userdata)
                User.create(userdata, function (err, user) {
                    console.log("created user")
                    console.log(user)

                    if (err) {
                        console.log(err)
                        flash('error', 'User can not be created');
                        render('new', {
                            user: user,
                            title: 'New user'
                        });
                    } else {
                        flash('info', 'User created');
                        redirect(path_to.users());
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

action(function show() {
    this.title = 'User show';
    render();
});

action(function edit() {
    this.title = 'User edit';
    render();
});

action(function update() {
    this.user.updateAttributes(body.User, function (err) {
        if (!err) {
            flash('info', 'User updated');
            redirect(path_to.user(this.user));
        } else {
            flash('error', 'User can not be updated');
            this.title = 'Edit user details';
            render('edit');
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
    // console.log(params.id)
    // User.verifyPassword('blue','red')
    User.findOne({where:{username:params.id}}, function (err, user) {
        if (err || !user) {
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
