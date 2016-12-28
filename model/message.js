var r = require('rethinkdb');
var connection = null;


var r_settings = {};
r_settings = UTIL.userSettings('rethinkdb');
//~ r_settings = {host: '172.17.0.3', port: 28015};
//~ r.connect( {host: '172.17.0.3', port: 28015}, function(err, conn) {
//~ r.connect( {host: 'localhost', port: 32769}, function(err, conn) {
r.connect(r_settings , function(err, conn) {
	if (err) throw err;
	connection = conn;
	
});

function Message(data) {
	//~ if (data) {
		//~ this.type = data.type.toLowerCase() || '';
		//~ this.host = data.host || '';
		//~ this.port = data.port || '';
		//~ this.dataport = data.dataport || '';
		//~ this.name = data.name || '';
		//~ this.user = data.user || '';
		//~ this.passwd = data.passwd || '';
		//~ this.streamIDs = data.streamIDs || [];
	//~ }
}

Message.prototype.save = function (data, onDone, onFail) {
	
	r.db('meety').table('message')
	.insert([
		data
	])
	.run(connection, function(err, result) {
		if (err) {
			onFail(err, result, data);
			//~ throw err;
		} else {
			onDone(undefined, result, data);
			console.log(JSON.stringify(result, null, 2));
		}
	});
	
}


Message.prototype.fetch = function (query, onDone, onFail) {
	
	r.db('meety').table('message')
	.filter(r.row('channel').eq(query.channel))
	.orderBy('timestamp')
	.run(connection, function(err, cursor) {
		if (err) {
			onFail(err, query);
			//~ throw err;
		} else {
			
			cursor.toArray(function(err, result) {
				if (err) {
					onFail(err, result, query);
					//~ throw err;
				} else {
					onDone(undefined, result, query);
					console.log(JSON.stringify(result, null, 2));
				}
				
			});
		}
		
	});

}

Message.prototype.watch = function (onFail, onData) {
	
	r.db('meety').table('message')
	.changes()
	.run(connection, function(err, cursor) {
		
		if (err) {
			onFail(err);
			//~ throw err;
		} else {
			cursor.each(function(err, row) {
				if (err) {
					onFail(err, row);
					//~ throw err;
				} else {
					console.log("got ya");
					onData(undefined, row);
					//~ console.log(JSON.stringify(row, null, 2));
				}
			});
		}
		
	});
	
}


module.exports = new Message;
