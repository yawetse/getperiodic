Volume.belongsTo(Periodical, {as: 'periodical', foreignKey: 'periodicalId'});

Volume.validatesPresenceOf('title', {message: 'badly required'});

Volume.prototype.toString = function () {
    return this.title;
};

Volume.beforeUpdate = function (done, obj) {
    obj.updatedAt = new Date;
    done();
};
