//
//  frontier.js
//
//  code for main lobby server
//  (basic demo for ImonCloud's functions)
//

// ImonCloud allows specifying a particular version number, for example:
//require('imoncloud')('0.2.2');
require('imoncloud')('dev');

// show debug / warning / error messages
LOG.setLevel(3);

// show non-categorized messages
LOG.show('all');
LOG.track('all');


//-----------------------------------------
// define local variables
//
//-----------------------------------------

IC.Console.add('t', 'show current time', function (para) {
	var curr = new Date();
	LOG.warn(curr);
	LOG.debug(curr.toLocaleString(), '');	
}, 
'');

// a list of names for all collections to be created
var collections =  ['test1'];

var config = {
    path:               __dirname,
	//console:			false,				// turn off console if you don't want it
    handlers: [
        {file: 'handler.js'},
		//{file: '../app/handler_SPS.js'},
		//{file: '../app/handler_TTT.js'},
		{file: 'login.js', owner: 'IC'},
		{file: 'system.js', owner: 'IC'},
		{file: 'log.js', owner: 'IC'},
		{file: 'example/DB_file.js'},
		{file: 'example/cloud_server.js'},
		{file: 'example/verify_email.js'},
		{file: 'example/version_checking.js'},
		{file: 'example/user_roles.js'},
		{file: 'example/shared_states.js'},
		{file: 'example/LOG.js'},
		{file: 'example/upload.js'},
		//{file: 'example/DHT.js'},
    ],
    components: [
        IC.Component.FB(),                      // start a FB connect server
        IC.Component.REST(),                    // start a HTTP server,
		//IC.Component.REST('HTTPS'),             // start a HTTPS server,
		IC.Component.SockJS(),					// start a sockjs HTTP server
		//IC.Component.SockJS('HTTPS'),			// start a sockjs HTTPS server
		//IC.Component.SocketIO(),					// start a socketio HTTP server
		//IC.Component.SocketIO('HTTPS'),			// start a socketio HTTPS server		
    ],
	modules: {
		// TODO: wish-list init core IC functions without using components
		'DB': {collections: collections, shutdown_if_fail: true},
		'chat': {limit: 1000, backup: true},
		'pubsub': {}
	}
};


// TODO: wish-list (to init a IC function without using Frontier)
//IC.Module.init('DB', {collections: collections, shutdown_if_fail: true}, onDone);

// create frontier
var l_frontier = new IC.Frontier(config);
                           
// execute all the steps for running a server
l_frontier.init();

IC.Callback.onConnect(function (conn) {
	LOG.warn('onConnect called');		
	LOG.warn(conn);
});
		
IC.Callback.onDisconnect(function (conn) {
	LOG.warn('onDisconnect called');
	LOG.warn(conn);
});

IC.Callback.onCrash(function (onDone) {
	LOG.warn('onCrash called');
}, 3000);

IC.Callback.onStart(function () {
	LOG.warn('server info:');
	LOG.warn(IC.Settings.SERVER_INFO);
});
