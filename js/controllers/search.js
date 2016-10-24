'use strict';

import * as config from '../config';
import * as ajax from '../modules/ajax';
import * as settings from '../modules/settings';

// ----------------
// public methods
// ----------------

async function search(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      suggestion: opts.value,
      language: language.id,
      particular: 'frameless'
    });

  return ajax.get({
    url: `${config.API_URL}/?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function extendedSearch(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    type = opts.type,
    page = opts.page,
    text = opts.text,
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    }),
    searchUrl = `/search/${text}`;

  if (type && !page) {
    searchUrl += '/search-scope/' + type;
  } else if (page) {
    searchUrl = page;
  }

  return ajax.get({
    url: `${config.API_URL}${searchUrl}?${params}`,
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
  search,
  extendedSearch
};
