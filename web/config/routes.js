exports.routes = function (map) {
    map.resources('volumes');
    map.resources('periodicalmembers');
    map.resources('periodicals');
    map.resources('posts');
    map.resources('users');

    // Generic routes. Add all your routes below this line
    // feel free to remove generic routes
    map.all(':controller/:action');
    map.all(':controller/:action/:id');
};