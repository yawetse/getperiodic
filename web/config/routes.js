
exports.routes = function (map) {
    map.resources('periodicalmembers');
    map.resources('periodicals', function (periodical) {
	    periodical.resources('volumes');
	});
    map.resources('posts');
    map.resources('users');

    // Auth routes
    map.get('login', 'auth#login');

    // Index route
    map.root('home#index')
    // Generic routes. Add all your routes below this line
    // feel free to remove generic routes
    map.all(':controller/:action');
    map.all(':controller/:action/:id');
};