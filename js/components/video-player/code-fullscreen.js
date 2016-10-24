'use strict';

import React, { Component } from 'react';
import {
  Animated,
  BackAndroid
} from 'react-native';
import * as _ from 'underscore';
import * as device from '../../modules/device';
import * as InteractionManager from '../../modules/interactions';
import * as EventManager from '../../modules/events';
import VideoPlayer from './code';
import Orientation from 'react-native-orientation';
import IdleTimerManager from 'react-native-idle-timer';
import styles from './style';

const animationDuration = 200;

class VideoPlayerFullScreen extends Component {
  static propTypes = {
    afterClose: React.PropTypes.func.isRequired,
    openWithAnimation: React.PropTypes.bool,
    files: React.PropTypes.array,
    cover: React.PropTypes.object,
    duration: React.PropTypes.number,
    title: React.PropTypes.string
  };
  state = {
    openWithAnimation: true,
    appStateName: null,
    isOpen: false,
    shouldOpen: false,
    shouldClose: false,
    files: null,
    duration: 0.0,
    cover: {},
    animOpacity: new Animated.Value(0),
    animTransform: new Animated.Value(.9)
  };
  open = () => {
    var state = this.state;
    if (state.openWithAnimation) {
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
    } else {
      state.animOpacity.setValue(1);
      state.animTransform.setValue(1);
      this.setState({
        isOpen: true
      });
    }
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
      Orientation.unlockAllOrientations();
      this.props.afterClose();
    });
  };
  closeHandler = () => {
    EventManager.trigger('videoClose');
    return true;
  };
  onControllersWillShown = () => {
    EventManager.trigger('statusBarShow');
  };
  onControllersWillHidden = () => {
    EventManager.trigger('statusBarHide');
  };
  checks = () => {
    var state = this.state;
    if (state.shouldOpen && !state.isOpen) {
      this.open();
    } else if (state.shouldClose) {
      this.close();
    }
  };
  componentWillMount() {
    var props = this.props,
      openWithAnimation = _.isUndefined(props.openWithAnimation) ? true : props.openWithAnimation;

    this.setState({
      openWithAnimation,
      shouldOpen: true,
      files: props.files || [],
      duration: props.duration,
      cover: props.cover,
      title: props.title
    });
    Orientation.lockToLandscape();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      shouldOpen: !nextProps.close,
      shouldClose: nextProps.close
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.files !== nextState.files
      || this.state.shouldOpen !== nextState.shouldOpen
      || this.state.shouldClose !== nextState.shouldClose;
  }
  componentDidUpdate() {
    this.checks();
  }
  componentDidMount() {
    this.checks();
    IdleTimerManager.setIdleTimerDisabled(true);
    BackAndroid.addEventListener('hardwareBackPress', this.closeHandler);
  }
  componentWillUnmount() {
    IdleTimerManager.setIdleTimerDisabled(false);
    BackAndroid.removeEventListener('hardwareBackPress', this.closeHandler);
  }
  render() {
    var state = this.state,
      playerStyle = [
        styles.fs_container,
        {
          opacity: state.animOpacity,
          transform: [{
            scale: state.animTransform
          }]
        }
      ],
      dimensions = device.staticDimensions();

    if (state.shouldOpen || state.shouldClose) {
      playerStyle.push(styles.fs_visible);
    }

    return (
      <Animated.View style={playerStyle}>
        {state.files ?
          <VideoPlayer
            fullScreen={true}
            onControllersWillShown={this.onControllersWillShown}
            onControllersWillHidden={this.onControllersWillHidden}
            files={state.files}
            duration={state.duration}
            cover={state.cover}
            title={state.title}
            dimensions={{
              width: dimensions.height,
              height: dimensions.width
            }}
            close={this.closeHandler}
          />
          : null
        }
      </Animated.View>
    );
  }
}

export default VideoPlayerFullScreen;
