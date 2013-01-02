module.exports = function (compound) {
    return [
        require('ejs-ext'),
        require('jugglingdb'),
        require('seedjs'),
        require('mongodb'),
        require('jugglingdb-mongodb'),
        require('yamljs'),
		require('node-gyp'),
		require('bcrypt'),
        require('connect-flash'),
        require('passport'),
        require('passport-facebook'),
		require('passport-github'),
		require('passport-instagram'),
		require('passport-local'),
		require('passport-soundcloud'),
		require('passport-twitter'),
		require('passport-foursquare'),
		require('passport-meetup'),
		require('passport-linkedin'),
		require('passport-goodreads'),
        require('compound-passport')
    ];
};

