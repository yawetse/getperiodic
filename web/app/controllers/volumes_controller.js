load('application');
before(use("user_auth"));
before(use("get_periodic_settings"));

before(loadVolume, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New volume';
    this.volume = new Volume;
    render();
});

action(function create() {
    Volume.create(req.body.Volume, function (err, volume) {
        if (err) {
            flash('error', 'Volume can not be created');
            render('new', {
                volume: volume,
                title: 'New volume'
            });
        } else {
            flash('info', 'Volume created');
            redirect(path_to.volumes());
        }
    });
});

action(function index() {
    this.title = 'Volumes index';
    Volume.all(function (err, volumes) {
        render({
            volumes: volumes
        });
    });
});

action(function show() {
    this.title = 'Volume show';
    render();
});

action(function edit() {
    this.title = 'Volume edit';
    render();
});

action(function update() {
    this.volume.updateAttributes(body.Volume, function (err) {
        if (!err) {
            flash('info', 'Volume updated');
            redirect(path_to.volume(this.volume));
        } else {
            flash('error', 'Volume can not be updated');
            this.title = 'Edit volume details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.volume.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy volume');
        } else {
            flash('info', 'Volume successfully removed');
        }
        send("'" + path_to.volumes() + "'");
    });
});

function loadVolume() {
    Volume.find(params.id, function (err, volume) {
        if (err || !volume) {
            redirect(path_to.volumes());
        } else {
            this.volume = volume;
            next();
        }
    }.bind(this));
}
