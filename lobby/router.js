var url = require('url');

var l_cache = SR.State.get('cache');

SR.Callback.onStart(function () {
	
});

module.exports = function (app) {
	
	app.get('/', function (req, res) { 
		var url_parts = url.parse(req.url, true);
		res.render('login', {title: 'ezCare'}) 
	}); 
	
	app.get('/main', function (req, res) { 
		
		// update latest event info from DB
		
		// read events
		SR.ORM.read({
			name: 'event'
		}, function (err, result) {
			if (err) {
				LOG.error(err);
				l_cache['event'] = [];
			} else {
				LOG.warn(result.length + ' events found in DB');
				l_cache['event'] = result;
			}
			
			res.render('main', {events: l_cache['event']}) 
		});
	});
}

