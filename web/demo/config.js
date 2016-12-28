
// set base port
var base_port = 38130;
var mode = 'src';

// perform action only after page is loaded
document.addEventListener ("DOMContentLoaded", function () {
	
	var onConnected = (typeof onConnect === 'function' ? onConnect : function () {console.log('server connected'); });
	var onSocketEvent = (typeof onSocketEvent === 'function' ? onSocketEvent : undefined);
	
	// using server name to init
	//IC.setRESTServer('imoncloud-demo-lobby');
	//IC.setSocketServer({name: 'imoncloud-demo-lobby', onEvent: onSocketEvent, onDone: onConnect});
	
	// using assigned port to init
	//IC.setRESTServer(base_port, onConnect, true);
	IC.setSocketServer({port: base_port, onEvent: onSocketEvent, onDone: onConnected});
});

