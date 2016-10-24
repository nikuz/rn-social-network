'use strict';

import * as config from '../config';
import * as ajax from '../modules/ajax';
import * as settings from '../modules/settings';

// ----------------
// public methods
// ----------------

async function getFeeds(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    hashtag = opts.hashtag,
    page = opts.page || '',
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    });

  if (hashtag) {
    hashtag = `/hashtag/${hashtag}`;
  }
  if (page.length) {
    hashtag = '';
  }

  return ajax.get({
    url: `${config.API_URL}${hashtag}${page}?${params}`,
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
  getFeeds
};
