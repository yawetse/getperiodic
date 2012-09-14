
exports.routes = function (map) {
    // map.resources('volumes');
    map.resources('periodicalmembers');
    map.resources('periodicals', function (periodical) {
	    periodical.resources('volumes');
	});
    map.resources('posts');
    map.resources('users');

    // Auth routes
    map.get('login', 'auth#login');
    
    // map.get('auth/facebook', 'auth#facebook');
    // map.get('auth/facebook/callback', 'auth#facebookcallback');
    //    map.get('auth/facebook/callback', 'auth#facebookcallback',function(req, res, next));

    // map.get('auth/twitter', 'auth#twitter');
    // map.get('auth/tumblr', 'auth#tumblr');
    // map.get('auth/instagram', 'auth#instagram');    
    // map.get('auth/google', 'auth#google');
    // map.get('auth/soundcloud', 'auth#soundcloud');
    // map.get('auth/github', 'auth#github');

    // Index route
    map.root('home#index')
    // Generic routes. Add all your routes below this line
    // feel free to remove generic routes
    map.all(':controller/:action');
    map.all(':controller/:action/:id');
};