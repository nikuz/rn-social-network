'use strict';

import * as _ from 'underscore';
import * as config from '../config';
import * as ajax from '../modules/ajax';
import * as settings from '../modules/settings';

// ----------------
// public methods
// ----------------

function getList(options = {}, callback = _.noop) {
  var params = {
      'api-json': config.API_VERSION
    },
    url = '';

  if (options.page) {
    url = options.page;
  } else {
    _.extend(params, {
      letters: '',
      offcanvas: ''
    });
  }

  params = ajax.format(params);

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

function getListByUser(options = {}, callback = _.noop) {
  var params = ajax.format({
      'api-json': config.API_VERSION
    }),
    url = options.url;

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

function getRemoveForm(options = {}, callback = _.noop) {
  return ajax.get({
    url: `${config.API_URL}${options.url}?api-json=${config.API_VERSION}`,
    responseDataType: 'json',
    success: function(response) {
      callback(null, response);
    },
    error: function(err) {
      callback(err);
    }
  });
}

async function remove(options = {}, callback = _.noop) {
  var language = await settings.get('language');
  options.language = language.id;

  return ajax.post({
    url: `${config.API_URL}/?api-json=${config.API_VERSION}`,
    data: options,
    responseDataType: 'json',
    success: function(response) {
      callback(null, response);
    },
    error: function(err) {
      callback(err);
    }
  });
}

async function add(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    language = await settings.get('language');

  return ajax.post({
    url: `${config.API_URL}/?api-json=${config.API_VERSION}`,
    data: {
      letters: '',
      user: opts.user,
      mission: 'letter',
      'letter-text': opts.text,
      language: language.id
    },
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

function refresh(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    params = ajax.format({
      'api-json': config.API_VERSION,
      refresh: 10,
      'refresh-0': encodeURI(ajax.format(opts))
    });

  return ajax.get({
    url: `${config.API_URL}/?refresh&${params}`,
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
  getList,
  getListByUser,
  getRemoveForm,
  remove,
  add,
  refresh
};
