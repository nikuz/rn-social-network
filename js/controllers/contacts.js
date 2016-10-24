'use strict';

import * as config from '../config';
import * as ajax from '../modules/ajax';
import * as settings from '../modules/settings';

// ----------------
// public methods
// ----------------

async function getFeedbackForm(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    });

  return ajax.get({
    url: `${config.API_URL}/feedback/?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function feedback(options, callback) {
  var opts = options || {},
    cb = callback || function() {};

  opts.language = await settings.get('language').id;

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

async function getImprint(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    });

  return ajax.get({
    url: `${config.API_URL}/?imprint&${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function getTerms(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    });

  return ajax.get({
    url: `${config.API_URL}/?termsofservice&${params}`,
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
  getFeedbackForm,
  feedback,
  getImprint,
  getTerms
};
