'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  PanResponder,
  Animated,
  AppState
} from 'react-native';
import * as _ from 'underscore';
import * as config from '../../config';
import * as device from '../../modules/device';
import * as InteractionManager from '../../modules/interactions';
import * as postsHelpers from '../../modules/posts';
import * as navigatorHelpers from '../../modules/navigator';
import * as EventManager from '../../modules/events';
import Loading from '../../components/loading/code';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';

const animationDuration = 200;

class Cover extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    size: React.PropTypes.object.isRequired
  };
  render() {
    var props = this.props;
    return (
      <View style={styles.fullScreen}>
        <Image
          source={{uri: props.url}}
          style={props.size}
        />
      </View>
    );
  }
}

class Title extends Component {
  static propTypes = {
    text: React.PropTypes.string.isRequired,
    style: React.PropTypes.object,
    onPress: React.PropTypes.func.isRequired
  };
  render() {
    var props = this.props;
    return (
      <Animated.View style={[styles.title, props.style]}>
        <Text style={styles.title_text}>{props.text}</Text>
        <TouchableOpacity style={styles.title_back_button} onPress={props.onPress}>
          <Icon name="arrow-left" style={styles.title_back_button_icon} />
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

class VideoPlayer extends Component {
  static propTypes = {
    onControllersWillShown: React.PropTypes.func,
    onControllersWillHidden: React.PropTypes.func,
    close: React.PropTypes.func,
    files: React.PropTypes.array,
    title: React.PropTypes.string,
    cover: React.PropTypes.object,
    duration: React.PropTypes.number,
    fullScreen: React.PropTypes.bool
  };
  state = {
    files: [],
    currentFile: null,
    cover: null,
    title: '',
    loaded: false,
    preload: false,
    rate: 1,
    volume: 1,
    paused: false,
    muted: false,
    resizeMode: 'contain',
    duration: 0.0,
    currentTime: 0.0,
    fullScreen: false,
    controlsWidth: 0,
    containerShift: 0,
    progressMoving: false,
    qualityTooltipShowed: false,
    dimensions: {},
    ended: false,
    controllersAnimOpacity: new Animated.Value(1),
    mounted: false
  };
  clear = () => {
    clearTimeout(this.hideControllersTimer);
    clearInterval(this.frozenCheckTimer);
    this.setState({
      paused: true,
      mounted: false
    });
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
    if (!state.ended) {
      this.hideControllersHandler();
    }
  };
  frozenCheckTimer;
  lastTimeFrozenCheckedTime;
  checkIsFrozen = () => {
    var state = this.state;
    if (state.paused || state.ended || state.preload || !state.mounted) {
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

    if (!state.progressMoving && !state.controllersHidden) {
      this.progressPointMove();
    }
  };
  hideControllersTimer;
  hideControllersPreventHandler = () => {
    if (this.hideControllersTimer) {
      clearTimeout(this.hideControllersTimer);
    }
  };
  showControllers = (force) => {
    this.hideControllersPreventHandler();
    var state = this.state;
    if ((!force && !state.controllersHidden) || !state.mounted) {
      return;
    }
    this.setState({
      controllersHidden: false
    });
    this.progressPointMove();
    if (_.isFunction(this.props.onControllersWillShown)) {
      this.props.onControllersWillShown();
    }
    Animated.timing(state.controllersAnimOpacity, {
      toValue: 1,
      duration: animationDuration
    }).start(() => {
      InteractionManager.clearInteractionHandle();
    });
  };
  hideControllers = () => {
    var state = this.state;
    if (!state.mounted) {
      return;
    }
    if (_.isFunction(this.props.onControllersWillHidden)) {
      this.props.onControllersWillHidden();
    }
    Animated.timing(state.controllersAnimOpacity, {
      toValue: 0,
      duration: animationDuration
    }).start(() => {
      InteractionManager.clearInteractionHandle();
      if (!state.mounted) {
        return;
      }
      if (state.paused) {
        this.showControllers(true);
      } else {
        this.setState({
          controllersHidden: true,
          qualityTooltipShowed: false
        });
      }
    });
  };
  hideControllersHandler = () => {
    var state = this.state;
    if (state.paused) {
      return;
    }
    this.hideControllersTimer = setTimeout(this.hideControllers, 3000);
  };
  onPressCover = () => {
    var state = this.state;
    if (state.paused || state.ended || !state.mounted) {
      return;
    }
    if (state.controllersHidden) {
      this.showControllers();
      this.hideControllersHandler();
    } else {
      this.hideControllers();
    }
  };
  onPressPlay = () => {
    var paused = !this.state.paused;
    this.setState({
      paused: paused
    });
    if (paused) {
      this.hideControllersPreventHandler();
    } else {
      this.hideControllersHandler();
    }
  };
  onPressRefresh = () => {
    this.setState({
      currentTime: 0.0,
      ended: false
    });
    this.refs.player.setNativeProps({
      seek: 0.0
    });
    this.hideControllersHandler();
  };
  containerOnLayout = (e) => {
    var layout = e.nativeEvent.layout;
    this.setState({
      containerShift: layout.x - 5
    });
  };
  controlsOnLayout = (e) => {
    var layout = e.nativeEvent.layout;
    this.setState({
      controlsWidth: layout.width - 10
    });
  };
  onFullScreenHandler = () => {
    var state = this.state;
    if (!state.mounted) {
      return;
    }
    if (!state.fullScreen) {
      this.showControllers(true);
      this.setState({
        paused: true
      });
      EventManager.trigger('videoOpen', {
        files: state.files,
        duration: state.duration,
        cover: state.image
      });
    } else {
      this.close();
    }
  };
  onQualityHandler = () => {
    var toShow = !this.state.qualityTooltipShowed;
    if (toShow) {
      this.hideControllersPreventHandler();
    } else {
      this.hideControllersHandler();
    }
    this.setState({
      qualityTooltipShowed: toShow
    });
  };
  onQualityChangeHandler = (key) => {
    var state = this.state;
    if (!state.mounted) {
      return;
    }

    var newState = {
      qualityTooltipShowed: false
    };

    if (state.currentFile !== state.files[key]) {
      _.extend(newState, {
        loaded: false,
        paused: true,
        currentFile: state.files[key]
      });
      clearInterval(this.frozenCheckTimer);
    } else if (!state.ended) {
      this.hideControllersHandler();
    }
    this.setState(newState);
  };
  progressPointMove = () => {
    if (!this.refs.progressPoint) {
      return;
    }

    var lPercent = this.getCurrentTimePercentage() * 100,
      l = this.state.controlsWidth / 100 * lPercent;

    this.refs.progressPoint.setNativeProps({
      style: {
        left: l
      }
    });
  };
  progressOnChangePosition = (gestureState) => {
    var state = this.state;
    if (!state.mounted) {
      return;
    }

    var newPosition = (gestureState.moveX || gestureState.x0) - state.containerShift - 15,
      positionPercent = newPosition / (state.controlsWidth / 100),
      newTime = state.duration / 100 * positionPercent;

    this.setState({
      preload: true,
      progressMoving: false,
      currentTime: newTime,
      ended: false
    });
    this.refs.player.setNativeProps({
      seek: newTime
    });
    this.refs.progressPoint.setNativeProps({
      style: {
        width: 8,
        height: 8,
        borderRadius: 8,
        top: 11.5
      }
    });
    this.hideControllersHandler();
  };
  onSeek = () => {
    if (!this.state.mounted) {
      return;
    }
    this.setState({
      preload: false
    });
  };
  onEnd = () => {
    if (!this.state.mounted) {
      return;
    }
    this.setState({
      ended: true
    });
    this.showControllers();
    clearInterval(this.frozenCheckTimer);
  };
  onError = () => {
    if (!this.state.mounted) {
      return;
    }
    this.setState({
      error: `Can't load video file`
    });
  };
  close = () => {
    this.clear();
    this.props.close && this.props.close();
  };
  appDisabledHandler = (appState) => {
    if (appState !== 'active') {
      this.showControllers();
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
  getVideoUrl = (url) => {
    if (url.indexOf('http') !== 0) {
      url = config.API_URL + url;
    }
    return url;
  };
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loaded !== nextState.loaded
      || this.state.preload !== nextState.preload
      || this.state.loadingFrozen !== nextState.loadingFrozen
      || this.state.paused !== nextState.paused
      || this.state.currentTime !== nextState.currentTime
      || this.state.qualityTooltipShowed !== nextState.qualityTooltipShowed
      || this.state.fullScreen !== nextState.fullScreen
      || this.state.controllersHidden !== nextState.controllersHidden
      || this.state.ended !== nextState.ended;
  }
  _panResponder = null;
  componentWillMount() {
    var props = this.props,
      files = props.files || [],
      title = navigatorHelpers.titlePrepare(props.title || '', [60, 40]);

    this.setState({
      fullScreen: props.fullScreen,
      files: files,
      cover: props.cover,
      duration: props.duration,
      currentFile: files[files.length - 1],
      title: title,
      dimensions: props.dimensions || device.staticDimensions(),
      mounted: true
    });
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.hideControllersPreventHandler();
        var state = this.state,
          left = gestureState.x0 - state.containerShift;

        if (left < 15) {
          left = 15;
        } else if (left > state.controlsWidth + 10) {
          left = state.controlsWidth + 10;
        }
        this.setState({
          progressMoving: true
        });
        this.refs.progressPoint.setNativeProps({
          style: {
            left: left - 15,
            width: 15,
            height: 15,
            borderRadius: 15,
            top: 7
          }
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        var state = this.state,
          left = gestureState.moveX - state.containerShift;

        if (left > 15 && left < state.controlsWidth + 10) {
          this.refs.progressPoint.setNativeProps({
            style: {
              left: left - 15
            }
          });
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        this.progressOnChangePosition(gestureState);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        this.progressOnChangePosition(gestureState);
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });
  }
  componentDidMount() {
    if (this.state.currentFile) {
      this.frozenCheckTimer = setInterval(this.checkIsFrozen, 1000);
    }
    EventManager.on('videoClose', this.clear);
    AppState.addEventListener('change', this.appDisabledHandler);
  }
  componentWillUnmount() {
    this.clear();
    EventManager.off('videoClose', this.clear);
    AppState.removeEventListener('change', this.appDisabledHandler);
  }
  render() {
    var state = this.state,
      cover = state.cover,
      currentFile = state.currentFile,
      playerSize = {
        width: state.dimensions.width,
        height: state.dimensions.height
      },
      error = state.error;

    if (currentFile && !state.fullScreen) {
      playerSize = postsHelpers.getImageActualSize({
        width: currentFile.width,
        height: currentFile.height,
        targetWidth: state.dimensions.width - 10,
        targetHeight: state.dimensions.height
      });
    } else if (!currentFile) {
      error = 'No video file';
    }

    if (error) {
      return (
        <View style={[styles.error_container, playerSize]}>
          {cover && <Cover url={cover.url} size={playerSize} />}
          <View style={styles.error_wrap}>
            <View style={styles.icon_wrap}>
              <Icon name="exclamation-triangle" style={styles.icon} />
              <Text style={styles.error_text}>{error}</Text>
            </View>
          </View>
          <Title text={state.title} onPress={this.close} />
        </View>
      );
    } else {
      let flexCompleted = this.getCurrentTimePercentage() * 100,
        flexRemaining = (1 - this.getCurrentTimePercentage()) * 100,
        files = state.files;

      return (
        <View
          onLayout={this.containerOnLayout}
          style={[styles.container, playerSize]}
        >
          {currentFile ?
            <Video
              ref="player"
              style={styles.fullScreen}
              source={{uri: this.getVideoUrl(currentFile.url)}}
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
          {(!state.loaded || state.currentTime < 0.5 || state.ended) && cover ?
            <Cover url={cover.url} size={playerSize} />
            : null
          }
          <TouchableHighlight style={styles.fullScreen} onPress={this.onPressCover} underlayColor="transparent">
            <View />
          </TouchableHighlight>
          <View style={styles.pause_container}>
            <View style={styles.pause}>
              {state.loaded && !state.controllersHidden ?
                <Animated.View style={{opacity: state.controllersAnimOpacity}}>
                  {!state.preload && !state.loadingFrozen && !state.ended ?
                    <TouchableHighlight
                      style={styles.icon_wrap}
                      onPress={this.onPressPlay}
                      underlayColor="transparent"
                    >
                      {state.paused ?
                        <Icon name="play" style={styles.icon} />
                        :
                        <Icon name="pause" style={styles.icon} />
                      }
                    </TouchableHighlight>
                    : null
                  }
                </Animated.View>
                : null
              }
              {!state.loaded || state.preload || state.loadingFrozen ?
                <View style={styles.loader_wrap}>
                  <Loading small="large" color="#FFF" />
                </View>
                : null
              }
              {state.ended && state.loaded && !state.preload && !state.loadingFrozen ?
                <TouchableHighlight
                  style={styles.icon_wrap}
                  onPress={this.onPressRefresh}
                  underlayColor="transparent"
                >
                  <Icon name="refresh" style={styles.icon} />
                </TouchableHighlight>
                : null
              }
            </View>
          </View>
          {state.fullScreen && !state.controllersHidden ?
            <Title text={state.title} style={{opacity: state.controllersAnimOpacity}} onPress={this.close} />
            : null
          }
          <Animated.View style={[styles.controls_wrap, {opacity: state.controllersAnimOpacity}]}>
            {!state.controllersHidden ?
              <View style={styles.controls_tape}>
                <View style={styles.controls}>
                  <View style={styles.progress} onLayout={this.controlsOnLayout} {...this._panResponder.panHandlers}>
                    <View style={[styles.progressCompleted, {flex: flexCompleted}]} />
                    <View style={[styles.progressRemaining, {flex: flexRemaining}]} />
                    <View ref="progressPoint" style={styles.progressPoint} />
                  </View>
                  <View style={[styles.time, state.duration / 60 > 60 ? styles.time_long : null]}>
                    <Text style={styles.time_text}>
                      {postsHelpers.duration(state.duration - state.currentTime)}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.controls_button} onPress={this.onFullScreenHandler}>
                    {state.fullScreen ?
                      <Icon name="compress" style={styles.controls_icon} />
                      :
                      <Icon name="expand" style={styles.controls_icon} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controls_button} onPress={this.onQualityHandler}>
                    <Icon name="cog" style={styles.controls_icon} />
                  </TouchableOpacity>
                </View>
              </View>
              : null
            }
          </Animated.View>
          {state.qualityTooltipShowed ?
            <Animated.View style={[styles.quality_tooltip, {opacity: state.controllersAnimOpacity}]}>
              {_.map(files, (item, key) => {
                return (
                  <TouchableOpacity
                    key={key}
                    style={styles.qt_item}
                    onPress={this.onQualityChangeHandler.bind(null, key)}
                  >
                    {item.width === state.currentFile.width ?
                      <Icon name="check" style={styles.qt_item_icon} />
                      : null
                    }
                    <Text style={styles.qt_item_text}>{item.width || 'HLS'}</Text>
                  </TouchableOpacity>
                );
              })}
            </Animated.View>
            : null
          }
        </View>
      );
    }
  }
}

export default VideoPlayer;
