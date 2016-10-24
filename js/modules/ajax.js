'use strict';

import * as _ from 'underscore';

function addParamsMarker(rUrl) {
  return (/\?/.test(rUrl) ? '&' : '?');
}

function paramsSerialise(data) {
  var dataString = '';
  _.each(data, (value, key) => {
    if (_.isArray(value)) {
      _.each(value, item => {
        dataString += `${key}[]=${encodeURIComponent(item)}&`;
      });
    } else {
      dataString += `${key}=${encodeURIComponent(value)}&`;
    }
  });
  return dataString.replace(/&$/, '');
}

function paramsSerialiseMultipart(data) {
  var formData = new FormData();
  _.each(data, (value, key) => {
    if (_.isArray(value) && key !== 'files') {
      _.each(value, item => {
        formData.append(key, item);
      });
    } else if (key === 'files') {
      _.each(value, item => {
        formData.append(item.name, {
          uri: item.uri,
          name: item.name,
          type: 'image/' + item.name.match(/[^.]+$/)[0]
        });
      });
    } else {
      formData.append(key, value);
    }
  });
  return formData;
}

function ajax(options) {
  var opts = options || {},
    request = new XMLHttpRequest,
    success = opts.success || _.noop,
    error = opts.error || _.noop,
    rType = opts.type,
    rUrl = opts.url,
    dataString = null;

  if (opts.cache === false) {
    rUrl += `${addParamsMarker(rUrl)}t=${Date.now()}`;
  }
  if (rType === 'GET' && opts.data) {
    rUrl += addParamsMarker(rUrl) + paramsSerialise(opts.data);
  }

  request.open(rType, rUrl, true);

  if (opts.data && (rType === 'POST' || rType === 'PUT')) {
    let contentType;
    if (opts.requestDataType === 'json') {
      contentType = 'application/json';
      if (_.isObject(opts.data)) {
        dataString = JSON.stringify(opts.data);
      } else if (_.isString(opts.data)) {
        dataString = opts.data;
      }
    } else {
      if (opts.data.files) {
        contentType = 'multipart/form-data';
        dataString = paramsSerialiseMultipart(opts.data);
      } else {
        contentType = 'application/x-www-form-urlencoded';
        dataString = paramsSerialise(opts.data);
      }
    }
    request.setRequestHeader('content-type', contentType);
  }
  if (opts.headers) {
    _.each(opts.headers, function(value, key) {
      request.setRequestHeader(key, value);
    });
  }

  request.onload = function() {
    var response = request.responseText;
    if (request.status >= 200 && request.status < 400) {
      if (opts.responseDataType === 'json') {
        try {
          response = JSON.parse(response);
        } catch (err) {
          return error(err);
        }
      }
      success(response);
    } else {
      error(request.status || response);
    }
  };

  request.onerror = function(response) {
    error(response);
  };

  request.send(dataString || null);
  return request;
}

// ----------------
// public methods
// ----------------

function get(options) {
  return ajax(_.extend(options, {
    type: 'GET'
  }));
}

function post(options) {
  return ajax(_.extend(options, {
    type: 'POST'
  }));
}

function put(options) {
  return ajax(_.extend(options, {
    type: 'PUT'
  }));
}

function format(obj) {
  return paramsSerialise(obj);
}

function abort(promise, cb) {
  var aborted = false;
  for (let i in promise) {
    if (promise.hasOwnProperty(i) && promise[i] instanceof XMLHttpRequest) {
      promise[i].abort();
      aborted = true;
    }
  }
  if (cb) {
    cb(aborted);
  }
}

// ---------
// interface
// ---------

export {
  get,
  post,
  put,
  format,
  abort
};
