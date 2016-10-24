'use strict';

import * as config from '../config';
import * as ajax from '../modules/ajax';
import * as settings from '../modules/settings';

// ----------------
// public methods
// ----------------

function getLanguages(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: opts.language
    });

  return ajax.get({
    url: `${config.API_URL}/languages/?${params}`,
    requestDataType: 'json',
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function getLoginFormsData(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    });

  return ajax.get({
    url: `${config.API_URL}/?signin&${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

function login(options, callback) {
  var cb = callback || function() {},
    opts = options || {};

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

function restorePassword(options, callback) {
  var cb = callback || function() {},
    opts = options || {};

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

async function getFeeds(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    user = `/user/${opts.user}`,
    type = opts.type && opts.type.length ? `/${opts.type}/` : '',
    page = opts.page,
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    });

  if (page) {
    type = '';
    user = '';
  } else {
    page = '';
  }

  return ajax.get({
    url: `${config.API_URL}${user}${type}${page}?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

function getProfile(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    params = ajax.format({
      'api-json': config.API_VERSION
    });

  return ajax.get({
    url: `${config.API_URL}/account/?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

function getRemoveImageForm(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    url = opts.url,
    params = ajax.format({
      'api-json': config.API_VERSION
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

function removeAvatar(options, callback) {
  var opts = options || {},
    cb = callback || function() {};

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

function removePoster(options, callback) {
  var opts = options || {},
    cb = callback || function() {};

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

async function suggestRequest(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    language = await settings.get('language'),
    params = ajax.format({
      signin: '',
      localize: opts.value,
      language: language.id,
      'api-json': config.API_VERSION
    });

  return ajax.get({
    url: `${config.API_URL}?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

function save(options, callback) {
  var opts = options || {},
    cb = callback || function() {};

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

async function getPasswordForm(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    language = await settings.get('language'),
    params = ajax.format({
      account: 'access',
      language: language.id,
      'api-json': config.API_VERSION
    });

  return ajax.get({
    url: `${config.API_URL}?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

function passwordSave(options, callback) {
  var opts = options || {},
    cb = callback || function() {};

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

async function getEmailPhoneForm(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    language = await settings.get('language'),
    params = ajax.format({
      account: 'emailphone',
      language: language.id,
      'api-json': config.API_VERSION
    });

  return ajax.get({
    url: `${config.API_URL}?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function getPersonalForm(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    language = await settings.get('language'),
    params = ajax.format({
      account: 'personal',
      language: language.id,
      'api-json': config.API_VERSION
    });

  return ajax.get({
    url: `${config.API_URL}?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

function personalSave(options, callback) {
  var opts = options || {},
    cb = callback || function() {};

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

async function history(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    page = opts.page,
    language = await settings.get('language'),
    params = ajax.format({
      'api-json': config.API_VERSION,
      language: language.id
    });

  if (!page) {
    page = '/';
    params += '&history';
  }

  return ajax.get({
    url: `${config.API_URL}${page}?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function checkUsername(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    language = await settings.get('language'),
    params = ajax.format({
      signin: '',
      'api-json': config.API_VERSION,
      language: language.id,
      'check-username': opts.value,
      particular: 'frameless'
    });

  return ajax.get({
    url: `${config.API_URL}?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function checkPassword(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    language = await settings.get('language'),
    params = ajax.format({
      signin: '',
      'api-json': config.API_VERSION,
      language: language.id,
      'check-password': opts.value,
      particular: 'frameless'
    });

  return ajax.get({
    url: `${config.API_URL}?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function checkEmail(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    language = await settings.get('language'),
    params = ajax.format({
      signin: '',
      'api-json': config.API_VERSION,
      language: language.id,
      'check-email': opts.value,
      particular: 'frameless'
    });

  return ajax.get({
    url: `${config.API_URL}?${params}`,
    responseDataType: 'json',
    success: function(response) {
      cb(null, response);
    },
    error: function(err) {
      cb(err);
    }
  });
}

async function checkPhone(options, callback) {
  var cb = callback || function() {},
    opts = options || {},
    language = await settings.get('language'),
    params = ajax.format({
      signin: '',
      'api-json': config.API_VERSION,
      language: language.id,
      'check-phone': opts.value,
      particular: 'frameless'
    });

  return ajax.get({
    url: `${config.API_URL}?${params}`,
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

async function registration(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
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

async function addEmail(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
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

async function emailResendCode(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
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

async function emailActivate(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
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

async function getRemoveEmailPhoneForm(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    language = await settings.get('language'),
    params = ajax.format({
      language: language.id,
      'api-json': config.API_VERSION
    });

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

async function removeEmailPhone(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
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
  getLanguages,
  getLoginFormsData,
  login,
  restorePassword,
  getFeeds,
  getProfile,
  getRemoveImageForm,
  removeAvatar,
  removePoster,
  suggestRequest,
  save,
  getPasswordForm,
  passwordSave,
  getEmailPhoneForm,
  getPersonalForm,
  personalSave,
  history,
  checkUsername,
  checkPassword,
  checkEmail,
  checkPhone,
  getTerms,
  registration,
  addEmail,
  emailResendCode,
  emailActivate,
  getRemoveEmailPhoneForm,
  removeEmailPhone
};
