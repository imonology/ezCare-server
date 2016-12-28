//
//  handler.js
//
//  main server logic
//

// put collections used here
//~ SR.DB.useCollections(['test2']);

// a pool for all message handlers
var l_handlers = exports.handlers = {};
var l_checkers = exports.checkers = {};

var Message = require('../model/message.js');
var Channel = require('../model/channel.js');


//-----------------------------------------
// define handlers (format checkers and event handlers)
//
//-----------------------------------------

// counter that'll be reset upon reloading
var reset_counter = 0;

// counter that won't be reset upon script reloading
var l_states = SR.State.get('counters');
//~ var l_states = {};

if (typeof l_states.counter === 'undefined')
	l_states['counter'] = 0;

// test event
l_checkers.HELLO_EVENT = {
	//name: 'string'
};

// before_dispatch checker for SR.s Subscribe handler
l_checkers.SR.SUBSCRIBE = function (event_data) {
	//name: 'string'
};

l_handlers.HELLO_EVENT = function (event) {
    
	// print some message
	LOG.debug('HELLO_EVENT has been called');
	LOG.warn(event);
	
	if (!event.data.age) {
		LOG.error('no age sent to HELLO_EVENT!', 'lobby');	
	}
	
	// increment counters
	reset_counter++;
	l_states['counter']++;
	
	var age = event.data.age ? parseInt(event.data.age) : 0;
	age = age + 10;
	
	// send back response
	event.done('HELLO_REPLY', {name: event.data.name, age: age, 中文: '中文也通!', 
							   reset_counter: reset_counter, persist_counter: l_states['counter']});
}

l_checkers.TEST_SERVER_PUSH = {
	channel:	'string'	
}

l_handlers.TEST_SERVER_PUSH = function (event) {
	LOG.warn(event);		
	var channel = event.data.channel;
	SR.Comm.publish(channel, {data: (event.data.msg || 'nothing sent')});
	event.done({err: 0, msg: 'data sent to ' + channel});
}

// test session
l_handlers.TEST_SESSION = function (event) {
    
	// print some message
	LOG.debug('TEST_SESSION called');
	LOG.warn(event);
	
	if (event.data.id)
		event.session['id'] = event.data.id;
	else
		LOG.warn('id: ' + event.session['id']);
	
	// do something..
	
	// send back response
	event.done('TEST_SESSION_REPLY', {result: true, msg: 'you can modify this', name: 'johnny'});
}


l_handlers.get_channel = function (event) {
	
	// print some message
	LOG.warn(event);
	// event.data.range
	
	var tid = event.data.tid;
	
	//~ var channel = event.data.channel || undefined;
	
	Channel.fetch(
		event.data.channel,
		function (undefined, result, query) {
			event.done({ok: result, tid: tid});
		},
		function (err, result, query) {
			event.done({err: err, tid: tid});
		}
	);	
}


l_handlers.update_channel = function (event) {
	
	// print some message
	LOG.warn(event);
	// event.data.range
	
	var tid = delete event.data.tid;
	
	//~ var channel = event.data.channel || undefined;
	
	Channel.update(
		event.data,
		function (undefined, result, query) {
			event.done({ok: result, tid: tid});
		},
		function (err, result, query) {
			event.done({err: err, tid: tid});
		}
	);
	
}


l_handlers.get_message = function (event) {
	
	// print some message
	LOG.warn(event);
	// event.data.range
	
	var tid = event.data.tid;
	
	var query = {};
	query.channel = event.data.channel || "meety";
	
	if (event.data.range) {
		query.range = event.data.range;
	}
	
	Message.fetch(
		query,
		function (undefined, result, query) {
			event.done({ok: result, tid: tid});
		},
		function (err, result, query) {
			event.done({err: err, tid: tid});
		}
	);
	
	
	// send back response
	//~ event.done('TEST_SESSION_REPLY', {result: true, msg: 'you can modify this', name: 'johnny'});
	//~ return event.done(eventName, resERR('dberror'));
}


l_handlers.send_message = function (event) {
	
	// print some message
	LOG.warn(event);
	// event.data.message
	
	// transaction id
	var tid =  delete event.data.tid;
	
	Message.save(
		event.data,
		function (undefined, result, data) {
			event.done({ok: result, tid: tid});
		},
		function (err, result, data) {
			event.done({err: err, tid: tid});
		}
	);
	
	// send back response
	//~ event.done('TEST_SESSION_REPLY', {result: true, msg: 'you can modify this', name: 'johnny'});
	//~ return event.done(eventName, resERR('dberror'));
}


//
// system events
//

SR.Callback.onStart(function () {
	
	//~ console.log("Message: ");
	//~ console.log(Message);
	
	Message.watch(
		function (err) {
			// onFail
			LOG.error(err);
		},
		function (err, msg) {
			// onData
			//SR.Comm.list();
			console.log("MSG: ");
			console.log(msg);
			console.log("CHANNEL: ");
			console.log(msg.new_val.channel);
			console.log("kerker");
			SR.Comm.publish(msg.new_val.channel, {data: msg});
		}
	);
	
});


SR.Callback.onStop(function () {
	
});
