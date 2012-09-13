load('application');

before(loadPeriodicalmembers, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New periodicalmembers';
    this.periodicalmembers = new Periodicalmembers;
    render();
});

action(function create() {
    Periodicalmembers.create(req.body.Periodicalmembers, function (err, periodicalmembers) {
        if (err) {
            flash('error', 'Periodicalmembers can not be created');
            render('new', {
                periodicalmembers: periodicalmembers,
                title: 'New periodicalmembers'
            });
        } else {
            flash('info', 'Periodicalmembers created');
            redirect(path_to.periodicalmembers());
        }
    });
});

action(function index() {
    this.title = 'Periodicalmemberss index';
    Periodicalmembers.all(function (err, periodicalmembers) {
        render({
            periodicalmembers: periodicalmembers
        });
    });
});

action(function show() {
    this.title = 'Periodicalmembers show';
    render();
});

action(function edit() {
    this.title = 'Periodicalmembers edit';
    render();
});

action(function update() {
    this.periodicalmembers.updateAttributes(body.Periodicalmembers, function (err) {
        if (!err) {
            flash('info', 'Periodicalmembers updated');
            redirect(path_to.periodicalmembers(this.periodicalmembers));
        } else {
            flash('error', 'Periodicalmembers can not be updated');
            this.title = 'Edit periodicalmembers details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.periodicalmembers.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy periodicalmembers');
        } else {
            flash('info', 'Periodicalmembers successfully removed');
        }
        send("'" + path_to.periodicalmembers() + "'");
    });
});

function loadPeriodicalmembers() {
    Periodicalmembers.find(params.id, function (err, periodicalmembers) {
        if (err || !periodicalmembers) {
            redirect(path_to.periodicalmembers());
        } else {
            this.periodicalmembers = periodicalmembers;
            next();
        }
    }.bind(this));
}
