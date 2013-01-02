load('application');
before(use("user_auth",{ except: ['logout']} ));
before(use("get_periodic_settings"));
before(use('require_login'), {only: 'accounts'});


action('twitter', function () {
    render({
        title: "auth#twitter"
    });
});

// action('facebook', function(){
//     passport.authenticate('facebook', { 
//         next:next,
//         scope: ['user_status', 'user_photos','offline_access'] 
//     })
// });

// action('facebookcallback', function(){
//     passport.authenticate('facebook', { 
//         successRedirect: '/',
//         failureRedirect: '/login',
//         next:next
//         })
//     }
// );


action('instagram', function () {
    render({
        title: "auth#instagram"
    });
});

action('login', function () {
    // console.log(response)
    // console.log(req)
    render({
        // title: "auth#login"
    });
});
action('logout', function () {
    // console.log(response)
    // console.log(req)
    // render({
    //     title: "auth#login"
    // });
    req.logOut();
    redirect('/');
});

action('tumblr', function () {
    render({
        title: "auth#tumblr"
    });
});

action('github', function () {
    render({
        title: "auth#github"
    });
});

action('soundcloud', function () {
    render({
        title: "auth#soundcloud"
    });
});
action('accounts', function () {
    render({
    });
});

action('google', function () {
    render({
        title: "auth#google"
    });
});