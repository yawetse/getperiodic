User.validatesLengthOf('password', {
  min: 8,
  allowNull: true
});

User.validatesExclusionOf('username', {
  "in": ['admin', 'config'],
  allowNull: true
});

User.validatesFormatOf('email', {
  "with": /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i,
  allowNull: true
});

User.verifyPassword = function(userpassword,hash) {
	var bcrypt = require('bcrypt');
	var salt = bcrypt.genSaltSync(10);
	return bcrypt.compareSync(userpassword, hash);
};