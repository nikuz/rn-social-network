'use strict';

import * as _ from 'underscore';

var dictionary = {
    REQUIRED: '`%s` parameter is required',
    STORAGE_ERROR: 'Storage error: `%s`',
    REQUIRED_FUNCTION: 'Function required: `%s`',
    STRING_REQUIRED: '`%s` should be a not empty string',
    NUMBER_REQUIRED: '`%s` should be a number',
    ARRAY_REQUIRED: '`%s` should be an array',
    EMAIL_REQUIRED: '`%s` should be an email string like `name@address.com`',
    URL_REQUIRED: '`%s` should be an URL string'
  },
  dictionaryActions;

const Parser = class {
  constructor(name) {
    this.name = name;
    return ((params) => this.action(params));
  }
  action(param) {
    if (_.isArray(param)) {
      var result = dictionary[this.name];
      _.each(param, function(str) {
        result = result.replace('%s', str);
      });
      return result;
    }
    return dictionary[this.name].replace('%s', param);
  }
};

if (!dictionaryActions) {
  dictionaryActions = {};
  _.each(dictionary, function(value, key) {
    dictionaryActions[key] = new Parser(key);
  });
  dictionaryActions.dictionary = dictionary;
}

export default dictionaryActions;
