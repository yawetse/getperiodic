require('../test_helper.js').controller('periodicalmembers', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        periodicalid: '',
        userid: '',
        membertype: ''
    };
}

exports['periodicalmembers controller'] = {

    'GET new': function (test) {
        test.get('/periodicalmembers/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/periodicalmembers', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Periodicalmembers.find;
        Periodicalmembers.find = sinon.spy(function (id, callback) {
            callback(null, new Periodicalmembers);
        });
        test.get('/periodicalmembers/42/edit', function () {
            test.ok(Periodicalmembers.find.calledWith('42'));
            Periodicalmembers.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Periodicalmembers.find;
        Periodicalmembers.find = sinon.spy(function (id, callback) {
            callback(null, new Periodicalmembers);
        });
        test.get('/periodicalmembers/42', function (req, res) {
            test.ok(Periodicalmembers.find.calledWith('42'));
            Periodicalmembers.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var periodicalmembers = new ValidAttributes;
        var create = Periodicalmembers.create;
        Periodicalmembers.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, periodicalmembers);
            callback(null, periodicalmembers);
        });
        test.post('/periodicalmembers', {Periodicalmembers: periodicalmembers}, function () {
            test.redirect('/periodicalmembers');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var periodicalmembers = new ValidAttributes;
        var create = Periodicalmembers.create;
        Periodicalmembers.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, periodicalmembers);
            callback(new Error, periodicalmembers);
        });
        test.post('/periodicalmembers', {Periodicalmembers: periodicalmembers}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Periodicalmembers.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/periodicalmembers/1', new ValidAttributes, function () {
            test.redirect('/periodicalmembers/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Periodicalmembers.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/periodicalmembers/1', new ValidAttributes, function () {
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

