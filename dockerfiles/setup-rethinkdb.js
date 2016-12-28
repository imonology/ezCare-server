r = require('rethinkdb');
var connection = null;
var done_count = 0;

console.log("Setup RethinkDB initial data...");

r.connect( {host: 'rethinkdb', port: 28015}, function(err, conn) {
	if (err) throw err;
	connection = conn;
	
	r.dbCreate('meety').run(connection, function(err, result) {
		if (err) throw err;
		//~ console.log(JSON.stringify(result, null, 2));
		console.log('DB "meety" created.');
		
		r.db('meety').tableCreate('message').run(conn, function(err, result) {
			if (err) throw err;
			//~ console.log(JSON.stringify(result, null, 2));
			console.log('Table "message" created.');
			
			done_count++;
			if (done_count === 2) { connection.close(function(err) { if (err) throw err; }) };
			
		});
		
		r.db('meety').tableCreate('channel').run(conn, function(err, result) {
			if (err) throw err;
			//~ console.log(JSON.stringify(result, null, 2));
			console.log('Table "channel" created.');
			
			r.db('meety').table('channel').insert([
				{
					"desc": "Meety" ,
					"member": [
						"yy" ,
						"BlueT" ,
						"focaaby"
					] ,
					"name": "meety" ,
					"title": "Meety"
				}
			]).run(connection, function(err, result) {
				if (err) throw err;
				//~ console.log(JSON.stringify(result, null, 2));
				console.log('Default channel "meety" created.');
				
				done_count++;
				if (done_count === 2) { connection.close(function(err) { if (err) throw err; }) };
			})
			
			
		});
		
	});
	
})
