'use strict';

import {StyleSheet} from 'react-native';
import * as _ from 'underscore';
import * as device from '../js/modules/device';

var adjustableProperties = [
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'paddingTop',
  'paddingBottom',
  'paddingRight',
  'paddingLeft',
  'top',
  'bottom',
  'left',
  'right',
  'width',
  'height',
  'borderRadius',
  'shadowRadius',
  'elevation'
];

function generate(styles) {
  if (device.isTablet()) {
    _.each(styles, function(selector) {
      _.each(selector, function(value, key) {
        if (_.contains(adjustableProperties, key)) {
          selector[key] = value * 1.1;
        } else if (key === 'fontSize') {
          selector[key] = value * 1.15;
        }
      });
    });
  }
  return StyleSheet.create(styles);
}

export default generate;
