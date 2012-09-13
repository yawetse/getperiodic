require('../test_helper.js').controller('periodicals', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        title: '',
        description: '',
        createdAt: '',
        options: ''
    };
}

exports['periodicals controller'] = {

    'GET new': function (test) {
        test.get('/periodicals/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/periodicals', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Periodical.find;
        Periodical.find = sinon.spy(function (id, callback) {
            callback(null, new Periodical);
        });
        test.get('/periodicals/42/edit', function () {
            test.ok(Periodical.find.calledWith('42'));
            Periodical.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Periodical.find;
        Periodical.find = sinon.spy(function (id, callback) {
            callback(null, new Periodical);
        });
        test.get('/periodicals/42', function (req, res) {
            test.ok(Periodical.find.calledWith('42'));
            Periodical.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var periodical = new ValidAttributes;
        var create = Periodical.create;
        Periodical.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, periodical);
            callback(null, periodical);
        });
        test.post('/periodicals', {Periodical: periodical}, function () {
            test.redirect('/periodicals');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var periodical = new ValidAttributes;
        var create = Periodical.create;
        Periodical.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, periodical);
            callback(new Error, periodical);
        });
        test.post('/periodicals', {Periodical: periodical}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Periodical.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/periodicals/1', new ValidAttributes, function () {
            test.redirect('/periodicals/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Periodical.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/periodicals/1', new ValidAttributes, function () {
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

