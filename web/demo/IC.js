// set base port
var base_port = 37070;
var mode = 'src';

// load necessary js scripts
// ref: http://stackoverflow.com/questions/2145914/including-a-js-file-within-a-js-file
function loadScript(src, f) {
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.src = src;
  var done = false;
  script.onload = script.onreadystatechange = function() { 
    // attach to both events for cross browser finish detection:
    if ( !done && (!this.readyState ||
      this.readyState == "loaded" || this.readyState == "complete") ) {
      done = true;
      if (typeof f == 'function') f();
      // cleans up a little memory:
      script.onload = script.onreadystatechange = null;
      head.removeChild(script);
    }
  };
  head.appendChild(script);
}

/*
// example:
loadScript('/some-other-script.js', function () { 
   alert('finished loading');
   finishSetup();
});
*/
/*
<script src="http://dev.imoncloud.com:37014/web/socket.io/socket.io.js"></script>
<script src="http://dev.imoncloud.com:37014/web/IC_REST_dev.js"></script>
*/

// init socket or RESTful connection
var initIC = function (type, onDone) {
	
	// load scripts
	loadScript('http://' + mode + '.imoncloud.com:37014/web/socket.io/socket.io.js', function () {
		loadScript('http://' + mode + '.imoncloud.com:37014/web/IC_REST_dev.js', function () {

			var REST_server = IC.mode + '.imoncloud.com:' + (base_port + 4);
			var socket_server = IC.mode + '.imoncloud.com:' + (base_port + 2);	
			
			switch (type) {
				case 'REST':
					IC.setRESTServer(REST_server);
					if (typeof onDone === 'function')
						onDone(true);
					break;
					
				case 'socket':
					IC.setSocketServer(socket_server, onDone);
					break;
					
				default:
					console.log('unknown type: ' + type);
					break;
			}
		});
	});
}