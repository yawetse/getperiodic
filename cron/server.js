// var Schema = require('jugglingdb')
var Schema = require('jugglingdb').Schema;
var schema = new Schema('mongodb', {url: "mongodb://localhost/getperiodic"}); //port number depends on your configuration

var User = schema.define('User', function () {
    property('email', String, {index:true, limit:150});
    property('firstname', String);
    property('lastname', String);
    property('username', String);
    property('password', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('updatedAt', Date, {default: function () { return new Date() }});
    property('activated', Boolean, {default:false});
    property('accounttype', String, {default:"regular"});
    property('description', String);
    property('url', String);
    property('image', String);
    property('image_https', String);
    property('twitterAccessToken', String);
    property('twitterAccessTokenSecret', String);
    property('twitterUsername', String);
    property('twitterId', String, { index: true });
    property('facebookAccessToken', String);
    property('facebookUsername', String);
    property('facebookId', String, { index: true });
    property('foursquareAccessToken', String);
    property('foursquareId', String, { index: true });
    property('soundcloudId', String);
    property('soundcloudAccessToken', String);
    property('soundcloudAccessTokenSecret', String);
    property('meetupId', String);
    property('meetupAccessToken', String);
    property('meetupAccessTokenSecret', String);
    property('linkedinId', String);
    property('linkedinAccessToken', String);
    property('linkedinAccessTokenSecret', String);
    property('instagramId', String);
    property('instagramAccessToken', String);
    property('githubId', String);
    property('githubUsername', String);
    property('githubAccessToken', String);
    property('tumblrUsername', String);
    property('tumblrAccessToken', String);
    property('tumblrAccessTokenSecret', String);
    property('goodreadsId', String);
    property('goodreadsAccessToken', String);
    property('goodreadsAccessTokenSecret', String);
});var Post = schema.define('Post', function () {
    property('title', String);
    property('content', String);
    property('mediacontent', String);
    property('link', String);
    property('type', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('source', String);
    property('originaldata', String);
    property('originalid', String);
    property('originaldate', Date);
    property('userid', String);
    property('service-userid-orginaldataid', String);
});var Periodical = schema.define('Periodical', function () {
    property('title', String);
    property('name', String,{index:true,limit:150});
    property('description', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('updatedAt', Date, {default: function () { return new Date() }});
    property('config', String);
    property('userid', String);
});

var Volume = schema.define('Volume', function () {
    property('title', String);
    property('name', String,{index:true,limit:150});
    property('description', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('updatedAt', Date, {default: function () { return new Date() }});
    property('periodicalid', Number);
    property('config', String);
});

var Periodicalmember = schema.define('Periodicalmember', function () {
    property('periodicalid', String);
    property('userid', String);
    property('membertype', String);
    property('createdAt', Date);
});var Category = schema.define('Category', function () {
    property('title', String);
    property('name', String,{index:true,limit:150});
    property('description', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('updatedAt', Date, {default: function () { return new Date() }});
    property('periodicalid', Number);
    property('config', String);
});
// var TESTPost = schema.define('TESTPost', {
//     title:     { type: String, length: 255 },
//     content:   { type: Schema.Text },
//     date:      { type: Date,    default: Date.now },
//     published: { type: Boolean, default: false }
// });
// // simplier way to describe model
// var TESTUser = schema.define('TESTUser', {
//     name:         String,
//     bio:          Schema.Text,
//     approved:     Boolean,
//     joinedAt:     Date,
//     age:          Number
// });

// var user = new TESTUser();
// user.name="name"+Math.floor((Math.random()*100)+1);
// user.joinedAt = new Date();
// user.save()

Post.all({limit:10},function(err,data){
	for(x in data){
		console.log(data[x].title);
	}
})

// // setup relationships
// TESTUser.hasMany(TESTPost,   {as: 'posts',  foreignKey: 'userId'});
// // creates instance methods:
// // user.posts(conds)
// // user.posts.build(data) // like new TESTPost({userId: user.id});
// // user.posts.create(data) // build and save

// TESTPost.belongsTo(TESTUser, {as: 'author', foreignKey: 'userId'});
// // creates instance methods:
// // post.author(callback) -- getter when called with function
// // post.author() -- sync getter when called without params
// // post.author(user) -- setter when called with object

// schema.automigrate(); // required only for mysql NOTE: it will drop TESTUser and TESTPost tables

// // work with models:
// var user = new TESTUser;
// user.save(function (err) {
//     var post = user.posts.build({title: 'Hello world'});
//     post.save(console.log);
// });

// // or just call it as function (with the same result):
// var user = TESTUser();
// user.save();

// // Common API methods
// cb = function(){}
// // just instantiate model
// new TESTPost
// // save model (of course async)
// TESTPost.create(cb);
// // all posts
// TESTPost.all(cb)
// // all posts by user
// TESTPost.all({where: {userId: user.id}, order: 'id', limit: 10, skip: 20});
// // the same as prev
// user.posts(cb)
// // same as new TESTPost({userId: user.id});
// user.posts.build
// // save as TESTPost.create({userId: user.id}, cb);
// user.posts.create(cb)
// // find instance by id
// TESTUser.find(1, cb)
// // count instances
// // TESTUser.count([conditions]cb)
// // destroy instance
// user.destroy(cb);
// // destroy all instances
// TESTUser.destroyAll(cb);

// // Setup validations
// TESTUser.validatesPresenceOf('name', 'email')
// TESTUser.validatesLengthOf('password', {min: 5, message: {min: 'Password is too short'}});
// TESTUser.validatesInclusionOf('gender', {in: ['male', 'female']});
// TESTUser.validatesExclusionOf('domain', {in: ['www', 'billing', 'admin']});
// TESTUser.validatesNumericalityOf('age', {int: true});
// TESTUser.validatesUniquenessOf('email', {message: 'email is not unique'});

// user.isValid(function (valid) {
//     if (!valid) {
//         user.errors // hash of errors {attr: [errmessage, errmessage, ...], attr: ...}    
//     }
// })
