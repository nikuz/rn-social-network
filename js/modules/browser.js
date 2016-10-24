'use strict';

import {
  Linking
} from 'react-native';
import * as config from '../config';

// ----------------
// public methods
// ----------------

function openURL(url) {
  if (url.includes('@')) {
    return console.log(url);
  }
  if (url.indexOf('http') !== 0) {
    url = config.API_URL + url;
  }
  Linking.openURL(url);
}

// ---------
// interface
// ---------

export {
  openURL
};
