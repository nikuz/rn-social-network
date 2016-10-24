'use strict';

import * as config from '../config';
import * as ajax from '../modules/ajax';
import * as settings from '../modules/settings';

// ----------------
// public methods
// ----------------

async function add(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    language = await settings.get('language');

  return ajax.post({
    url: `${config.API_URL}/?api-json=${config.API_VERSION}`,
    data: {
      [opts.type]: opts.id,
      postings: 'inline',
      'posting-text': opts.text,
      language: language.id,
      mission: 'posting'
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

async function like(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    language = await settings.get('language');

  return ajax.post({
    url: `${config.API_URL}/?api-json=${config.API_VERSION}`,
    data: {
      posting: opts.id,
      mission: 'like',
      language,
      particular: 'frameless'
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

async function getReportAbuseForm(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    url = opts.url,
    language = await settings.get('language');

  return ajax.get({
    url: `${config.API_URL}${url}?api-json=${config.API_VERSION}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function reportAbuse(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    language = await settings.get('language');

  opts.language = language.id;
  
  return ajax.post({
    url: `${config.API_URL}/?api-json=${config.API_VERSION}`,
    data: opts,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

function getEditForm(options, callback) {
  var cb = callback || function() {},
    opts = options || {};

  return ajax.get({
    url: `${config.API_URL}${opts.url}?api-json=${config.API_VERSION}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function save(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    language = await settings.get('language');

  opts.language = language.id;

  return ajax.post({
    url: `${config.API_URL}/?api-json=${config.API_VERSION}`,
    data: opts,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

function getRemoveForm(options, callback) {
  var cb = callback || function() {},
    opts = options || {};

  return ajax.get({
    url: `${config.API_URL}${opts.url}?api-json=${config.API_VERSION}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function remove(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    language = await settings.get('language');

  opts.language = language.id;

  return ajax.post({
    url: `${config.API_URL}/?api-json=${config.API_VERSION}`,
    data: opts,
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
  add,
  like,
  getReportAbuseForm,
  reportAbuse,
  getEditForm,
  save,
  getRemoveForm,
  remove,
  refresh
};
