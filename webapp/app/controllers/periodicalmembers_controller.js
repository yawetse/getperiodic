load('application');
before(use("user_auth"));
before(use("get_periodic_settings"));

before(loadPeriodicalmember, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New periodicalmember';
    this.periodicalmember = new Periodicalmember;
    render();
});

action(function create() {
    Periodicalmember.create(req.body.Periodicalmember, function (err, periodicalmember) {
        if (err) {
            flash('error', 'Periodicalmember can not be created');
            render('new', {
                periodicalmember: periodicalmember,
                title: 'New periodicalmember'
            });
        } else {
            flash('info', 'Periodicalmember created');
            redirect(path_to.periodicalmembers());
        }
    });
});

action(function index() {
    this.title = 'Periodicalmembers index';
    Periodicalmember.all(function (err, periodicalmembers) {
        render({
            periodicalmembers: periodicalmembers
        });
    });
});

action(function show() {
    this.title = 'Periodicalmember show';
    render();
});

action(function edit() {
    this.title = 'Periodicalmember edit';
    render();
});

action(function update() {
    this.periodicalmember.updateAttributes(body.Periodicalmember, function (err) {
        if (!err) {
            flash('info', 'Periodicalmember updated');
            redirect(path_to.periodicalmember(this.periodicalmember));
        } else {
            flash('error', 'Periodicalmember can not be updated');
            this.title = 'Edit periodicalmember details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.periodicalmember.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy periodicalmember');
        } else {
            flash('info', 'Periodicalmember successfully removed');
        }
        send("'" + path_to.periodicalmembers() + "'");
    });
});

function loadPeriodicalmember() {
    Periodicalmember.find(params.id, function (err, periodicalmember) {
        if (err || !periodicalmember) {
            redirect(path_to.periodicalmembers());
        } else {
            this.periodicalmember = periodicalmember;
            next();
        }
    }.bind(this));
}
