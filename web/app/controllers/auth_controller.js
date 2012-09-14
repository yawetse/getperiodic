// var passport = require('passport'),
//     auth_config = require('../../config/auth_config'),
//     FacebookStrategy = require('passport-facebook').Strategy;
load('application');


// passport.use(new FacebookStrategy({
//     clientID: auth_config.fb.appId,
//     clientSecret: auth_config.fb.appSecret,
//     callbackURL: auth_config.fb.appCallbackURL
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.info("accessToken")
//     console.info(accessToken)        
//     console.info("refreshToken")
//     console.info(refreshToken)        
//     console.info("profile")
//     console.info(profile)
//     User.findOrCreate({id:userId}, function (err, user) {
//       if (err) { return done(err); }
//       done(null, user);
//     });
//   }
));


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
    render({
        title: "auth#login"
    });
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

action('google', function () {
    render({
        title: "auth#google"
    });
});