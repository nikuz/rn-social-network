'use strict';

import React, { Component } from 'react';
import {
  ScrollView,
  DeviceEventEmitter
} from 'react-native';
import * as device from '../../modules/device';

class KeyboardAwareScrollView extends Component {
  static propTypes = {
    onScroll: React.PropTypes.func,
    additionalMarginBottom: React.PropTypes.number,
    style: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.number
    ]),
    children: React.PropTypes.any,
    adjustOnAndroid: React.PropTypes.bool
  };
  state = {
    curScroll: 0,
    marginBottom: 0
  };
  keyboardWillShown = (event) => {
    var keyboardHeight = 0;

    if (device.isAndroid()) {
      if (event && event.endCoordinates.height) {
        keyboardHeight = event.endCoordinates.height;
      }
    } else {
      if (event && event.endCoordinates.screenY < event.startCoordinates.screenY) {
        keyboardHeight = event.endCoordinates.height;
      }
    }

    this.setState({
      marginBottom: keyboardHeight
    });
  };
  scrollHandler = (event) => {
    var e = event.nativeEvent;
    this.setState({
      curScroll: e.contentOffset.y
    });
    if (this.props.onScroll) {
      this.props.onScroll(event);
    }
  };
  scrollTo = (node, keepTop) => {
    var scrollView = this.refs.scroll.getScrollResponder();
    setTimeout(() => {
      node.measure((ox, oy, width, height, px, py) => {
        var deviceHeight = device.dimensions().height,
          curScroll = this.state.curScroll,
          positionTo,
          additionalSpace = 10,
          statusBarHeight = device.isIos() ? 62 : 45,
          headerHeight = 40,
          scrollBlockHeight = deviceHeight - this.state.marginBottom - statusBarHeight - headerHeight - additionalSpace,
          realPy = py - statusBarHeight - headerHeight - additionalSpace;

        if (realPy > scrollBlockHeight) {
          if (keepTop) {
            positionTo = realPy;
          } else {
            positionTo = curScroll + (realPy - scrollBlockHeight) + height + additionalSpace;
          }
        } else if (this.state.curScroll > 0 && this.state.curScroll > realPy) {
          positionTo = curScroll + realPy;
        }
        if (positionTo !== undefined) {
          scrollView.scrollTo({
            x: 0,
            y: positionTo,
            animated: true
          });
        }
      });
    }, 50);
  };
  scrollToTop = () => {
    this.refs.scroll.getScrollResponder().scrollTo({
      x: 0,
      y: 0,
      animated: true
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.marginBottom !== nextState.nextState;
  }
  _listeners;
  componentDidMount() {
    if (this.props.adjustOnAndroid && device.isAndroid()) {
      this._listeners = [
        DeviceEventEmitter.addListener('keyboardDidShow', this.keyboardWillShown),
        DeviceEventEmitter.addListener('keyboardDidHide', this.keyboardWillShown)
      ];
    } else {
      this._listeners = [
        DeviceEventEmitter.addListener('keyboardWillChangeFrame', this.keyboardWillShown)
      ];
    }
  }
  componentWillUnmount() {
    this._listeners.forEach(function(listener) {
      listener.remove();
    });
  }
  render() {
    var props = Object.assign({}, this.props),
      marginBottom = this.state.marginBottom,
      style = [{
        marginBottom: marginBottom + (props.additionalMarginBottom || 0)
      }];

    delete props.onScroll;

    if (props.style) {
      if (props.style instanceof Array) {
        style = style.concat(props.style);
      } else {
        style.push(props.style);
      }
    }
    return (
      <ScrollView
        ref="scroll"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyboardDismissMode="none"
        // keyboardShouldPersistTaps={true}
        onScroll={this.scrollHandler}
        scrollEventThrottle={1}
        {...props}
        style={style}
      >
        {props.children}
      </ScrollView>
    );
  }
}

export default KeyboardAwareScrollView;
