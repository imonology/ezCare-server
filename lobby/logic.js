// a pool for all message handlers
var l_handlers = exports.handlers = {};
var l_checkers = exports.checkers = {};

// defaults
const l_timeoutDefault = 10;			// timeout in seconds

// user records, indexed by user account
var l_users;

// device records, indexed by device_id
var l_devices;

// call lists, indexed by both account and device_id
var l_calllists;

// contact records, indexed by either an account or device_id
// {self:	'string',	contacts: {}}
var l_contacts;

SR.Callback.onStart(function () {
	
	LOG.warn('init data structures...');
	
	// init data structures
	SR.DS.init({
		models: {
			'User': {
				account:		'*string',	// 帳號名稱, must start with a letter
				//devices:		'object',	// 擁有裝置
			}, 
			'Device': {
				device_id:		'*string',	// assigned device ID, numbers ONLY				
				HW_id:			'string',	// hardware ID
				accounts:		'object',	// list of accounts that have added this device (obsolete)
				owners:			'object'	// list of owner accounts this device belongs
			},
			'CallList': {
				id:				'*string',	// account or device_ID to which this list is attached
				list:			'object'	// an array of different levels within a calllist: {target: 'string', timeout: 'number', hours: {start: 'number', end: 'number'}}
			},
			'Contact': {
				self:			'*string',	// account or device_ID maintaining the contact list
				list: 			'object'	// a map of other account/device_ID
			}
		}
	}, function (err, ref) {
		if (err) {
			LOG.error(err, l_name);	
		}

		l_users = ref['User'];
		l_devices = ref['Device'];
		l_calllists = ref['CallList'];
		l_contacts = ref['Contact'];
	});	
	
});

//
//	helpers
//

// check if an id is a valid account or device_id
var l_validateID = function (id) {
	return !(typeof id !== 'string' || (l_users.hasOwnProperty(id) === false && l_devices.hasOwnProperty(id) === false));
}


//
//	Device List API
//

// add a new contact (can be either device or remote) 
SR.API.add('ADD_CONTACT', {
	self:		'string',			// can be a device_id or account
	target:		'string',			// can be a device_id or account
	name:		'+string',			// label name used to make display easier
	mutual:		'+boolean'			// due to mutual add
}, function (args, onDone) {

	// check if self is valid
	if (l_validateID(args.self) === false) {
		return onDone('self [' + args.self + '] is not a valid account or device_id');
	}
	
	// check if target is valid
	if (l_validateID(args.target) === false) {
		return onDone('target [' + args.target + '] is not a valid account or device_id');
	}
	
	// default target name to its account/device_id
	if (typeof args.name !== 'string' || args.name === '') {
		args.name = args.target;
	}
	
	// if target is a device, check if we're the first to add it (will become its owner)
	// default is false
	var is_owner = false;
	if (l_users.hasOwnProperty(args.self) && 
		l_devices.hasOwnProperty(args.target) &&
		(!l_devices[args.target].owners || Object.keys(l_devices[args.target].owners).length === 0)) {
		l_devices[args.target].owners = {};
		l_devices[args.target].owners[args.self] = true;
		is_owner = true;
			
		// sync back change in devices
		l_devices[args.target].sync(function (err) {
			if (err) {
				LOG.error(err, l_name);	
			}
		});
	}
	
	var onUpdated = function (err) {
		if (err) {
			return onDone(err);
		}
		
		if (args.mutual === true) {
			return onDone(null, 'contact info updated');	
		}
		
		// add contact for the other party
		SR.API.ADD_CONTACT({
			self: 	args.target,
			target:	args.self,
			mutual: true
		}, function (err) {
			if (err) {
				return onDone(err);
			}
			
			// notify the other party of the change
			SR.Comm.publish(args.target, {type: 'CONTACT_UPDATED', data: l_contacts[args.target].list});
			onDone(null);
		});
	}
	
	// check if this is new contact list
	if (l_contacts.hasOwnProperty(args.self) === false) {
		var list = {};
		list[args.target] = {
			name: args.name,
			is_owner: is_owner
		}

		l_contacts.add({
			self: args.self,
			list: list
		}, onUpdated);
	} else {
		// just update
		var info = l_contacts[args.self];
		info.list[args.target] = {
			name: args.name,
			is_owner: is_owner
		};
		
		info.sync(onUpdated);		
	}
});

// remove a contact (can be either device or remote) 
SR.API.add('REMOVE_CONTACT', {
	self:		'string',			// can be a device_id or account
	target:		'string',			// can be a device_id or account
	mutual:		'+boolean'			// whether this is due to a mutual removal
}, function (args, onDone) {
	
	if (l_contacts.hasOwnProperty(args.self) === false) {
		return onDone('self [' + args.self + '] does not have a contact list');
	}
	
	var info = l_contacts[args.self];
	if (info.list.hasOwnProperty(args.target) === false) {
		return onDone('target [' + args.target + '] is not a contact');
	}
	
	// remove it & sync to DB
	delete info.list[args.target];
	info.sync(function (err) {
		if (err) {
			return onDone(err);
		}
		if (args.mutual === true) {
			return onDone(null);	
		}
		
		// perform a mutual contact removal
		SR.API.REMOVE_CONTACT({
			self:	args.target,
			target:	args.self,
			mutual:	true
		}, function (err) {
			if (err) {
				return onDone(err);
			}
			
			// notify the other party of the change
			SR.Comm.publish(args.target, {type: 'CONTACT_UPDATED', data: l_contacts[args.target].list});
			onDone(null);			
		});
	});
	
	// check if we need to remove ownership from device info
	if (l_devices.hasOwnProperty(args.target)) {
		 
		if (l_devices[args.target].owners &&  l_devices[args.target].owners.hasOwnProperty(args.self)) {
			delete l_devices[args.target].owners[args.self];
		} else {
			l_devices[args.target].owners = {};
		}	
		l_devices[args.target].sync(function (err) {
			if (err) {
				LOG.error(err);	
			}
		});
	}
});

// get a list of contacts for either device or remote
SR.API.add('GET_CONTACTS', {
	self:		'string',			// can be a device_id or account
}, function (args, onDone) {
	
	if (l_contacts.hasOwnProperty(args.self) === false) {
		// return an empty list
		return onDone(null, {});
	}
	
	onDone(null, l_contacts[args.self].list);
});


// add a given device id & name to a user account
SR.API.add('ADD_DEVICE', {
	account:	'string',
	device_id:	'string',
	device_name: '+string'
}, function (args, onDone) {
	
	SR.API.ADD_CONTACT({self: args.account, target: args.device_id, name: args.device_name}, onDone);
});

SR.API.add('REMOVE_DEVICE', {
	account:	'string',
	device_id:	'string'
}, function (args, onDone) {

	SR.API.REMOVE_CONTACT({self: args.account, target: args.device_id}, onDone);			
});

SR.API.add('GET_DEVICES', {
	account:	'string',
}, function (args, onDone) {

	SR.API.GET_CONTACTS({self: args.account}, function (err, result) {
		onDone(err, {
			account: args.account,
			devices: result
		});
	});	
});


var l_hardmap = {
	"1234567": 3737,
	"7654321": 7373
};

// register device hardware ID with server to get device_ID
SR.API.add('REGISTER_DEVICE', {
	HW_id:	'string',			// hardware ID
}, function (args, onDone) {
		
	// first check if already registered, return existing device_id
	for (var id in l_devices) {
		
		if (l_devices[id].HW_id === args.HW_id) {
			return onDone(null, {device_id: l_devices[id].device_id});
		}
	}
		  
	// otherwise generate a unique device_ID
	var device_id = undefined;
	for (var i=0; i < 10000; i++) {	
		// use hard-coded test mapping if available		
		var id = l_hardmap[args.HW_id] || UTIL.createID();
			
		// avoid redundency
		if (l_devices.hasOwnProperty(id) === false) {
			device_id = id;
			break;
		}
	}

	// unable to generate unique device_id
	if (!device_id) {
		return onDone('cannot create device_id!');
	}
	
	l_devices.add({
		HW_id: args.HW_id,
		device_id: device_id,
		owners: {}
	}, function (err) {
		if (err) {
			return onDone(err);	
		}
		onDone(null, {device_id: device_id});
	});
});

//
//	CallList API (decide who to call for multi-level calling)
//

// get call list attached to a given account or device_id
SR.API.add('GET_CALLLIST', {
	id:	'string'			// account or device_id	
}, function (args, onDone) {

	var id = args.id;	
	if (l_calllists.hasOwnProperty(id) === false) {
		//return onDone('calllist cannot be found for account or device_id [' + id + ']');
		// return empty calllist
		return onDone(null, {});
	}
	
	// otherwise simply return it
	onDone(null, l_calllists[id].list.data);
});

	


// set call list attached to a given account or device_id
SR.API.add('SET_CALLLIST', {
	id:		'string',	// account or device_id
	list:	'array'		// list stored	
}, function (args, onDone) {

	// validate input
	var list = args.list;	
	var id = args.id;
	
	if (list instanceof Array === false) {
		return onDone('CallList should be in the format of an array');
	}
	
	if (l_validateID(id) === false) {
		return onDone('[' + id + '] is not a valid account or device_id');		
	}
	
	// validate list content, each entry should conform to:
	// TODO: should move this function as part of checker (make it hierarchical) 
	
	//	{
	//		target: 	'string'		// account or device_id (?) to call
	//		timeout: 	'number'		// how many seconds before next is called
	//		hours:		{				// periods in which this target is valid
	//			start:	'number',
	//			end:	'number'
	//		}
	//	}
	
	var errlist = [];
	
	for (var i=0; i < list.length; i++) {
		var item = list[i];
		
		if (l_validateID(item.target) === false) {
			errlist.push(item.target);
			continue;
		}
		
		if (typeof item.timeout !== 'number' || item.timeout < 0) {
			item.timeout = l_timeoutDefault;	
			LOG.warn('[' + item.target + '] timeout not specified or invalid, set to ' + l_timeoutDefault + ' seconds');
		}
		
		// TODO: check 'hours'?
	}
	
	
	if (errlist.length > 0) {
		return onDone('calllist contains invalid target(s)', errlist);
	} 

	// add or update list
	if (l_calllists.hasOwnProperty(id)) {
		
		var calllist = l_calllists[id];
		calllist.list = {data: list};
		calllist.sync(function (err) {
			if (err) {
				return onDone(err);	
			}
			onDone(null, list.length + ' targets updated successfully!');			
		});
		
	} else {
		l_calllists.add({
			id: id,
			list: {
				data: list
			}
		}, function (err) {
			if (err) {
				return onDone(err);	
			}
			onDone(null, list.length + ' targets added successfully!');
		});
	}
});

SR.Callback.onStart(function () {
	
});
