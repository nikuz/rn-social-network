'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated
} from 'react-native';
import * as _ from 'underscore';
import * as InteractionManager from '../../../modules/interactions';
import * as postsHelpers from '../../../modules/posts';
import * as navigatorHelpers from '../../../modules/navigator';
import * as EventManager from '../../../modules/events';
import * as feedsModel from '../../../models/feeds';
import {ButtonBlue} from '../../../components/buttons/code';
import Loading from '../../../components/loading/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';

const animationDuration = 200;

class PostOverlay extends Component {
  static propTypes = {
    title: React.PropTypes.string,
    data: React.PropTypes.object,
    afterClose: React.PropTypes.func.isRequired
  };
  state = {
    loading: true,
    error: false,
    title: null,
    data: null,
    media: null,
    isOpen: false,
    shouldOpen: false,
    shouldClose: false,
    animOpacity: new Animated.Value(0),
    animTransform: new Animated.Value(.9)
  };
  dataRequest;
  getData = () => {
    if (this.dataRequest === null) {
      return;
    }
    var curState = this.state;
    this.dataRequest = feedsModel.getItem({
      url: curState.data.link.url
    }, (err, response) => {
      if (!this.dataRequest) {
        return;
      }
      var newState = {
        error: false,
        refresh: false,
        loading: false
      };
      if (err) {
        newState.error = 'Data load error occurred';
      } else {
        _.extend(newState, {
          media: response.media
        });
      }
      this.setState(newState);
    });
  };
  update = () => {
    this.setState({
      loading: true,
      error: false
    });
    this.getData();
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
    this.setState({
      shouldOpen: false,
      shouldClose: true
    });
  };
  openMedia = () => {
    var state = this.state,
      image = state.data.image,
      ratioIndex = postsHelpers.getRatioIndex();

    image = image && image.src;
    if (image) {
      image = postsHelpers.getImage(image, ratioIndex);
    }

    switch (state.data.type) {
      case 'video':
        EventManager.trigger('videoOpen', {
          openWithAnimation: false,
          files: state.media,
          duration: state.data.duration,
          cover: image,
          title: state.data.title
        });
        break;
      case 'photo':
        EventManager.trigger('galleryOpen', {
          openWithAnimation: false,
          photo: state.media,
          cover: image,
          title: state.data.title
        });
        break;
    }
    setTimeout(() => {
      this.props.afterClose();
    }, 300);
  };
  checks = () => {
    var state = this.state;
    if (state.shouldOpen && !state.isOpen) {
      this.open();
    } else if (state.shouldClose) {
      this.close();
    }
    if (state.media) {
      this.openMedia();
    }
  };
  componentWillMount() {
    var props = this.props,
      title = navigatorHelpers.titlePrepare(props.title || '');

    this.setState({
      shouldOpen: true,
      data: props.data,
      title
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      shouldOpen: !nextProps.close,
      shouldClose: nextProps.close
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.shouldOpen !== nextState.shouldOpen
      || this.state.shouldClose !== nextState.shouldClose
      || this.state.loading !== nextState.loading
      || this.state.media !== nextState.media;
  }
  componentDidUpdate() {
    this.checks();
  }
  componentDidMount() {
    this.checks();
    this.getData();
  }
  componentWillUnmount() {
    this.dataRequest = null;
  }
  render() {
    var state = this.state,
      overlayStyle = [
        styles.container,
        {
          opacity: state.animOpacity,
          transform: [{
            scale: state.animTransform
          }]
        }
      ];

    if (state.shouldOpen || state.shouldClose) {
      overlayStyle.push(styles.visible);
    }

    return (
      <Animated.View style={overlayStyle}>
        <View style={styles.content}>
          {state.loading ?
            <Loading size="large" color="#FFF" />
            : null
          }
          {state.error ?
            <View style={styles.error_content}>
              <Icon name="exclamation-triangle" style={styles.icon} />
              <Text style={styles.error_text}>{state.error}</Text>
              <ButtonBlue
                text="Try again"
                onPress={this.update}
              />
            </View>
            : null
          }
        </View>
        <View style={styles.title}>
          <Text style={styles.title_text}>{state.title}</Text>
          <TouchableOpacity style={styles.title_back_button} onPress={this.closeHandler}>
            <Icon name="arrow-left" style={styles.title_back_button_icon} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
}

export default PostOverlay;
