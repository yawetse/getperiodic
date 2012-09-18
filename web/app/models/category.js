Category.belongsTo(Periodical, {as: 'periodical', foreignKey: 'periodicalId'});

Category.validatesPresenceOf('title', {message: 'badly required'});

Category.prototype.toString = function () {
    return this.title;
};

Category.beforeUpdate = function (done, obj) {
    obj.updatedAt = new Date;
    done();
};
