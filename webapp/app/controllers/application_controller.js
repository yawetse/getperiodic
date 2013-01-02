publish('user_auth',user_auth);
publish('require_login',require_login);
publish('get_periodic_settings',get_periodic_settings);
publish('get_posts_from_connected_accounts',get_posts_from_connected_accounts);
publish('load_user_posts',load_user_posts)
before('protect from forgery', function () {
    protectFromForgery('c60f3b775cac48aa5a06ec05f4c8af1eb84b144d');
});
var app = compound.app;

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
	var YAML = require('yamljs'), 	// Load yaml file using require
		clientside_conf = YAML.load(app.root + '/config/passport.yml')[app.set('env')],
		site_settings = YAML.load(app.root + '/config/site_config.yml')[app.set('env')];

	this.get_periodic_settings = site_settings.application_settings;
	// {
	// 	"name":site_settings.application_settings, // "userauth":session.auth
	// 	"page_title":site_settings.page_title // "userauth":session.auth
	// 	// "bing_maps_apikey": clientside_conf.bingmaps.apiKey
	// };

	if(clientside_conf.bingmaps){
		this.get_periodic_settings.bing_maps_apikey	= clientside_conf.bingmaps.apiKey;
	}
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
		this.auth_conf.userid = this.user_auth.data.id;
		if(this.user_auth.data.twitterAccessToken && this.user_auth.data.twitterAccessTokenSecret){
			console.log('user has twitter')
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
			this.auth_conf.facebook_graph = require('fbgraph');//var ntwitter 
			this.auth_conf.facebook_graph.setAccessToken(this.user_auth.data.facebookAccessToken);
		}
		if(this.user_auth.data.instagramAccessToken){
			console.log('user has instagram')
			this.auth_conf.has_instagram = true;
			var instagram = require('instapics');
			this.auth_conf.instagram_api = new instagram({token:this.user_auth.data.instagramAccessToken});
		}
		if(this.user_auth.data.tumblrAccessToken){
			console.log('user has tumblr')
			this.auth_conf.has_tumblr = true;
			var Tumblr = require('tumblr').Tumblr;
			this.auth_conf.tumblr_api = new Tumblr(this.user_auth.data.tumblrUsername+'.tumblr.com', 
				this.auth_conf.tumblr.apiKey);
			// this.auth_conf.instagram_api.recent(this.user_auth.data.instagramId,null,function(err,data){
			// 	console.log(data)
			// })
		}
		if(this.user_auth.data.foursquareAccessToken){
			console.log('user has foursquare')
			this.auth_conf.has_foursquare = true;
			var foursquare = require('4sq');
			this.auth_conf.foursquare_api = new foursquare({token:this.user_auth.data.foursquareAccessToken});
			this.auth_conf.foursquare_api.checkins('self',null, function(err,data){
				// console.log(data.checkins.items)
				//use bing for maps http://www.bingmapsportal.com/isdk/ajaxv7#CreateMapWithViewOptions2
			});
		}
		if(this.user_auth.data.soundcloudAccessToken){
			console.log('user has soundcloud')
			// console.log(this.user_auth.data.soundcloudAccessToken)
			// console.log(this.user_auth.data.soundcloudAccessTokenSecret)
			this.auth_conf.has_soundcloud = true;
			var soundcloud = require('soundcloud-js-auth');
			this.auth_conf.soundcloud_api = soundcloud;
			this.auth_conf.soundcloud_api.accessToken = this.user_auth.data.soundcloudAccessToken;
			
			// soundcloud.apiAuthCall('GET','/me/tracks.json',null,this.user_auth.data.soundcloudAccessTokenSecret,function(err,data) {
			// 	console.log("trying to get soundcloud")
   //              console.log(data);
   //          });
			
		}
	}
	next();
}
function load_user_posts(){
	var shared_functions = require(app.root+'/config/shared_functions.js');
	// console.log(shared_functions)
//	console.log(this.user_auth.data.id)

    Post.all({where:{userid:this.user_auth.data.id}, order:'originaldate DESC',limit:50}, function (err, posts) {
        if (err || !posts) {
            redirect(path_to.posts());
        } else {
            this.posts = posts//.sort(shared_functions.sort_by('originaldate', true, Date.parse));
            next();
        }
    }.bind(this));
}