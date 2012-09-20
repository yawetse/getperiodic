
exports.routes = function (map) {
    map.resources('periodicalmembers');
    map.resources('periodicals',{path:'volumes'}, function (periodical) {
	    periodical.resources('categories',{path:'issues'});
	});
    map.resources('posts',{path:'articles'});
    map.resources('categories',{path:'issues'});
    map.resources('users',{path:'authors'});

    //User routs
    map.get('users/articles/:id.:format?','users#articles');//articles/50595957b337ed65b8000086.json

    // Post routes
    map.get('updateissues', 'posts#updateissues');

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