//
//  shared_states.js
//
//  test cases for IC.State functions
//

// put collections used here
IC.DB.useCollections([]);

// a pool for all message handlers
var l_handlers = exports.handlers = {};
var l_checkers = exports.checkers = {};

//-----------------------------------------
// define handlers (format checkers and event handlers)
//
//-----------------------------------------


l_handlers.SET_SHARED = function (event) {
	var key = event.data.key || 'test_key';
	var value = event.data.value || 'test_value';
	
	IC.State.setShared(key, value, function (err) {
		if (err)
			event.done('SET_SHARED', {result: false});
		else
			event.done('SET_SHARED', {result: true, key: key, value: value});
	});
}


//
// system events
//

IC.Callback.onStart(function () {

});

IC.Callback.onStop(function () {
	
});
