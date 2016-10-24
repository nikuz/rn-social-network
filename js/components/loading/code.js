'use strict';

import React, { Component } from 'react';
import {
  View,
  ProgressBarAndroid,
  ActivityIndicator
} from 'react-native';
import * as device from '../../modules/device';

class Loading extends Component {
  static propTypes = {
    size: React.PropTypes.string,
    color: React.PropTypes.string,
    style: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.number
    ])
  };
  render() {
    var props = this.props,
      size = props.size || 'normal',
      androidSize = size === 'large' ? 'normal' : size,
      iosSize = size === 'normal' ? 'small' : size,
      color = props.color,
      style = props.style;

    androidSize = androidSize.charAt(0).toUpperCase() + androidSize.slice(1);

    return (
      device.isAndroid() ?
        <ProgressBarAndroid styleAttr={androidSize} color={color} style={style} />
        :
        <ActivityIndicator animating={true} size={iosSize} color={color} style={style} />
    );
  }
}

export default Loading;
