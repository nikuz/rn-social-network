'use strict';

import * as _ from 'underscore';
import * as config from '../config';
import {
  AsyncStorage
} from 'react-native';
import constants from './constants';

const storagePrefix = config.STORAGE_PREFIX;

// ----------------
// public methods
// ----------------

async function get(name) {
  if (!name) {
    return new Error(constants.REQUIRED('name'));
  }

  var result = {};
  if (_.isArray(name)) {
    _.each(name, function(item, key) {
      name[key] = `${storagePrefix}:${item}`;
    });
    let data = await AsyncStorage.multiGet(name);
    _.each(data, function(item) {
      var name = item[0].replace(`${storagePrefix}:`, '');
      result[name] = item[1];
      try {
        result[name] = JSON.parse(item[1]);
      } catch (err) {}
    });
  } else {
    result = await AsyncStorage.getItem(`${storagePrefix}:${name}`);
    try {
      result = JSON.parse(result);
    } catch (err) {}
  }
  return result;
}

async function set(name, data) {
  var errors = [];
  if (!name) {
    errors.push(constants.REQUIRED(name));
  }
  if (!_.isObject(name) && !data) {
    errors.push(constants.REQUIRED(data));
  }
  if (errors.length) {
    return new Error(errors);
  }

  var prepareData = function(item) {
    if (_.isDate(item)) {
      item = item.toString();
    } else if (_.isObject(item)) {
      item = JSON.stringify(item);
    } else {
      item = String(item);
    }
    return item;
  };
  if (_.isObject(name)) {
    var storeData = [];
    _.each(name, function(data, key) {
      storeData.push([
        `${storagePrefix}:${key}`,
        prepareData(data)
      ]);
    });
    return await AsyncStorage.multiSet(storeData);
  } else {
    return await AsyncStorage.setItem(`${storagePrefix}:${name}`, prepareData(data));
  }
}

async function check(name) {
  if (!name) {
    return new Error(constants.REQUIRED(name));
  }
  return await AsyncStorage.getItem(`${storagePrefix}:${name}`);
}

async function remove(name) {
  if (!name) {
    return new Error(constants.REQUIRED(name));
  }

  if (_.isArray(name)) {
    _.each(name, function(item, key) {
      name[key] = `${storagePrefix}:${item}`;
    });
    return await AsyncStorage.multiRemove(name);
  } else {
    return await AsyncStorage.removeItem(`${storagePrefix}:${name}`);
  }
}

// ---------
// interface
// ---------

export {
  get,
  set,
  check,
  remove
};

