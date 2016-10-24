'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  BackAndroid
} from 'react-native';
import * as _ from 'underscore';
import * as device from '../../modules/device';
import * as InteractionManager from '../../modules/interactions';
import * as postsHelpers from '../../modules/posts';
import * as EventManager from '../../modules/events';
import Loading from '../../components/loading/code';
import Orientation from 'react-native-orientation';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';

const animationDuration = 200;

class Picture extends Component {
  static propTypes = {
    url: React.PropTypes.string,
    onLoadEnd: React.PropTypes.func,
    width: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    height: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    cover: React.PropTypes.object,
    onZoomed: React.PropTypes.func.isRequired,
    onMoveContainer: React.PropTypes.func.isRequired,
    onMoveContainerStop: React.PropTypes.func.isRequired,
    containerWidth: React.PropTypes.number,
    visible: React.PropTypes.bool
  };
  state = {
    loaded: false,
    error: false,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    coverWidth: 0,
    coverHeight: 0,
    animScale: new Animated.Value(1),
    animWidth: new Animated.Value(0),
    animHeight: new Animated.Value(0),
    animTop: new Animated.Value(0),
    animLeft: new Animated.Value(0),
    maxZoom: 2,
    zoomed: false
  };
  onLoadHandler = () => {
    this.setState({
      loaded: true
    });
    this.props.onLoadEnd && this.props.onLoadEnd();
  };
  onErrorHandler = () => {
    this.setState({
      error: true
    });
  };
  getPosition = (size) => {
    var dimensions = device.dimensions();
    return {
      top: (dimensions.height - size.height) / 2,
      left: (dimensions.width - size.width) / 2
    };
  };
  updatePosition = () => {
    var state = this.state,
      props = this.props,
      dimensions = device.dimensions(),
      size = postsHelpers.getImageActualSize({
        width: props.width,
        height: props.height,
        targetWidth: dimensions.width,
        targetHeight: dimensions.height
      }),
      coverSize,
      position = this.getPosition({
        width: size.width,
        height: size.height
      });

    if (props.cover) {
      coverSize = postsHelpers.getImageActualSize({
        width: props.cover.width,
        height: props.cover.height,
        targetWidth: dimensions.width,
        targetHeight: dimensions.height
      });
    }

    state.animTop.setValue(position.top);
    state.animLeft.setValue(position.left);
    state.animWidth.setValue(size.width);
    state.animHeight.setValue(size.height);

    this.setState({
      top: position.top,
      left: position.left,
      width: size.width,
      height: size.height,
      coverWidth: coverSize.width,
      coverHeight: coverSize.height,
      zoomed: false
    });
  };
  getCenteringShifts = (position, size) => {
    var left = position.left,
      top = position.top,
      dimensions = device.dimensions();

    if (size.width <= dimensions.width) {
      left = (dimensions.width - size.width) / 2;
    } else {
      if (left > 0) {
        left = 0;
      } else if (left < -(size.width - dimensions.width)) {
        left = -(size.width - dimensions.width);
      }
    }
    if (size.height <= dimensions.height) {
      top = (dimensions.height - size.height) / 2;
    } else {
      if (top > 0) {
        top = 0;
      } else if (top < -(size.height - dimensions.height)) {
        top = -(size.height - dimensions.height);
      }
    }
    return {
      top,
      left
    };
  };
  getZoomRate = (size) => {
    var state = this.state,
      zoomRate;

    if (state.width > state.height) {
      zoomRate = size.width / state.width;
    } else {
      zoomRate = size.height / state.height;
    }
    return zoomRate;
  };
  moveImage = (position) => {
    var state = this.state,
      top = state.top + (position.curTop - position.startTop),
      left = state.left + (position.curLeft - position.startLeft);

    state.animTop.setValue(top);
    state.animLeft.setValue(left);
  };
  moveImageStop = (position) => {
    if (!position.curTop && !position.curLeft) {
      return;
    }

    var state = this.state,
      top = state.animTop._value,
      left = state.animLeft._value,
      finalShifts = this.getCenteringShifts({
        top,
        left
      }, {
        width: state.width,
        height: state.height
      });

    Animated.parallel([
      Animated.timing(state.animTop, {
        toValue: finalShifts.top,
        duration: animationDuration
      }),
      Animated.timing(state.animLeft, {
        toValue: finalShifts.left,
        duration: animationDuration
      })
    ]).start(() => {
      InteractionManager.clearInteractionHandle();
    });

    this.setState({
      top: finalShifts.top,
      left: finalShifts.left
    });
  };
  zoomImage = (gestureState) => {
    var state = this.state,
      props = this.props,
      dimensions = device.dimensions(),
      finalShifts = {
        shiftTop: null,
        shiftLeft: null
      },
      newImageSize,
      zoomRate;

    if (!state.zoomed) {
      newImageSize = postsHelpers.getImageActualSize({
        width: props.width,
        height: props.height,
        targetWidth: dimensions.width * state.maxZoom,
        targetHeight: dimensions.height * state.maxZoom
      });
      zoomRate = this.getZoomRate(newImageSize);
      let tapY = gestureState.y0,
        tapX = gestureState.x0,
        isTapedOnImage = state.top <= tapY
          && state.top + state.height >= tapY
          && state.left <= tapX
          && state.left + state.width >= tapX,
        shiftTop = state.top - (newImageSize.height - state.height) / 2,
        shiftLeft = state.left - (newImageSize.width - state.width) / 2,
        pointOnImage, newPointOnImage;

      if (isTapedOnImage) {
        pointOnImage = {
          top: tapY - state.top,
          left: tapX - state.left
        };
        newPointOnImage = {
          top: newImageSize.height / 100 * (pointOnImage.top / (state.height / 100)),
          left: newImageSize.width / 100 * (pointOnImage.left / (state.width / 100))
        };
        shiftTop = state.top - (newPointOnImage.top - pointOnImage.top);
        shiftLeft = state.left - (newPointOnImage.left - pointOnImage.left);
        let leftCompensationPercent = Math.abs(50 - pointOnImage.left / (state.width / 100)),
          topCompensationPercent = Math.abs(50 - pointOnImage.top / (state.height / 100)),
          leftCompensationPixels = (newImageSize.width - state.width) / 100 * leftCompensationPercent,
          topCompensationPixels = (newImageSize.height - state.height) / 100 * topCompensationPercent;

        if (pointOnImage.top < state.height / 2) {
          finalShifts.shiftTop = state.top + topCompensationPixels;
        } else {
          finalShifts.shiftTop = state.top - topCompensationPixels;
        }
        if (pointOnImage.left < state.width / 2) {
          finalShifts.shiftLeft = state.left + leftCompensationPixels;
        } else {
          finalShifts.shiftLeft = state.left - leftCompensationPixels;
        }

        if (newImageSize.width <= dimensions.width) {
          finalShifts.shiftLeft = state.left;
        } else {
          let halfOfScale = (newImageSize.width - state.width) / 2;
          if (finalShifts.shiftLeft - halfOfScale > 0) {
            finalShifts.shiftLeft -= finalShifts.shiftLeft - halfOfScale;
          } else if (finalShifts.shiftLeft - halfOfScale < -(newImageSize.width - dimensions.width)) {
            finalShifts.shiftLeft += Math.abs(finalShifts.shiftLeft - halfOfScale) - (newImageSize.width - dimensions.width);
          }
        }
        if (newImageSize.height <= dimensions.height) {
          finalShifts.shiftTop = state.top;
        } else {
          let halfOfScale = (newImageSize.height - state.height) / 2;
          if (finalShifts.shiftTop - halfOfScale > 0) {
            finalShifts.shiftTop -= finalShifts.shiftTop - halfOfScale;
          } else if (finalShifts.shiftTop - halfOfScale < -(newImageSize.height - dimensions.height)) {
            finalShifts.shiftTop += Math.abs(finalShifts.shiftTop - halfOfScale) - (newImageSize.height - dimensions.height);
          }
        }

        _.extend(
          finalShifts,
          this.getCenteringShifts({
            top: shiftTop,
            left: shiftLeft
          }, {
            width: newImageSize.width,
            height: newImageSize.height
          })
        );
      } else {
        _.extend(finalShifts, {
          top: shiftTop,
          left: shiftLeft
        });
      }
    } else {
      newImageSize = postsHelpers.getImageActualSize({
        width: props.width,
        height: props.height,
        targetWidth: dimensions.width,
        targetHeight: dimensions.height
      });
      zoomRate = this.getZoomRate(newImageSize);
      _.extend(
        finalShifts,
        this.getPosition({
          width: newImageSize.width,
          height: newImageSize.height
        })
      );
      finalShifts.shiftLeft = finalShifts.left - (state.width - newImageSize.width) / 2;
      finalShifts.shiftTop = finalShifts.top - (state.height - newImageSize.height) / 2;
    }

    var animations = [
      Animated.timing(state.animScale, {
        toValue: zoomRate,
        duration: animationDuration
      })
    ];
    if (finalShifts.shiftTop !== null) {
      animations.push(
        Animated.timing(state.animTop, {
          toValue: finalShifts.shiftTop,
          duration: animationDuration
        }),
        Animated.timing(state.animLeft, {
          toValue: finalShifts.shiftLeft,
          duration: animationDuration
        })
      );
    }
    Animated.parallel(animations).start(() => {
      state.animWidth.setValue(newImageSize.width);
      state.animHeight.setValue(newImageSize.height);
      state.animTop.setValue(finalShifts.top);
      state.animLeft.setValue(finalShifts.left);
      state.animScale.setValue(1);
      InteractionManager.clearInteractionHandle();
    });

    this.setState({
      zoomed: !state.zoomed,
      top: finalShifts.top,
      left: finalShifts.left,
      width: newImageSize.width,
      height: newImageSize.height
    });
  };
  zoomImageByPinch = (position) => {
    var state = this.state,
      props = this.props,
      dimensions = device.dimensions(),
      initial = position.initial,
      previous = position.previous,
      previousSegmentLength = Math.sqrt(
        Math.pow(previous.left1 - previous.left2, 2) + Math.pow(previous.top1 - previous.top2, 2)
      ),
      segmentLength = Math.sqrt(
        Math.pow(position.left1 - position.left2, 2) + Math.pow(position.top1 - position.top2, 2)
      ),
      zoomValue = Math.abs(segmentLength - previousSegmentLength) / 100,
      scaleValue,
      originalImageSize = postsHelpers.getImageActualSize({
        width: props.width,
        height: props.height,
        targetWidth: dimensions.width,
        targetHeight: dimensions.height
      }),
      zoomedImageSize = postsHelpers.getImageActualSize({
        width: props.width,
        height: props.height,
        targetWidth: dimensions.width * state.maxZoom,
        targetHeight: dimensions.height * state.maxZoom
      });

    if (segmentLength > previousSegmentLength) {
      scaleValue = state.animScale._value + zoomValue;
      if (state.width * scaleValue > zoomedImageSize.width || state.height * scaleValue > zoomedImageSize.height) {
        scaleValue = state.animScale._value;
      }
    } else {
      scaleValue = state.animScale._value - zoomValue;
      if (state.width * scaleValue < originalImageSize.width || state.height * scaleValue < originalImageSize.height) {
        scaleValue = state.animScale._value;
      }
    }

    state.animScale.setValue(scaleValue);
  };
  zoomImageByPinchStop = () => {
    var state = this.state,
      props = this.props,
      dimensions = device.dimensions(),
      zoom = state.animScale._value,
      originalImageSize = postsHelpers.getImageActualSize({
        width: props.width,
        height: props.height,
        targetWidth: dimensions.width,
        targetHeight: dimensions.height
      }),
      zoomedImageSize = postsHelpers.getImageActualSize({
        width: props.width,
        height: props.height,
        targetWidth: dimensions.width * state.maxZoom,
        targetHeight: dimensions.height * state.maxZoom
      }),
      currentImageSize = postsHelpers.getImageActualSize({
        width: props.width,
        height: props.height,
        targetWidth: state.width * zoom,
        targetHeight: state.height * zoom
      }),
      newImageSize = currentImageSize,
      zoomed,
      position;

    if (Math.abs(zoomedImageSize.width - currentImageSize.width) < zoomedImageSize.width / 100 * 10) {
      newImageSize = zoomedImageSize;
    } else if (Math.abs(originalImageSize.width - currentImageSize.width) < originalImageSize.width / 100 * 10) {
      newImageSize = originalImageSize;
    }
    zoomed = newImageSize.width > originalImageSize.width;
    position = this.getPosition(newImageSize);

    state.animTop.setValue(position.top);
    state.animLeft.setValue(position.left);
    state.animWidth.setValue(newImageSize.width);
    state.animHeight.setValue(newImageSize.height);
    state.animScale.setValue(1);

    this.setState({
      zoomed: zoomed,
      top: position.top,
      left: position.left,
      width: newImageSize.width,
      height: newImageSize.height
    });
    this.props.onZoomed(zoomed);
    InteractionManager.clearInteractionHandle();
  };
  _panResponder = null;
  componentWillMount() {
    this.updatePosition();

    var tap, pinchTap, pinchTapPrev, moved;
    function checkMoves(top, left) {
      return (top && Math.abs(top - tap.y0) > 10) || (left && Math.abs(left - tap.x0) > 10);
    }
    var responderRelease = (gestureState) => {
      moved = false;
      if (pinchTap) {
        pinchTap = null;
        this.zoomImageByPinchStop();
      } else if (tap) {
        var top = gestureState.moveY,
          left = gestureState.moveX;

        if (checkMoves(top, left)) {
          let position = {
            startTop: gestureState.y0,
            startLeft: gestureState.x0,
            curTop: gestureState.moveY || gestureState.y0,
            curLeft: gestureState.moveX || gestureState.x0
          };
          if (this.state.zoomed) {
            this.moveImageStop(position);
          } else {
            this.props.onMoveContainerStop(position);
          }
        }
      }
    };
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        var newTap = _.extend(_.clone(gestureState), {
          time: Date.now()
        });
        if (tap) {
          let top = gestureState.y0,
            left = gestureState.x0;

          // double tap
          if ((Date.now() - tap.time) / 1000 < 0.5 && !checkMoves(top, left)) {
            this.zoomImage(gestureState);
            tap = null;
            this.props.onZoomed(this.state.zoomed);
          } else {
            tap = newTap;
          }
        } else {
          tap = newTap;
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!tap) return;

        if (gestureState.numberActiveTouches === 1) {
          let top = gestureState.moveY,
            left = gestureState.moveX;

          if (checkMoves(top, left)) {
            let position = {
              startTop: gestureState.y0,
              startLeft: gestureState.x0,
              curTop: top,
              curLeft: left,
              moveTop: gestureState.dy,
              moveLeft: gestureState.dx
            };
            moved = true;
            if (this.state.zoomed) {
              this.moveImage(position);
            } else {
              this.props.onMoveContainer(position);
            }
          }
        } else if (gestureState.numberActiveTouches === 2 && !moved) {
          let touches = evt.nativeEvent.touches;
          if (!pinchTap) {
            pinchTap = {
              top1: touches[0].pageY,
              left1: touches[0].pageX,
              top2: touches[1].pageY,
              left2: touches[1].pageX
            };
            pinchTapPrev = pinchTap;
          }
          this.zoomImageByPinch({
            top1: touches[0].pageY,
            left1: touches[0].pageX,
            top2: touches[1].pageY,
            left2: touches[1].pageX,
            initial: pinchTap,
            previous: _.clone(pinchTapPrev)
          });
          pinchTapPrev = {
            top1: touches[0].pageY,
            left1: touches[0].pageX,
            top2: touches[1].pageY,
            left2: touches[1].pageX
          };
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        responderRelease(gestureState);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        responderRelease(gestureState);
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });
  }
  componentWillReceiveProps(nextProps) {
    var props = this.props;
    if (nextProps.containerWidth !== props.containerWidth) {
      this.updatePosition();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state,
      props = this.props;

    return state.loaded !== nextState.loaded
      || state.error !== nextState.error
      || props.visible !== nextProps.visible
      || props.containerWidth !== nextProps.containerWidth;
  }
  render() {
    var props = this.props,
      state = this.state,
      wrapSize = {
        width: props.containerWidth,
        height: props.containerHeight
      };

    if (!props.visible) {
      return <View style={[styles.picture_wrap, wrapSize]} />;
    } else {
      return (
        <View style={[styles.picture_wrap, wrapSize]}>
          {!state.loaded ?
            <View style={styles.picture_container}>
              <View style={styles.picture_container_inner}>
                {props.cover ?
                  <Image
                    source={{uri: props.cover.url}}
                    style={{
                    width: state.coverWidth,
                    height: state.coverHeight
                  }}
                  />
                  : null
                }
              </View>
              <View style={styles.picture_content}>
                <View style={styles.picture_content_inner}>
                  {state.error ?
                    <View style={styles.picture_error}>
                      <Icon name="exclamation-triangle" style={styles.icon}/>
                      <Text style={styles.error_text}>Image load error occurred</Text>
                    </View>
                    : null
                  }
                  {!state.error && props.url ?
                    <View style={styles.picture_loading}>
                      <Loading size="large" color="#FFF" />
                    </View>
                    : null
                  }
                </View>
              </View>
            </View>
            : null
          }
          <Animated.Image
            source={{uri: props.url}}
            style={{
              transform: [{
                scale: state.animScale
              }],
              top: state.animTop,
              left: state.animLeft,
              width: state.animWidth,
              height: state.animHeight
            }}
            onLoad={this.onLoadHandler}
            onError={this.onErrorHandler}
            renderToHardwareTextureAndroid={true}
            shouldRasterizeIOS={true}
          />
          <View style={[styles.pan, wrapSize]} {...this._panResponder.panHandlers} />
        </View>
      );
    }
  }
}

class Title extends Component {
  static propTypes = {
    text: React.PropTypes.string.isRequired,
    style: React.PropTypes.object.isRequired,
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

class PhotoGallery extends Component {
  static propTypes = {
    afterClose: React.PropTypes.func.isRequired,
    multi: React.PropTypes.bool,
    photo: React.PropTypes.array,
    cover: React.PropTypes.object,
    openWithAnimation: React.PropTypes.bool,
    title: React.PropTypes.string,
    close: React.PropTypes.bool
  };
  state = {
    openWithAnimation: true,
    appStateName: null,
    isOpen: false,
    shouldOpen: false,
    shouldClose: false,
    photos: null,
    curPhotoIndex: 0,
    cover: null,
    containerWidth: 0,
    containerHeight: 0,
    animOpacity: new Animated.Value(0),
    animTransform: new Animated.Value(.9),
    batchAnimLeft: new Animated.Value(0),
    batchAnimTop: new Animated.Value(0),
    controllersHidden: false,
    controllersAnimOpacity: new Animated.Value(1),
    verticalShiftEdge: 0,
    horizontalShiftEdge: 0,
    zoomed: false
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
        this.setState({
          isOpen: true
        });
        InteractionManager.clearInteractionHandle();
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
      this.props.afterClose();
    });
  };
  closeHandler = () => {
    EventManager.trigger('galleryClose');
    return true;
  };
  onControllersShow = () => {
    this.setState({
      controllersHidden: false
    });
    Animated.timing(this.state.controllersAnimOpacity, {
      toValue: 1,
      duration: animationDuration
    }).start();
    EventManager.trigger('statusBarShow');
  };
  onControllersHide = () => {
    Animated.timing(this.state.controllersAnimOpacity, {
      toValue: 0,
      duration: animationDuration
    }).start(() => {
      this.setState({
        controllersHidden: true
      });
    });
    EventManager.trigger('statusBarHide');
  };
  onZoomed = (toHide) => {
    var state = this.state;
    InteractionManager.runAfterInteractions(() => {
      if (state.controllersHidden && !toHide) {
        this.onControllersShow();
      } else if (!state.controllersHidden && toHide) {
        this.onControllersHide();
      }
    });
  };
  moveDirection = null;
  onMoveContainer = (position) => {
    var state = this.state,
      top = position.curTop - position.startTop,
      left = -(state.curPhotoIndex * state.containerWidth) + (position.curLeft - position.startLeft),
      opacity = (100 - Math.abs(position.curTop - position.startTop) / (state.verticalShiftEdge / 100) / 1.5) / 100;

    if (opacity < 0.2) {
      opacity = 0.2;
    }

    if (!this.moveDirection) {
      if (Math.abs(position.moveTop) > Math.abs(position.moveLeft)) {
        this.moveDirection = 'top';
      } else {
        this.moveDirection = 'left';
      }
    }

    if (this.moveDirection === 'top') {
      state.batchAnimTop.setValue(top);
      state.animOpacity.setValue(opacity);
    } else {
      state.batchAnimLeft.setValue(left);
    }
  };
  onMoveContainerStop = (position) => {
    var state = this.state,
      props = this.props;

    this.moveDirection = null;

    if (Math.abs(position.startTop - position.curTop) > state.verticalShiftEdge) {
      this.closeHandler();
    } else {
      let leftAnimationTarget = -(state.containerWidth * state.curPhotoIndex),
        shift = position.startLeft - position.curLeft,
        photoIndex = null;

      if (Math.abs(shift) > state.horizontalShiftEdge && props.multi) {
        if (shift > 0 && state.curPhotoIndex < state.photos.length - 1) {
          photoIndex = state.curPhotoIndex + 1;
        } else if (shift < 0 && state.curPhotoIndex !== 0) {
          photoIndex = state.curPhotoIndex - 1;
        }
        if (photoIndex !== null) {
          leftAnimationTarget = -(state.containerWidth * photoIndex);
        }
      }
      Animated.parallel([
        Animated.timing(state.batchAnimTop, {
          toValue: 0,
          duration: animationDuration
        }),
        Animated.timing(state.batchAnimLeft, {
          toValue: leftAnimationTarget,
          duration: animationDuration
        }),
        Animated.timing(state.animOpacity, {
          toValue: 1,
          duration: animationDuration
        })
      ]).start(() => {
        if (photoIndex !== null) {
          this.setState({
            curPhotoIndex: photoIndex
          });
        }
      });
    }
  };
  orientationChangedHandler = (orientation) => {
    var state = this.state;
    if (!state.photos.length || orientation.includes('UPSIDEDOWN')) {
      return;
    }

    var dimensions = device.dimensions(),
      batchLeftPosition = -(dimensions.width * state.curPhotoIndex);

    state.batchAnimLeft.setValue(batchLeftPosition);

    this.setState({
      containerWidth: dimensions.width,
      containerHeight: dimensions.height,
      verticalShiftEdge: dimensions.height / 100 * 30, // 30% of screen height,
      horizontalShiftEdge: dimensions.width / 100 * 30 // 30% of screen width
    });
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
      dimensions = device.dimensions(),
      ratioIndex = postsHelpers.getRatioIndex(),
      photos = props.multi ? props.photo : [postsHelpers.getImage(props.photo, ratioIndex + 1)],
      cover = props.cover,
      openWithAnimation = _.isUndefined(props.openWithAnimation) ? true : props.openWithAnimation;

    this.setState({
      openWithAnimation,
      shouldOpen: true,
      photos,
      cover,
      title: props.title,
      containerWidth: dimensions.width,
      containerHeight: dimensions.height,
      verticalShiftEdge: dimensions.height / 100 * 30, // 30% of screen height,
      horizontalShiftEdge: dimensions.width / 100 * 30 // 30% of screen width,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      shouldOpen: !nextProps.close,
      shouldClose: nextProps.close
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.photos !== nextState.photos
      || state.shouldOpen !== nextState.shouldOpen
      || state.shouldClose !== nextState.shouldClose
      || state.containerWidth !== nextState.containerWidth
      || state.curPhotoIndex !== nextState.curPhotoIndex
      || state.controllersHidden !== nextState.controllersHidden;
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
      photos = state.photos,
      galleryStyle = [
        styles.container,
        {
          opacity: state.animOpacity,
          transform: [{
            scale: state.animTransform
          }]
        }
      ],
      batchStyle = [
        styles.batchTape,
        {
          width: state.containerWidth * photos.length,
          top: state.batchAnimTop,
          left: state.batchAnimLeft
        }
      ],
      title = state.title || '',
      maxTitleLength = device.isTablet() ? 60 : 40,
      error;

    if (!photos.length) {
      error = 'No picture';
    }

    if (device.orientation() === 'portrait') {
      maxTitleLength = device.isTablet() ? 40 : 20;
    }
    if (title.length > maxTitleLength) {
      title = title.substring(0, maxTitleLength) + '...';
    }

    if (state.shouldOpen || state.shouldClose) {
      galleryStyle.push(styles.visible);
    }

    return (
      <Animated.View style={galleryStyle} renderToHardwareTextureAndroid={true} shouldRasterizeIOS={true}>
        <Animated.View style={batchStyle}>
          {_.map(photos, (photo, key) => {
            return (
              <Picture
                key={key}
                {...photo}
                cover={state.cover}
                visible={state.curPhotoIndex >= key - 1 && state.curPhotoIndex <= key + 1}
                containerWidth={state.containerWidth}
                containerHeight={state.containerHeight}
                onZoomed={this.onZoomed}
                onMoveContainer={this.onMoveContainer}
                onMoveContainerStop={this.onMoveContainerStop}
              />
            );
          })}
        </Animated.View>
        {error ?
          <View style={styles.error_container}>
            <View style={styles.error_content}>
              <Icon name="exclamation-triangle" style={styles.icon} />
              <Text style={styles.error_text}>{error}</Text>
            </View>
          </View>
          : null
        }
        {!state.controllersHidden ?
          <Title
            text={title}
            style={{opacity: state.controllersAnimOpacity}}
            onPress={this.closeHandler}
          />
          : null
        }
      </Animated.View>
    );
  }
}

export default PhotoGallery;
