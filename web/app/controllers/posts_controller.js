load('application');
before(use('user_auth'));
before(use('get_periodic_settings'));
before(use('get_posts_from_connected_accounts'));
before(use('require_login'), {only: ['new','edit','update','destroy','updateissues']});
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

action(function updateissues() {
    console.log("now in update issues")
    currentuserid = this.user_auth.data.id;
    currentuserinstagramid = this.user_auth.data.instagramId;
    currentuserauthconf = this.auth_conf;
    // console.log(this)
    getUpdates(currentuserauthconf,'facebook',{"userid":currentuserid},{"userid":currentuserid},function(facebookdata){
        getUpdates(currentuserauthconf,'twitter',{"userid":currentuserid},{"userid":currentuserid},function(twitterdata){
            getUpdates(currentuserauthconf,'instagram',{"instagramid":currentuserinstagramid,"userid":currentuserid},{"userid":currentuserid},function(instagramdata){
                // console.log(d)
                //User.all({where:{email:/Yaw/gi}},function(err,data){console.log(data)});
                Post.all({where:{userid:currentuserid}},function(err,data){
                    if(err){
                        send(err)
                    }
                    else{
                        send(data)
                    }
                });    
            });   
        });   
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
    // console.log(next)
    switch(account_type){
        case "twitter":
            if(auth_conf.has_twitter){
                auth_conf.twitter_oauth.getUserTimeline(params,
                    function (err, data) {
                        // console.log(data);
                        if(err){
                            console.log("error getting tweets")
                            flash('error', 'error getting tweets');
                            next();
                        }
                        else{
                            console.log("got tweets");
                            flash('success', 'updated twitter feed');

                            var twitterfeeddata = data,
                                returnData =new Array(); 
                            for(x in twitterfeeddata){
                                returnData.push(storeUpdate(err,account_type,twitterfeeddata[x],params));
                            }
                            next(returnData);     
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
        case "instagram":

            if(auth_conf.has_instagram){
                console.log('user has instagram')
                var instagram = require('instapics');
                auth_conf.instagram_api.recent(options.instagramid,null,function(err,picdata){
                    if(err){
                        console.log("error getting pics")
                        flash('error', 'error getting pics');
                        next();
                    }
                    else{
                        console.log("got instagram pics");
                        flash('success', 'updated instagram feed');

                        var instagramfeeddata = picdata,
                            returnData =new Array(); 
                        for(x in instagramfeeddata){
                            returnData.push(storeUpdate(err,account_type,instagramfeeddata[x],{userid:options.userid}));
                        }
                        next(returnData);     
                    }

                });

            }
            else{
                console.log("user doesn't have instagram")
                flash('error', 'Can not get pics');
                next();
            }
            break;
        case "facebook":
            if(auth_conf.has_facebook){
                auth_conf.facebook_graph.get("me?fields=feed", function(err, data) {
                   console.log("got facebook data now, here it is------")
                   //console.info(data.feed.data)
                   // { id: '4', name: 'Mark Zuckerberg'... }

                    if(err){
                        console.log("error getting facebook")
                        flash('error', 'error getting facebook');
                        next();
                    }
                    else{
                        console.log("got facebook");
                        flash('success', 'updated facebook feed');

                        var facebookfeeddata = data.feed.data,
                            returnData =new Array(); 
                        for(x in facebookfeeddata){
                            returnData.push(storeUpdate(err,account_type,facebookfeeddata[x],params));
                        }
                        next(returnData);                    
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

function storeUpdate(err,service,data,params){
    console.info("trying to store update: "+service)
    switch(service){
        case "instagram":
            var newpost = new Post;
            newpost["service-userid-orginaldataid"]=service+'-'+params.userid+'-'+data.id;
            newpost.userid = params.userid;
            newpost.originalid = data.id;
            newpost.originaldate = new Date(data.created_time *1000);//in epoch time
            newpost.originaldata = data;
            newpost.source = service;
            newpost.type = "image";
            newpost.mediacontent = data.images.standard_resolution.url;
            if(data.caption){
                newpost.content = data.caption.text;
            }
            newpost.link = data.link
             console.log(newpost["service-userid-orginaldataid"])
            newpost.save(newpost, function (err, post) {
                if (err) {
                    console.info(err)
                    return false;
                } else {
                    console.info("store image")
                    return post;
                }
            });
            break;
        case "twitter":
            var newpost = new Post;
            newpost["service-userid-orginaldataid"]=service+'-'+params.userid+'-'+data.id;
            newpost.userid = params.userid;
            newpost.originalid = data.id;
            newpost.originaldate = new Date(data.created_at);
            newpost.originaldata = data;
            newpost.source = service;
            newpost.type = "tweet";
            newpost.content = data.text;
            newpost.link = 'http://twitter.com/'+data.user.screen_name+'/status/'+data.did;
            // console.log(newpost)
            newpost.save(newpost, function (err, post) {
                if (err) {
                    return false;
                } else {
                    return post;
                }
            });
            break;
        case "facebook":
            var newpost = new Post;
            newpost["service-userid-orginaldataid"]=service+'-'+params.userid+'-'+data.id;
            newpost.userid = params.userid;
            newpost.originalid = data.id;
            newpost.originaldate = new Date(data.created_time);
            newpost.originaldata = data;
            newpost.source = service;
            newpost.type = data.type;
            if(data.name){
                newpost.title = data.name;
            }

            if(data.story){
                newpost.content = data.story;
            }
            else if(data.description){
                newpost.content = data.description;
            }
            else if(data.message){
                newpost.content = data.message;
            }

            if(data.link){
                newpost.link = data.link;
            }
            // console.log(newpost)
            newpost.save(newpost, function (err, post) {
                if (err) {
                    return false;
                } else {
                    return post;
                }
            });
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