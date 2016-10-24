'use strict';

import * as config from '../config';
import * as ajax from '../modules/ajax';
import * as settings from '../modules/settings';

// ----------------
// public methods
// ----------------

function getUploads(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    params = ajax.format({
      'api-json': config.API_VERSION
    }),
    url = opts.page || '/queues/';

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

function getUploadsForms(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    params = ajax.format({
      'api-json': config.API_VERSION
    });

  return ajax.get({
    url: `${config.API_URL}/?upload&${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function uploadFiles(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    language = await settings.get('language');

  opts.language = language.id;

  return ajax.post({
    url: `${config.API_URL}?api-json=${config.API_VERSION}`,
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

async function uploadLinks(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    language = await settings.get('language');

  opts.language = language.id;

  return ajax.post({
    url: `${config.API_URL}?api-json=${config.API_VERSION}`,
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

async function uploadArticle(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    language = await settings.get('language');

  opts.language = language.id;

  return ajax.post({
    url: `${config.API_URL}?api-json=${config.API_VERSION}`,
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

// ---------
// interface
// ---------

export {
  getUploads,
  getUploadsForms,
  uploadFiles,
  uploadLinks,
  uploadArticle
};
