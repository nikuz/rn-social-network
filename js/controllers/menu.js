'use strict';

import * as config from '../config';
import * as ajax from '../modules/ajax';
import * as settings from '../modules/settings';

// ----------------
// public methods
// ----------------

async function get(options, callback = () => {}) {
  var params = ajax.format({
    'api-json': config.API_VERSION,
    language: (await settings.get('language')).id
  });

  return ajax.get({
    url: `${config.API_URL}/languages/?${params}`,
    responseDataType: 'json',
    success: function(response) {
      callback(null, response);
    },
    error: function(err) {
      callback(err);
    }
  });
}

// ---------
// interface
// ---------

export {
  get
};
