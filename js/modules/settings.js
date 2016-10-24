'use strict';

import * as _ from 'underscore';
import constants from './constants';
import * as storage from './storage';

const settingsName = 'settings';

const initialSettings = {
  language: null,
  feeds: {
    id: '',
    value: 'Summary'
  }
};

function clone() {
  return JSON.parse(JSON.stringify(initialSettings)); // full clone
}

(async function() {
  var settingsData = await storage.get(settingsName);
  if (settingsData && !_.isEqual(_.keys(settingsData), _.keys(initialSettings))) {
    storage.remove(settingsName);
  }
})();

// ----------------
// public methods
// ----------------

async function get(field) {
  field = _.isString(field) ? field : null;
  var settings = await storage.get(settingsName);
  if (!settings) {
    settings = clone();
  }
  if (field) {
    settings = settings[field];
  }
  return settings;
}

async function set(field, data) {
  data = _.isObject(data) ? data : (_.isObject(field) ? field : null);
  field = _.isString(field) ? field : null;
  if (!data) {
    return new Error(constants.REQUIRED('data'));
  }
  if (field) {
    let settings = await get();
    _.each(settings, function(item, key) {
      if (key === field) {
        settings[key] = data;
      }
    });
    return await storage.set(settingsName, settings);
  } else {
    return await storage.set(settingsName, data);
  }
}

// ---------
// interface
// ---------

export {
  get,
  set
};
