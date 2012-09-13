require('../test_helper.js').controller('volumes', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        title: '',
        description: '',
        createdAt: '',
        periodicalid: '',
        options: ''
    };
}

exports['volumes controller'] = {

    'GET new': function (test) {
        test.get('/volumes/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/volumes', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Volume.find;
        Volume.find = sinon.spy(function (id, callback) {
            callback(null, new Volume);
        });
        test.get('/volumes/42/edit', function () {
            test.ok(Volume.find.calledWith('42'));
            Volume.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Volume.find;
        Volume.find = sinon.spy(function (id, callback) {
            callback(null, new Volume);
        });
        test.get('/volumes/42', function (req, res) {
            test.ok(Volume.find.calledWith('42'));
            Volume.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var volume = new ValidAttributes;
        var create = Volume.create;
        Volume.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, volume);
            callback(null, volume);
        });
        test.post('/volumes', {Volume: volume}, function () {
            test.redirect('/volumes');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var volume = new ValidAttributes;
        var create = Volume.create;
        Volume.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, volume);
            callback(new Error, volume);
        });
        test.post('/volumes', {Volume: volume}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Volume.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/volumes/1', new ValidAttributes, function () {
            test.redirect('/volumes/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Volume.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/volumes/1', new ValidAttributes, function () {
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

