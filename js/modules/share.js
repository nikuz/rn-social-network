'use strict';

import {
  Platform,
  ActionSheetIOS
} from 'react-native';
import * as config from '../config';
import AndroidShareComponent from 'react-native-share';

function Share(options, callback) {
  var opts = options || {},
    cb = callback || function() {},
    url = opts.url;

  if (url.indexOf('http') !== 0) {
    url = config.API_URL + url;
  }

  if (Platform.OS === 'ios') {
    ActionSheetIOS.showShareActionSheetWithOptions({
      url: url,
      message: opts.message + '\n\n' + url,
      subject: opts.subject
    }, (err) => {
      cb(err);
    }, (success) => {
      cb(null, success);
    });
  } else {
    AndroidShareComponent.open({
      share_URL: url,
      share_text: opts.message + '\n\n' + url,
      title: opts.subject
    }, cb);
  }
}

export default Share;
