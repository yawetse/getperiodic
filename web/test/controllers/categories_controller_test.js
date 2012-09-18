require('../test_helper.js').controller('categories', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        title: '',
        name: '',
        description: '',
        createdAt: '',
        updatedAt: '',
        periodicalid: '',
        config: ''
    };
}

exports['categories controller'] = {

    'GET new': function (test) {
        test.get('/categories/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/categories', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Category.find;
        Category.find = sinon.spy(function (id, callback) {
            callback(null, new Category);
        });
        test.get('/categories/42/edit', function () {
            test.ok(Category.find.calledWith('42'));
            Category.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Category.find;
        Category.find = sinon.spy(function (id, callback) {
            callback(null, new Category);
        });
        test.get('/categories/42', function (req, res) {
            test.ok(Category.find.calledWith('42'));
            Category.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var category = new ValidAttributes;
        var create = Category.create;
        Category.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, category);
            callback(null, category);
        });
        test.post('/categories', {Category: category}, function () {
            test.redirect('/categories');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var category = new ValidAttributes;
        var create = Category.create;
        Category.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, category);
            callback(new Error, category);
        });
        test.post('/categories', {Category: category}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Category.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/categories/1', new ValidAttributes, function () {
            test.redirect('/categories/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Category.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/categories/1', new ValidAttributes, function () {
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

