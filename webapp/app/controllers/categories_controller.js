load('application');
before(use("user_auth"));
before(use("get_periodic_settings"));
before(use('require_login'), {only: ['new','edit','update','destroy']});
before(loadCategory, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New category';
    this.category = new Category;
    render();
});

action(function create() {
    Category.create(req.body.Category, function (err, category) {
        if (err) {
            flash('error', 'Category can not be created');
            render('new', {
                category: category,
                title: 'New category'
            });
        } else {
            flash('info', 'Category created');
            redirect(path_to.categories());
        }
    });
});

action(function index() {
    this.title = 'Categorys index';
    Category.all(function (err, categories) {
        render({
            categories: categories
        });
    });
});

action(function show() {
    this.title = 'Category show';
    render();
});

action(function edit() {
    this.title = 'Category edit';
    render();
});

action(function update() {
    this.category.updateAttributes(body.Category, function (err) {
        if (!err) {
            flash('info', 'Category updated');
            redirect(path_to.category(this.category));
        } else {
            flash('error', 'Category can not be updated');
            this.title = 'Edit category details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.category.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy category');
        } else {
            flash('info', 'Category successfully removed');
        }
        send("'" + path_to.categories() + "'");
    });
});

function loadCategory() {
    Category.find(params.id, function (err, category) {
        if (err || !category) {
            redirect(path_to.categories());
        } else {
            this.category = category;
            next();
        }
    }.bind(this));
}
