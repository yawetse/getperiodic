load('application');
before(use("user_auth"));
before(use("get_periodic_settings"));
before(use('require_login'), {only: ['new','edit','update','destroy']});

before(loadPeriodical, {only: ['show', 'edit', 'update', 'destroy']});
before(loadUserPeriodical, {only: ['index']});
var shared_functions = require(app.root+'/config/shared_functions.js');



action('new', function () {
    this.title = 'New periodical';
    this.periodical = new Periodical;
    render();
});

action(function create() {
    newperiodical= req.body.Periodical;
    newperiodical.userid=this.user_auth.data.id;
    newperiodical.name=shared_functions.make_user_name_nice(newperiodical.title);

    Periodical.create(newperiodical, function (err, periodical) {
        if (err) {
            flash('error', 'Periodical can not be created');
            render('new', {
                periodical: periodical,
                title: 'New periodical'
            });
        } else {
            flash('info', 'Periodical created');
            redirect(path_to.periodical(periodical.id));
        }
    });
});

action(function index() {
    if(!this.user_auth.loggedIn){
        render("index_loggedout");
    }
    else{
        render({
            periodicals: this.periodicals
        });
    } 
});

action(function show() {
    this.title = 'Periodical show';
    render();
});

action(function edit() {
    if(shared_functions.require_admin_user_access(this.user_auth,this.periodical,true)){
        this.title = 'Periodical edit';
        render();
    }
    else{
        flash('error', 'you cannot edit this');
        redirect(path_to.periodicals())
    }
});

action(function update() {
    if(shared_functions.require_admin_user_access(this.user_auth,this.periodical,true)){
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
    }
    else{
        flash('error', 'you cannot edit this');
        redirect(path_to.periodicals())
    }

});

action(function destroy() {
    if(shared_functions.require_admin_user_access(this.user_auth,this.periodical,true)){
        this.periodical.destroy(function (error) {
            if (error) {
                flash('error', 'Can not destroy periodical');
            } else {
                flash('info', 'Periodical successfully removed');
            }
        });
    }
    else{
        flash('error', 'user: Access denied');
    }
    send("'" + path_to.periodicals() + "'");
});

function loadPeriodical() {
    Periodical.findOne({where:{name:params.id.toLowerCase()}}, function (err, periodical) {
        queryId = params.id;
        if(periodical){
            if(checkPrivatePeriodicalAccess(periodical)){
                this.periodical = periodical;
                next(); 
            }
            else{
                flash('error', 'user: Access denied');
                redirect(path_to.periodicals());       
            }
        }
        else if(err || (queryId != null && 'number' != typeof queryId && (queryId.length != 12 && queryId.length != 24))){
            console.log("invalid id")
            redirect(path_to.periodicals());      
        }
        else if (err || !periodical) {
            Periodical.find(params.id, function (err, periodical) {
                if (err || !periodical) {
                    redirect(path_to.periodicals());       
                } 
                else {
                    if(checkPrivatePeriodicalAccess(periodical)){
                        this.periodical = periodical;
                        next(); 
                    }
                    else{
                        flash('error', 'user: Access denied');
                        redirect(path_to.periodicals());       
                    }
                }
            }.bind(this));
        } 
        else {
            console.log("invalid id")
            redirect(path_to.periodicals());    
        }
    }.bind(this));


    function checkPrivatePeriodicalAccess(periodical){
        // console.log()
        if(periodical.public){
            return true; 
        }
        else{
            if(this.user_auth){
                if(shared_functions.require_admin_user_access(this.user_auth, periodical.userid,true)){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
    }
}

function loadUserPeriodical(){
    if(!this.user_auth.loggedIn){
        next();
    }
    else{
        Periodical.all({where:{userid:this.user_auth.data.id}}, function (err, periodicals) {
            // console.log(periodicals)
            if (err || !periodicals) {
                flash('info', 'No Volumes available');
                next();
            } else {
                this.periodicals = periodicals;
                next();
            }
        }.bind(this));
    } 
}
