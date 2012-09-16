
exports.routes = function (map) {
    map.resources('periodicalmembers');
    map.resources('periodicals', function (periodical) {
	    periodical.resources('volumes');
	});
    map.resources('posts');
    map.resources('volumes');
    map.resources('users',{path:'authors'});

    // Auth routes
    map.get('register', 'users#new');
    map.get('login', 'auth#login');
    map.get('logout', 'auth#logout');
    map.get('updateinfo', 'users#updateinfo');
    map.post('updateinfo','users#completeregistration')

    // home routes
    map.get('dashboard', 'home#dashboard');
    map.get('welcome', 'home#welcome');

    // Index route
    map.root('home#index')
    // Generic routes. Add all your routes below this line
    // feel free to remove generic routes
    map.all(':controller/:action');
    map.all(':controller/:action/:id');
};