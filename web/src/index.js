import React from 'react';
import { render }  from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

 import App from './js/app';
 // import Test from './js/test';

function requireAuth(nextState, replace) {

	// auth.loggedIn( function () {
	// 	replace({
	// 		pathname: '/login',
	// 		state: { nextPathname: nextState.location.pathname }
	// 	});
	// 	location.href = './#/login';
	// });
};


render((
  <Router history={hashHistory}>
    <Route path="/" component={App} />
  </Router>
), document.getElementById('app'));
