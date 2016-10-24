'use strict';

import * as config from '../config';
import * as ajax from '../modules/ajax';
import * as settings from '../modules/settings';

// ----------------
// public methods
// ----------------

async function get(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    type = opts.type && opts.type.length ? `/${opts.type}/` : '',
    page = opts.page,
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    });

  if (page) {
    type = '';
  } else {
    page = '';
  }

  return ajax.get({
    url: `${config.API_URL}${type}${page}?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function getItem(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    language = await settings.get('language'),
    params = {
      'api-json': config.API_VERSION,
      language: language.id
    };

  if (opts.postings && opts.link) {
    params.link = opts.link;
    params.postings = '';
  }
  params = ajax.format(params);

  return ajax.get({
    url: `${config.API_URL}${opts.url}?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

function likeItem(options, callback) {
  var cb = callback || function() {},
    opts = options || {};

  return ajax.post({
    url: `${config.API_URL}/?api-json=${config.API_VERSION}`,
    data: {
      [opts.type]: opts.id,
      mission: 'like'
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

async function getAddToAlbumForm(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    url = opts.url,
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    });

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

async function createAlbum(options, callback) {
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

async function saveToAlbum(options, callback) {
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

async function getReportAbuseForm(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    url = opts.url,
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    });

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

async function getDownloadLinks(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    url = opts.url,
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    });

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

async function getEmbeddedLinks(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    url = opts.url,
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    });

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

async function getSharingForm(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    url = opts.url,
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    });

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

async function share(options, callback) {
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

// ---------
// interface
// ---------

export {
  get,
  getItem,
  likeItem,
  getAddToAlbumForm,
  createAlbum,
  saveToAlbum,
  getReportAbuseForm,
  reportAbuse,
  getDownloadLinks,
  getEmbeddedLinks,
  getSharingForm,
  share
};
