load('application');
before(use("user_auth"));
before(use("get_periodic_settings"));

before(loadPeriodical, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New periodical';
    this.periodical = new Periodical;
    render();
});

action(function create() {
    Periodical.create(req.body.Periodical, function (err, periodical) {
        if (err) {
            flash('error', 'Periodical can not be created');
            render('new', {
                periodical: periodical,
                title: 'New periodical'
            });
        } else {
            flash('info', 'Periodical created');
            redirect(path_to.periodicals());
        }
    });
});

action(function index() {
    this.title = 'Periodicals index';
    Periodical.all(function (err, periodicals) {
        render({
            periodicals: periodicals
        });
    });
});

action(function show() {
    this.title = 'Periodical show';
    render();
});

action(function edit() {
    this.title = 'Periodical edit';
    render();
});

action(function update() {
    this.periodical.updateAttributes(body.Periodical, function (err) {
        if (!err) {
            flash('info', 'Periodical updated');
            redirect(path_to.periodical(this.periodical));
        } else {
            flash('error', 'Periodical can not be updated');
            this.title = 'Edit periodical details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.periodical.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy periodical');
        } else {
            flash('info', 'Periodical successfully removed');
        }
        send("'" + path_to.periodicals() + "'");
    });
});

function loadPeriodical() {
    Periodical.find(params.id, function (err, periodical) {
        if (err || !periodical) {
            redirect(path_to.periodicals());
        } else {
            this.periodical = periodical;
            next();
        }
    }.bind(this));
}
