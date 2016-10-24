'use strict';

import * as _ from 'underscore';
import * as storage from './storage';
import CookieManager from 'react-native-cookies';

// CookieManager.clearAll(function() {
//   console.log('Cookie cleared');
// });

// ----------------
// public methods
// ----------------

async function isAuthorized() {
  return await storage.get('account');
}

function login(options) {
  var opts = options || {};
  storage.set('account', opts);
}

async function logout(callback) {
  var cb = callback || _.noop;
  await storage.remove('account');
  CookieManager.clearAll(function() {
    cb();
  });
}

// ---------
// interface
// ---------

export {
  isAuthorized,
  login,
  logout
};
