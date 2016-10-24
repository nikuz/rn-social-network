'use strict';

import * as config from '../config';
import * as ajax from '../modules/ajax';
import DeviceInfo from 'react-native-device-info';

// ----------------
// public methods
// ----------------

function getInitialData(options = {}, callback = () => {}) {
  var params = {
      'api-json': config.API_VERSION
    },
    headers;

  if (options.language) {
    params.language = options.language;
  } else {
    headers = {
      'Accept-Language': DeviceInfo.getDeviceLocale().substring(0, 2)
    };
  }

  params = ajax.format(params);

  return ajax.get({
    url: `${config.API_URL}/languages/?${params}`,
    requestDataType: 'json',
    responseDataType: 'json',
    headers: headers,
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
  getInitialData
};
