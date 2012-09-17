load('application');
before(use('user_auth'));
before(use('get_periodic_settings'));
before(use('get_posts_from_connected_accounts'));
before(use('require_login'), {only: ['new','edit','update','destroy']});
before(loadPost, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New post';
    this.post = new Post;
    render();
});

action(function create() {
    Post.create(req.body.Post, function (err, post) {
        if (err) {
            flash('error', 'Post can not be created');
            render('new', {
                post: post,
                title: 'New post'
            });
        } else {
            flash('info', 'Post created');
            redirect(path_to.posts());
        }
    });
});

action(function index() {
    /*
    getUpdates(this.auth_conf,'facebook',null,null,function(){
        this.title = 'Posts index';
        Post.all(function (err, posts) {
            render({
                posts: posts
            });
        });        
    })
    */
    this.title = 'Posts index';
    Post.all(function (err, posts) {
        render({
            posts: posts
        });
    }); 

});

action(function show() {
    this.title = 'Post show';
    render();
});

action(function edit() {
    this.title = 'Post edit';
    render();
});

action(function update() {
    this.post.updateAttributes(body.Post, function (err) {
        if (!err) {
            flash('info', 'Post updated');
            redirect(path_to.post(this.post));
        } else {
            flash('error', 'Post can not be updated');
            this.title = 'Edit post details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.post.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy post');
        } else {
            flash('info', 'Post successfully removed');
        }
        send("'" + path_to.posts() + "'");
    });
});

function loadPost() {
    Post.find(params.id, function (err, post) {
        if (err || !post) {
            redirect(path_to.posts());
        } else {
            this.post = post;
            next();
        }
    }.bind(this));
}

function getUpdates(auth_conf,account_type,options,params,next){
    console.log(next)
    switch(account_type){
        case "twitter":
            if(auth_conf.has_twitter){
                auth_conf.twitter_oauth.getUserTimeline(params,
                    function (err, data) {
                        console.log(data);
                        if(err){
                            console.log("error getting tweets")
                            flash('error', 'error getting tweets');
                            next();
                        }
                        else{
                            console.log("got tweets");
                            flash('success', 'updated twitter feed');
                            next();                    
                        }
                    }
                );
            }
            else{
                console.log("user doesn't have twitter")
                flash('error', 'Can not get tweets');
                next();
            }
            break;
        case "facebook":
            if(auth_conf.has_facebook){
                auth_conf.facebook_graph.get("me?fields=feed", function(err, data) {
                   console.info(data)
                   // { id: '4', name: 'Mark Zuckerberg'... }

                    if(err){
                        console.log("error getting facebook")
                        flash('error', 'error getting facebook');
                        next();
                    }
                    else{
                        console.log("got facebook");
                        flash('success', 'updated facebook feed');
                        next();                    
                    }
                
                });
            }
            else{
                console.log("user doesn't have facebook")
                flash('error', 'Can not get facebook');
                next();
            }
            break;
        default:
            next();
    }
}

function sendUpdate(auth_conf,account_type,options,params,update_message){
    switch(account_type){
        case "twitter":
            if(auth_conf.has_twitter){
                auth_conf.twitter_oauth.updateStatus(update_message,
                    function (err, data) {
                        console.log(data);
                        if(err){
                            console.log("error sending tweet")
                            flash('error', 'Error sending tweet: '+update_message);
                            next();
                        }
                        else{
                            console.log("tweet sent: "+update_message);
                            flash('success', 'tweet sent');
                            next();                    
                        }
                    }
                );
            }
            else{
                console.log("user doesn't have twitter")
                flash('error', 'you do not have twitter connected');
                next();
            }
            break;
        default:
            next();
    }
}