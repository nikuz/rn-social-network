'use strict';

import * as _ from 'underscore';
import constants from './constants';
import * as device from './device';
import * as Autolinker from 'autolinker';

// ----------------
// public methods
// ----------------

function isValid(options) {
  var opts = options || {},
    type = opts.type || 'string',
    value = opts.value || '',
    valid = true;

  switch (type) {
    case 'email':
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(value)) {
        valid = false;
      }
      break;
    case 'url': {
      let url = false;
      Autolinker.link(value, {
        replaceFn: function(autolinker, match) {
          if (!url) {
            if (value.replace(match.getAnchorText(), '').length === 0) {
              url = true;
            }
          } else {
            url = false;
          }
        }
      });
      if (value.includes(' ') || !url) {
        valid = false;
      }
      break;
    }
    case 'string':
      if (!value.length) {
        valid = false;
      }
      break;
  }

  return valid;
}

function markAsError(field) {
  field.setNativeProps({
    placeholderTextColor: '#FFF',
    style: {
      backgroundColor: '#dc8d99'
    }
  });
}

function validate(fields) {
  var errors = [];
  _.each(fields, function(item) {
    var type = item.type || 'string',
      options = {
        type: item.type,
        value: item.value
      };

    if (!isValid(options)) {
      errors.push(constants[`${type.toUpperCase()}_REQUIRED`](item.name));
      markAsError(item.field);
    }
  });
  return errors.length ? errors : true;
}

function refreshStyle(options) {
  var opts = options || {},
    placeholderColor = opts.placeholderColor || device.isAndroid() ? '#666' : '#999',
    backgroundColor = opts.backgroundColor || device.isAndroid() ? '#EEE' : '#FFF';

  opts.field.setNativeProps({
    placeholderTextColor: placeholderColor,
    style: {
      backgroundColor: backgroundColor
    }
  });
}

// ---------
// interface
// ---------

export {
  isValid,
  validate,
  refreshStyle,
  markAsError
};
