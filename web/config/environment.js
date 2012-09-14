var express = require('express'), 
    rwps = require('railway-passport');
// var passport_config = require('./passport_config');

    // console.log(rwps.init())

app.configure(function(){
    var cwd = process.cwd();
    
    app.use(express.static(cwd + '/public', {maxAge: 86400000}));
    app.set('view engine', 'ejs');
    app.set('view options', {complexNames: true});
    app.set('jsDirectory', '/javascripts/');
    app.set('cssDirectory', '/stylesheets/');
    app.use(express.bodyParser());
    app.use(express.cookieParser('fna98743ha98f3f'));
    app.use(express.session({secret: 'qrcq34rnof8uwfho83x'}));
    app.use(express.methodOverride());
    rwps.init();    
    //hook up user model
    process.nextTick(function () {
        rwps.loadUser(User);
    });

    app.use(app.router);
});

