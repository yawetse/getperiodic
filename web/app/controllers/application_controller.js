publish('user_auth',user_auth);
publish('require_login',require_login);
publish('get_periodic_settings',get_periodic_settings);
publish('get_posts_from_connected_accounts',get_posts_from_connected_accounts);
before('protect from forgery', function () {
    protectFromForgery('be05db94204718a34719430d91fb5ae16feb1e65');
});
function user_auth(){
	this.user_auth = {};
	if(req.user!=undefined || req.user !=false){
		session.user = req.user;
		this.user_auth.data = session.user;
	}

	this.user_auth.loggedIn = (session.user) ? true : false;
	if(!this.user_auth.loggedIn){
		req.session.redirect = (req.url != '/login') ? req.url : '/dashboard'; // to send the user back to the same page after they log in
		if(req.url == '/updateinfo'){	
			redirect(path_to.root());
		}
		else{
			next();
		}	
	}
	else{
		// console.info(req.originalMethod);
		// console.info(this.user_auth.data.email)
		// console.info(this.user_auth.data.username)
		if( (!this.user_auth.data.email || !this.user_auth.data.username) && req.url != '/updateinfo' && req.originalMethod!='POST'){
            redirect(path_to.updateinfo());      	 
		}
		else{
			next();			
		}
	}
}
function require_login(){
	if(!this.user_auth.loggedIn){
		flash('error', 'Must be logged in to access reesource');
        redirect(path_to.root());
	}
	else{
		next();		
	}
}
// function require_admin_access
function get_periodic_settings(){
	this.get_periodic_settings = {
		"name":"GetPeriodic", // "userauth":session.auth
		"page_title":"GetPeriodic - Reading is fun" // "userauth":session.auth
	};
	this.title = this.get_periodic_settings.page_title;
	next();
}
function get_posts_from_connected_accounts(){
	YAML = require('yamljs'); 	// Load yaml file using require
	this.auth_conf = {};
	this.auth_conf = YAML.load(app.root + '/config/passport.yml')[app.set('env')];
	this.auth_conf.has_twitter = false;
	this.auth_conf.has_facebook = false;
	this.auth_conf.has_tumblr = false;
	this.auth_conf.has_instagram = false;
	this.auth_conf.has_soundcloud = false;
	this.auth_conf.has_github = false;

	// console.log("in get posts from connected accounts");
	// console.log(this.user_auth);
	// console.log(auth_conf)
	if(this.user_auth.loggedIn){
		if(this.user_auth.data.twitterAccessToken && this.user_auth.data.twitterAccessTokenSecret){
			// console.log('user has twitter')
			this.auth_conf.has_twitter = true;
			var ntwitter = require('ntwitter');
			this.auth_conf.twitter_oauth = new ntwitter({
			  	consumer_key: this.auth_conf.twitter.apiKey,
			  	consumer_secret: this.auth_conf.twitter.secret,
			  	access_token_key: this.user_auth.data.twitterAccessToken,
			  	access_token_secret: this.user_auth.data.twitterAccessTokenSecret
			});
		}
		if(this.user_auth.data.facebookAccessToken){
			console.log('user has facebook')
			this.auth_conf.has_facebook = true;
			this.auth_conf.facebook_graph = require('fbgraph');//var ntwitter = require('ntwitter');
			// var options = {
			//     timeout:  3000
			//   , pool:     { maxSockets:  Infinity }
			//   , headers:  { connection:  "keep-alive" }
			// };
			this.auth_conf.facebook_graph.setAccessToken(this.user_auth.data.facebookAccessToken);
		}
	}
	next();
}
