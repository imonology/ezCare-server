r = require('rethinkdb');
var connection = null;
r.connect( {host: 'rethinkdb', port: 28015}, function(err, conn) {
	
	if (err) throw err;
	connection = conn;
	
	
	
	var milliseconds = (new Date).getTime();
	var rnd = Math.floor((Math.random() * 10) + 1);
	
	r.db('meety').table('message').changes().run(connection, function(err, cursor) {
		if (err) throw err;
		cursor.each(function(err, row) {
			if (err) throw err;
			console.log(JSON.stringify(row, null, 2));
		});
	});
	
	
	
	
})
