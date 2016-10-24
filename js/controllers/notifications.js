'use strict';

import * as config from '../config';
import * as ajax from '../modules/ajax';

// ----------------
// public methods
// ----------------

function getNotifications(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    params = ajax.format({
      'api-json': config.API_VERSION
    }),
    url = opts.page || '/notifications/';

  return ajax.get({
    url: `${config.API_URL}${url}?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

// ---------
// interface
// ---------

export {
  getNotifications
};
