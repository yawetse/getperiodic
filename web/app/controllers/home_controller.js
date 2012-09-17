load('application');
before(use("user_auth"));
before(use("get_periodic_settings"));

action('welcome', function () {
    render({
        title: "home#welcome"
    });
});

action('index', function () {
    if(this.user_auth.loggedIn){
        render('dashboard')
    }
    else{
        // console.log(user_auth)
        render({
            // title: "home#index"
        });
    }
});

action('dashboard', function () {
	console.log(req)
    render({
        // title: "home#dashboard"
    });
});