'use strict';

import React, { Component } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  BackAndroid
} from 'react-native';
import * as _ from 'underscore';
import * as EventManager from '../../modules/events';
import * as InteractionManager from '../../modules/interactions';
import * as device from '../../modules/device';
import Orientation from 'react-native-orientation';
import styles from './style';

const animationDuration = 200;

class TooltipMenu extends Component {
  static propTypes = {
    afterClose: React.PropTypes.func,
    anchorEl: React.PropTypes.any,
    content: React.PropTypes.any,
    direction: React.PropTypes.string,
    marginTop: React.PropTypes.number,
    marginLeft: React.PropTypes.number,
    marginRight: React.PropTypes.number,
    close: React.PropTypes.bool
  };
  state = {
    content: null,
    shouldOpen: false,
    shouldClose: false,
    direction: 'left',
    isOpen: false,
    visible: false,
    parentWidth: 0,
    parentHeight: 0,
    parentX: 0,
    parentY: 0,
    marginTop: -5,
    marginLeft: -2,
    marginRight: -2,
    screenDimensions: device.dimensions(),
    animOpacity: new Animated.Value(0),
    animTransform: new Animated.Value(.9)
  };
  open = () => {
    var state = this.state;
    Animated.parallel([
      Animated.timing(state.animOpacity, {
        toValue: 1,
        duration: animationDuration
      }),
      Animated.timing(state.animTransform, {
        toValue: 1,
        duration: animationDuration
      })
    ]).start(() => {
      InteractionManager.clearInteractionHandle();
      this.setState({
        isOpen: true
      });
    });
  };
  close = () => {
    var state = this.state;
    Animated.parallel([
      Animated.timing(state.animOpacity, {
        toValue: 0,
        duration: animationDuration
      }),
      Animated.timing(state.animTransform, {
        toValue: .9,
        duration: animationDuration
      })
    ]).start(() => {
      InteractionManager.clearInteractionHandle();
      this.props.afterClose();
    });
  };
  closeHandler = () => {
    EventManager.trigger('tooltipMenuClose');
    return true;
  };
  orientationChangedHandler = () => {
    if (this.state.isOpen) {
      this.closeHandler();
    }
  };
  checks = () => {
    if (this.state.shouldOpen && !this.state.isOpen) {
      this.open();
    } else if (this.state.shouldClose) {
      this.close();
    }
  };
  componentWillMount() {
    var props = this.props,
      state = this.state;

    if (props.anchorEl) {
      props.anchorEl.measure((ox, oy, width, height, px, py) => {
        this.setState({
          shouldOpen: true,
          direction: props.direction || state.direction,
          content: props.content,
          anchorEl: props.anchorEl,
          parentWidth: width,
          parentHeight: height,
          parentX: px,
          parentXRight: state.screenDimensions.width - (px + width),
          parentY: py,
          marginTop: props.marginTop || state.marginTop,
          marginLeft: props.marginLeft || state.marginLeft,
          marginRight: props.marginRight || state.marginRight
        });
      });
    } else {
      this.setState({
        shouldOpen: true,
        content: props.content
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      shouldOpen: !nextProps.close,
      shouldClose: nextProps.close
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.content !== nextState.content
      || this.state.shouldOpen !== nextState.shouldOpen
      || this.state.shouldClose !== nextState.shouldClose;
  }
  componentDidUpdate() {
    this.checks();
  }
  componentDidMount() {
    this.checks();
    Orientation.addOrientationListener(this.orientationChangedHandler);
    BackAndroid.addEventListener('hardwareBackPress', this.closeHandler);
  }
  componentWillUnmount() {
    Orientation.removeOrientationListener(this.orientationChangedHandler);
    BackAndroid.removeEventListener('hardwareBackPress', this.closeHandler);
  }
  render() {
    var state = this.state,
      menuStyle = [styles.wrap],
      direction = state.direction,
      positionStyle = {
        top: state.parentY + state.marginTop,
        opacity: state.animOpacity,
        transform: [{
          scale: state.animTransform
        }]
      };

    if (direction === 'left') {
      positionStyle.left = state.parentX + state.marginLeft;
    } else {
      positionStyle.right = state.parentXRight + state.marginRight;
    }
    if (!state.anchorEl) {
      let width = state.screenDimensions.width * .8;
      width = width < 400 ? width : 400;
      menuStyle.push(styles.centering);
      _.extend(positionStyle, {
        position: 'relative',
        width: width,
        left: (state.screenDimensions.width - width) / 2,
        top: 0,
        backgroundColor: '#FFF'
      });
    }

    if (state.shouldOpen || state.shouldClose) {
      menuStyle.push(styles.visible);
    }

    return (
      <View style={menuStyle}>
        {state.anchorEl ?
          <TouchableOpacity style={[styles.touch_area, styles.touch_area_transparent]} onPress={this.closeHandler} />
          :
          <Animated.View style={[styles.touch_area, {opacity: state.animOpacity}]}>
            <TouchableOpacity style={styles.touch_area} onPress={this.closeHandler} />
          </Animated.View>
        }
        <Animated.View style={[styles.menu, positionStyle]}>
          {this.state.content}
        </Animated.View>
      </View>
    );
  }
}

export default TooltipMenu;
