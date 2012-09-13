require('../test_helper.js').controller('cruds', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        user: '',
        email: '',
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        createdAt: '',
        updatedAt: '',
        activated: '',
        accounttype: '',
        description: '',
        image: '',
        image_https: '',
        twitterAccessToken: '',
        twitterAccessTokenSecret: '',
        twitterUsername: '',
        twitterId: '',
        facebookAccessToken: '',
        facebookAccessTokenSecret: '',
        facebookUsername: '',
        facebookId: ''
    };
}

exports['cruds controller'] = {

    'GET new': function (test) {
        test.get('/cruds/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/cruds', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Crud.find;
        Crud.find = sinon.spy(function (id, callback) {
            callback(null, new Crud);
        });
        test.get('/cruds/42/edit', function () {
            test.ok(Crud.find.calledWith('42'));
            Crud.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Crud.find;
        Crud.find = sinon.spy(function (id, callback) {
            callback(null, new Crud);
        });
        test.get('/cruds/42', function (req, res) {
            test.ok(Crud.find.calledWith('42'));
            Crud.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var crud = new ValidAttributes;
        var create = Crud.create;
        Crud.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, crud);
            callback(null, crud);
        });
        test.post('/cruds', {Crud: crud}, function () {
            test.redirect('/cruds');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var crud = new ValidAttributes;
        var create = Crud.create;
        Crud.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, crud);
            callback(new Error, crud);
        });
        test.post('/cruds', {Crud: crud}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Crud.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/cruds/1', new ValidAttributes, function () {
            test.redirect('/cruds/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Crud.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/cruds/1', new ValidAttributes, function () {
            test.success();
            test.render('edit');
            test.flash('error');
            test.done();
        });
    },

    'DELETE destroy': function (test) {
        test.done();
    },

    'DELETE destroy fail': function (test) {
        test.done();
    }
};

