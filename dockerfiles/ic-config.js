/*
	NOTE: this file is machine-specific,
		  and should be changed when ImonCloud is deployed to different servers
*/

var servers = {};

exports.config = {
	
	// current modes are: 'dev', 'prod'
	MODE: 'dev',
	
	DOMAIN_LOBBY:	'localhost',
	IP_LOBBY:   '127.0.0.1',
	IP_MONITOR:	'127.0.0.1',
	DB_IP:      'mongodb',
	DB_PORT:    27017,
	
	DB_ADMIN: {
		account:  'dbadmin',
		pass:     'dbadmin-pass'
	},
	
	
	// path to user projects (for starting servers in IC.Execute)
	PATH_USERBASE:	'/home/imoncloud/users/',
	
	//
	// mail server config
	//
	EMAIL_CONFIG: {
		user:    "<account>", 
		password:"<password>", 
		host:    "smtp.gmail.com", 
		ssl:     true
	},
	
	DEFAULT_FILES:	['index.htm', 'index.html', 'default.htm', 'default.html'],
	EMAIL_ADMIN:	'shunyunhu@gmail.com, chryslerwrangler@gmail.com, bluet@bluet.org',
	//~ LOG_LEVEL:	'DEBUG',		// error, warn, debug, verbose
	twilio_public_account: {
		sid : "<sid>",
		auth_token : "<auth_token>",
		num : "<phone_number>"
	},
	ftp: {
		username: "<username>",
		password: "<password>"
	},
}
