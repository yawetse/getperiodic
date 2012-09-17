Periodical.hasMany(Volume, {as: 'volumes', foreignKey: 'periodicalId'});
Periodical.validatesUniquenessOf('name', {  message:"- your periodical has to be unique, think of it like a username"});
Periodical.validatesLengthOf('title', {
  min: 2,
  message:"- your title is too short (min of 3 characters)"
});
Periodical.validatesPresenceOf('title');
Periodical.validatesPresenceOf('name');
Periodical.validatesPresenceOf('userid');
Periodical.validatesExclusionOf('name', {
  "in": ['admin', 'config', 'profile', 'index', 'create', 'delete', 'destroy', 'edit', 'update', 'login', 'logut', 'destroy', 'welcome','dashboard'],
  allowNull: true
});

Periodical.beforeUpdate = function (done,obj){
	console.log("BEFORE UPDATE Periodical obj")
  this.updatedAt = new Date();
  // return obj;
  done();
};

Periodical.afterCreate = function (done,obj){
	console.log("AFTER CREATE Periodical obj")
	// return obj;
	periodicalmemberToAdd = {};
	periodicalmemberToAdd.periodicalid = this.id;
	periodicalmemberToAdd.userid = this.userid;
	periodicalmemberToAdd.membertype = "admin";

    Periodicalmember.create(periodicalmemberToAdd, function (err, periodical) {
        if (err) {
            console.log('Periodical access can not be created');
            done();
        } else {
            console.log('Periodical access added');
            done();
        }
    });
};

