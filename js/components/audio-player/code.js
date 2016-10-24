'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  PanResponder,
  AppState
} from 'react-native';
import * as postsHelpers from '../../modules/posts';
import * as navigatorHelpers from '../../modules/navigator';
import * as device from '../../modules/device';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from '../loading/code';
import Player from 'react-native-video';
import styles from './style';

class AudioPlayer extends Component {
  static propTypes = {
    title: React.PropTypes.string,
    duration: React.PropTypes.number.isRequired,
    dimensions: React.PropTypes.object,
    file: React.PropTypes.array
  };
  state = {
    mounted: true,
    initiated: false,
    loaded: false,
    preload: false,
    loadingFrozen: false,
    ended: false,
    rate: 1,
    volume: 1,
    paused: true,
    muted: false,
    resizeMode: 'contain',
    duration: 0.0,
    currentTime: 0.0,
    file: null,
    controlsWidth: 0,
    containerShift: 0
  };
  clear = () => {
    clearInterval(this.frozenCheckTimer);
    this.setState({
      paused: true,
      mounted: false
    });
  };
  onPressPlay = () => {
    var newState = {
      paused: !this.state.paused
    };
    if (!this.state.initiated) {
      newState.initiated = true;
    }
    this.setState(newState);
  };
  getCurrentTimePercentage = () => {
    if (this.state.currentTime > 0) {
      return this.state.currentTime / this.state.duration;
    } else {
      return 0;
    }
  };
  onLoad = (data) => {
    var state = this.state;
    if (!state.mounted) {
      return;
    }
    this.setState({
      loaded: true,
      paused: false,
      duration: data.duration
    });
    if (state.currentTime) {
      this.refs.player.setNativeProps({
        seek: state.currentTime
      });
    }
  };
  onSeek = () => {
    if (!this.state.mounted) {
      return;
    }
    this.setState({
      preload: false
    });
  };
  frozenCheckTimer;
  lastTimeFrozenCheckedTime;
  checkIsFrozen = () => {
    var state = this.state;
    if (!state.initiated || state.paused || state.ended || state.preload || !state.mounted) {
      return;
    }
    if (this.lastTimeFrozenCheckedTime === state.currentTime) {
      this.setState({
        loadingFrozen: true,
        paused: true
      });
      setImmediate(() => {
        this.setState({
          loadingFrozen: true,
          paused: false
        });
      });
    } else {
      this.lastTimeFrozenCheckedTime = state.currentTime;
    }
  };
  onProgress = (data) => {
    var state = this.state;
    if (!state.loaded || state.paused || state.preload || !state.mounted) {
      return;
    }
    var newState = {
      currentTime: data.currentTime
    };
    if (state.loadingFrozen && this.lastTimeFrozenCheckedTime !== data.currentTime) {
      newState.loadingFrozen = false;
    }
    this.setState(newState);
  };
  onError = () => {
    if (!this.state.mounted) {
      return;
    }
    this.setState({
      error: `Can't load audio file`
    });
  };
  onEnd = () => {
    if (!this.state.mounted) {
      return;
    }
    this.setState({
      ended: true,
      paused: true
    });
    clearInterval(this.frozenCheckTimer);
  };
  onPressRefresh = () => {
    this.refs.player.setNativeProps({
      seek: 0.0
    });
    setTimeout(() => {
      this.setState({
        currentTime: 0.0,
        ended: false,
        paused: false
      });
    }, 100);
  };
  containerOnLayout = (e) => {
    var layout = e.nativeEvent.layout;
    this.setState({
      controlsWidth: layout.width - 64,
      containerShift: layout.x
    });
  };
  appDisabledHandler = (appState) => {
    if (appState !== 'active') {
      this.setState({
        paused: true,
        mounted: false
      });
    } else {
      this.setState({
        mounted: true
      });
    }
  };
  _panResponder = null;
  componentWillMount() {
    var props = this.props,
      title = navigatorHelpers.titlePrepare(props.title || '');

    this.setState({
      duration: props.duration,
      title: title,
      dimensions: props.dimensions || device.staticDimensions(),
      mounted: true
    });
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        var state = this.state;
        if (!state.initiated) {
          return;
        }
        var newPosition = gestureState.x0 - state.containerShift - 64,
          positionPercent = newPosition / (state.controlsWidth / 100),
          newTime = state.duration / 100 * positionPercent;

        this.setState({
          preload: true,
          currentTime: newTime,
          ended: false
        });
        this.refs.player.setNativeProps({
          seek: newTime
        });
      }
    });
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      file: newProps.file
    });
  }
  componentDidMount() {
    this.frozenCheckTimer = setInterval(this.checkIsFrozen, 1000);
    AppState.addEventListener('change', this.appDisabledHandler);
  }
  componentWillUnmount() {
    this.clear();
    AppState.removeEventListener('change', this.appDisabledHandler);
  }
  render() {
    var state = this.state,
      flexCompleted = this.getCurrentTimePercentage() * 100,
      flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

    return (
      <View style={styles.container} onLayout={this.containerOnLayout}>
        {state.file && state.initiated ?
          <Player
            ref="player"
            style={styles.player}
            source={{uri: state.file[0].url}}
            rate={state.rate}
            paused={state.paused}
            volume={state.volume}
            muted={state.muted}
            resizeMode={state.resizeMode}
            onLoad={this.onLoad}
            onSeek={this.onSeek}
            onProgress={this.onProgress}
            onError={this.onError}
            onEnd={this.onEnd}
            repeat={false}
          />
          : null
        }
        <View style={styles.progress}>
          <View style={[styles.progressCompleted, {flex: flexCompleted}]} />
          <View style={[styles.progressRemaining, {flex: flexRemaining}]} />
        </View>
        <View style={styles.buttons}>
          {state.file && !state.error && (!state.initiated || (state.initiated && state.loaded && !state.preload && !state.loadingFrozen && !state.ended)) ?
            <TouchableHighlight
              style={styles.button}
              underlayColor="#00aef6"
              onPress={this.onPressPlay}
            >
              <View style={styles.button_cont}>
                {state.paused ?
                  <Icon name="play" style={styles.icon} />
                  :
                  <Icon name="pause" style={styles.icon} />
                }
              </View>
            </TouchableHighlight>
            : null
          }
          {!state.file || !state.error && (state.initiated && (!state.loaded || state.preload || state.loadingFrozen)) ?
            <View style={styles.loading_wrap}>
              <View style={styles.loading_cont}>
                <Loading color="#FFF" size="large" />
              </View>
            </View>
            : null
          }
          {state.error?
            <View style={styles.loading_wrap}>
              <View style={styles.loading_cont}>
                <Icon name="exclamation-triangle" style={[styles.icon, styles.icon_error]} />
              </View>
            </View>
            : null
          }
          {!state.error && state.ended && state.loaded && !state.preload && !state.loadingFrozen ?
            <TouchableHighlight
              style={styles.button}
              onPress={this.onPressRefresh}
              underlayColor="#00aef6"
            >
              <View style={styles.button_cont}>
                <Icon name="refresh" style={styles.icon} />
              </View>
            </TouchableHighlight>
            : null
          }
        </View>
        <View style={styles.controllers} {...this._panResponder.panHandlers}>
          <View style={styles.name}>
            <Text style={styles.text}>
              {!state.error ? state.title : state.error}
            </Text>
          </View>
          {!state.error ?
            <View style={styles.duration}>
              <Text style={styles.text}>
                -{postsHelpers.duration(state.duration - state.currentTime)}
              </Text>
            </View>
            : null
          }
        </View>
      </View>
    );
  }
}

export default AudioPlayer;
