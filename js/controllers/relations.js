'use strict';

import * as config from '../config';
import * as ajax from '../modules/ajax';

// ----------------
// public methods
// ----------------

function get(options = {}, callback = () => {}) {
  var url = options.url,
    params = ajax.format({
      'api-json': config.API_VERSION
    });

  if (!url) {
    url = '/relations' + (options.subUrl || '/');
  }
  if (options.page) {
    url = options.page;
  }

  return ajax.get({
    url: `${config.API_URL}${url}?${params}`,
    responseDataType: 'json',
    success: function(response) {
      callback(null, response);
    },
    error: function(err) {
      callback(err);
    }
  });
}

function follow(options = {}, callback = () => {}) {
  return ajax.post({
    url: `${config.API_URL}${options.url}?api-json=${config.API_VERSION}`,
    responseDataType: 'json',
    data: options.data,
    success: function(response) {
      callback(null, response);
    },
    error: function(err) {
      callback(err);
    }
  });
}

function unfollow(options = {}, callback = () => {}) {
  return ajax.post({
    url: `${config.API_URL}${options.url}?api-json=${config.API_VERSION}`,
    responseDataType: 'json',
    data: options.data,
    success: function(response) {
      callback(null, response);
    },
    error: function(err) {
      callback(err);
    }
  });
}

function block(options = {}, callback = () => {}) {
  return ajax.post({
    url: `${config.API_URL}${options.url}?api-json=${config.API_VERSION}`,
    responseDataType: 'json',
    data: options.data,
    success: function(response) {
      callback(null, response);
    },
    error: function(err) {
      callback(err);
    }
  });
}

function unblock(options = {}, callback = () => {}) {
  return ajax.post({
    url: `${config.API_URL}${options.url}?api-json=${config.API_VERSION}`,
    responseDataType: 'json',
    data: options.data,
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
  get,
  follow,
  unfollow,
  block,
  unblock
};
