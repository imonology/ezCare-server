/*  drupal Auth wrapper
 *  wrap functions of druapl sso services;
 */
var l_handlers = exports.handlers = {};
var l_checkers = exports.checkers = {};

var request = require('request');

var l_name = 'drupalAuth';

// user records, indexed by user account
var l_users;

// get reference to data
SR.Callback.onStart(function () {
	l_users = SR.State.get('UserMap');
});


// ensure if a connection is login;
// use session in extra object
SR.API.add('isAuth', function (args, onDone, extra) {
		var res = {};
		res.msg = '';

		// record access count
		if (typeof extra.session.count === 'undefined') {
			extra.session.count = 1;
		} else {
			extra.session.count++;
		}

		LOG.warn(extra);
				
		if (typeof extra.session.sessid !== 'undefined') {
			msg = 'is login';
			res.login = true;
			res.msg = msg;
			var user = {
				account: extra.session.user.name,
				mail: extra.session.user.mail
			};
			res.user = user;
			onDone(null, res);
		} else {
			res.msg = 'not login';
			res.login = false;
			onDone(null, res);
		}
	}
);

// login wrapper
// use session in extra object to store login status
// extra.session.drupalLogin

SR.API.add('drupalLogin', {
		username: 'string',
		password: 'string'
	}, function (args, onDone, extra) {
		var url = 'http://ezcare.info/?q=api/user/login';
		request.post( url, 
			{ json: {	username: args.username, 
						password: args.password} },
			function (error, response, body) {
				if (error) {
					LOG.error(error);
					return;
				}
				
				if (response.statusCode !== 200) { 
					LOG.warn('status: ' + response.statusCode, l_name);
					return onDone('auth error, code: ' + response.statusCode);
				}
				
				// auth success
				
				// object copy to session
				for (var key in body) {
					if (body.hasOwnProperty(key))
						extra.session[key] = body[key];
				}
				
				var onUpdate = function (err) {
					if (err) {
						LOG.error(err);
						return onDone(err);
					}
					onDone(null, body);
				}
				
				// body.user: {name: 'string', mail: 'string'}
				// store to account cache
				var user = body.user;
				if (l_users.hasOwnProperty(user.name) === false) {
					l_users.add({
						account:	user.name,
					}, onUpdate);
				} else {
					onDone(null);	
				}
			}
		);
	}
);

// logout wrapper
// destory extra.session object to logout
SR.API.add('drupalLogout', 
	function (args, onDone, extra) {
		for (var key in extra.session) {
			delete extra.session[key];
		}
		LOG.warn(extra);
		var res = {};
		res.msg = 'logout';
		res.login = false;
		onDone(null, res);
	}
);
