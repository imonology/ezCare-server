var r = require('rethinkdb');
var connection = null;


var r_settings = {};
r_settings = UTIL.userSettings('rethinkdb');
//~ r_settings = {host: '172.17.0.3', port: 28015};
//~ r.connect( {host: '172.17.0.3', port: 28015}, function(err, conn) {
//~ r.connect( {host: 'localhost', port: 32769}, function(err, conn) {
r.connect(r_settings, function(err, conn) {
	if (err) throw err;
	connection = conn;
	
});

function Channel(data) {
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

//~ Channel.prototype.save = function (data, onDone, onFail) {
	
	//~ r.db('meety').table('message')
	//~ .insert([
		//~ data
	//~ ])
	//~ .run(connection, function(err, result) {
		//~ if (err) {
			//~ onFail(err, result, data);
		//~ } else {
			//~ onDone(undefined, result, data);
			//~ console.log(JSON.stringify(result, null, 2));
		//~ }
	//~ });
	
//~ }


Channel.prototype.fetch = function (query, onDone, onFail) {
	
	var table_channel = r.db('meety').table('channel');
	
	if (query) {
		table_channel = table_channel.filter(r.row('name').eq(query));
	}
	table_channel.run(connection, function(err, cursor) {
		if (err) {
			onFail(err, query);
		} else {
			
			cursor.toArray(function(err, result) {
				if (err) {
					onFail(err, result);
				} else {
					onDone(undefined, result, query);
					console.log(JSON.stringify(result, null, 2));
				}
				
			});
		}
	});
}


Channel.prototype.update = function (data, onDone, onFail) {
	
	console.log(data);
	
	r.db('meety').table('channel')
	.filter(r.row('name').eq(data.name))
	.update(data)
	.run(connection, function(err, result) {
		if (err) {
			onFail(err, result, data);
		} else {
			onDone(undefined, result, data);
			console.log(JSON.stringify(result, null, 2));
		}
	});
	
}


//~ Channel.prototype.watch = function (onFail, onData) {
	
	//~ r.db('meety').table('message')
	//~ .changes()
	//~ .run(connection, function(err, cursor) {
		
		//~ if (err) {
			//~ onFail(err);
		//~ } else {
			//~ cursor.each(function(err, row) {
				//~ if (err) {
					//~ onFail(err, row);
				//~ } else {
					//~ onData(undefined, row);
					//~ console.log(JSON.stringify(row, null, 2));
				//~ }
			//~ });
		//~ }
		
	//~ });
	
//~ }


module.exports = new Channel;
