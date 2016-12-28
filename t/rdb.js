r = require('rethinkdb');
var connection = null;
r.connect( {host: 'rethinkdb', port: 28015}, function(err, conn) {
	if (err) throw err;
	connection = conn;
	
	
	
	var milliseconds = (new Date).getTime();
	var rnd = Math.floor((Math.random() * 10) + 1);
	
	r.db('meety').table('message').insert([
		{
			"username":	"MyName",
			"channel":	"meety",
			"msg":		"Hello My MSG" + rnd + 1,
			"timestamp":	milliseconds + 1,
			"tid":		milliseconds + 1
		},
		{
			"username":	"MyName",
			"channel":	"meety",
			"msg":		"Hello My MSG" + rnd + 2,
			"timestamp":	milliseconds + 2,
			"tid":		milliseconds + 2
		},
		{
			"username":	"MyName",
			"channel":	"meety",
			"msg":		"Hello My MSG" + rnd + 3,
			"timestamp":	milliseconds + 3,
			"tid":		milliseconds + 3
		},
	]).run(connection, function(err, result) {
		if (err) throw err;
		console.log(JSON.stringify(result, null, 2));
	})
	
	
})
