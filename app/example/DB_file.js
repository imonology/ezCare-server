// a pool for all message handlers
var l_handlers = exports.handlers = {};
var l_checkers = exports.checkers = {};

IC.DB.useCollections(['log']);

var l_log_id = undefined;

// file object (to read / write a file)
global.g_file = undefined;

// define actions to do when lobby starts / stops
IC.Callback.onStart(function () {
	
	var data = UTIL.clone(IC.Settings.SERVER_INFO);
	data.startTime = new Date();

	// write something to DB	
	IC.DB.setData('log', data,
				 	function (result) {
						LOG.debug('store SERVER_INFO success, result: ');
						LOG.debug(result);
						l_log_id = result._id;
				  	}, 
				  	function (result) {
						LOG.warn('store SERVER_INFO fail, result: ');
						LOG.warn(result);
				  	});
	
	// open a file 	
	g_file = new IC.File();
	g_file.open('test.txt', 
				function (result) {
					LOG.debug('open file \'test.txt\' success, result: ' + result);
					g_file.writeLine(data.startTime);
				},
				function (result) {	
					LOG.warn('file open fail, result: ' + result);
				});
});

IC.Callback.onStop(function () {
	LOG.warn('lobby stops successfully');

	// record stoptime		
	var data = UTIL.clone(IC.Settings.SERVER_INFO);
	data.stopTime = new Date();
	IC.DB.setData('log', data);	
	
	// get something from DB
	IC.DB.getData('log', {_id: l_log_id},
				  	function (result) {
						// no result
						if (result === null)
							return;
						
						LOG.warn('get log success: ');
						LOG.warn(result);
						
						var duration = (new Date).getTime() - result.startTime.getTime();
						LOG.warn('server has run for: ' + duration);
				  	},
				  	function (result) {
						LOG.warn('get log fail, result: ');
						LOG.warn(result);					  
				  	})
	
	if (g_file) {
		g_file.close(function (result) {
			LOG.warn('file close result: ' + result);
			g_file = undefined;
		});
	}
});