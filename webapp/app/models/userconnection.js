module.exports = function (compound, Userconnection) {
	// define Post here
  	Userconnection.validatesPresenceOf('userid');
	Userconnection.validatesPresenceOf('collaboratoruserid');
};
