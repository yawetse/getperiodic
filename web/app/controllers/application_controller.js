publish('user_auth',user_auth);
publish('require_login',require_login);
publish('get_periodic_settings',get_periodic_settings);

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
function get_periodic_settings(){
	this.get_periodic_settings = {
		"name":"GetPeriodic", // "userauth":session.auth
		"page_title":"GetPeriodic - Reading is fun" // "userauth":session.auth
	};
	this.title = this.get_periodic_settings.page_title;
	next();
}
