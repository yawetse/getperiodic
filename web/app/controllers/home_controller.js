load('application');
before(use("user_auth"));
before(use("get_periodic_settings"));
before(use('require_login'), {only: ['dashboard']});
before(use('load_user_posts'), {only: ['dashboard']});
action('welcome', function () {
    render({
        title: "home#welcome"
    });
});
action('index', function () {
    if(this.user_auth.loggedIn){
        redirect(path_to.dashboard())
    }
    else{
        // console.log(user_auth)
        render({
            // title: "home#index"
        });
    }
});

action('dashboard', function () {
	// console.log(this.posts)
    render({
        // title: "home#dashboard"
//        User.all({where:{email:/Yaw/gi}},function(err,data){console.log(data)});
    });
});