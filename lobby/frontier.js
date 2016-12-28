//
//  frontier.js
//
//  code for main lobby server
//  (basic demo for ImonCloud's functions)
//

// ImonCloud allows specifying a particular version number, for example:
//require('imoncloud')('0.2.2');
require('scalra')('dev');

// show debug / warning / error messages
LOG.setLevel(3);

// show non-categorized messages
LOG.show('all');
LOG.track('all');


//-----------------------------------------
// define local variables
//
//-----------------------------------------

// a list of names for all collections to be created
var collections =  [];

var config = {
    path:               __dirname,
	//console:			false,				// turn off console if you don't want it
    handlers: [
        //{file: 'handler.js'},
		{file: 'logic.js'},
		{file: 'drupalAuth.js'},
		{file: 'login.js', owner: 'SR'},
		{file: 'system.js', owner: 'SR'},
		{file: 'log.js', owner: 'SR'}
    ],
    components: [
        //SR.Component.FB(),                      // start a FB connect server
		SR.Component.REST('HTTPS'),             // start a HTTPS server,
		SR.Component.SockJS('HTTPS'),			// start a sockjs HTTPS server
		SR.Component.SocketIO(),          		// start a socketio HTTP server
		SR.Component.SocketIO('HTTPS'),         // start a socketio HTTPS server
    ],
	modules: {
		// TODO: wish-list init core SR.functions without using components
		'DB': {collections: collections, shutdown_if_fail: true},
		'chat': {limit: 1000, backup: true},
		'pubsub': {},
		'express': {router: 'router.js'},
		//'voice': {}
	}
};


// TODO: wish-list (to init a SR.function without using Frontier)
//SR.Module.init('DB', {collections: collections, shutdown_if_fail: true}, onDone);

// create frontier
var l_frontier = new SR.Frontier(config);
                           
// execute all the steps for running a server
l_frontier.init();

SR.Callback.onConnect(function (conn) {
	LOG.warn('onConnect called');		
	LOG.warn(conn);
});
		
SR.Callback.onDisconnect(function (conn) {
	LOG.warn('onDisconnect called');
	LOG.warn(conn);
});

SR.Callback.onCrash(function (onDone) {
	LOG.warn('onCrash called');
}, 3000);

SR.Callback.onStart(function () {
	LOG.warn('server info:');
	LOG.warn(SR.Settings.SERVER_INFO);
});
