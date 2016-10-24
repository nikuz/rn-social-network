'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import * as postsHelpers from '../../modules/posts';
import Loading from '../loading/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';

class Avatar extends Component {
  static propTypes = {
    src: React.PropTypes.array,
    size: React.PropTypes.string
  };
  state = {
    loaded: false
  };
  onLoadEndHandler = () => {
    this.setState({
      loaded: true
    });
  };
  render() {
    var props = this.props,
      src = props.src,
      avatarImage,
      size = props.size,
      ratioIndex = postsHelpers.getRatioIndex(),
      imageStyle = [styles.avatar],
      iconWrapStyle = [styles.avatar_blank_wrap],
      iconStyle = [styles.avatar_blank];
    
    if (src) {
      avatarImage = postsHelpers.getImage(src, ratioIndex);
    }

    if (size === 'small') {
      imageStyle.push(styles.avatar_small);
      iconWrapStyle.push(styles.avatar_blank_wrap_small);
      iconStyle.push(styles.avatar_blank_small);
    } else if (size === 'large') {
      imageStyle.push(styles.avatar_large);
      iconWrapStyle.push(styles.avatar_blank_wrap_large);
      iconStyle.push(styles.avatar_blank_large);
    }

    return (
      <View>
        {!this.state.loaded ?
          <View style={iconWrapStyle}>
            <Icon name="user" style={iconStyle} />
          </View>
          : null
        }
        {avatarImage ?
          <Image
            source={{uri: avatarImage.url}}
            style={imageStyle}
            onLoadEnd={this.onLoadEndHandler}
          />
          :
          <View style={imageStyle} />
        }
      </View>
    );
  }
}

class Picture extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    actualWidth: React.PropTypes.number,
    actualHeight: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    onLoadEnd: React.PropTypes.func
  };
  state = {
    loaded: false
  };
  onLoadEndHandler = () => {
    this.setState({
      loaded: true
    });
    this.props.onLoadEnd && this.props.onLoadEnd();
  };
  render() {
    var props = this.props,
      sizeStyle = {
        width: props.actualWidth || props.width,
        height: props.actualHeight || props.height
      };

    return (
      <View>
        {!this.state.loaded ?
          <View style={[styles.image_loader_wrap, sizeStyle]}>
            <Loading style={styles.image_loader} color="#DDD" />
          </View>
          : null
        }
        <Image
          source={{uri: props.url}}
          style={sizeStyle}
          onLoadEnd={this.onLoadEndHandler}
        />
      </View>
    );
  }
}

export {
  Avatar,
  Picture
};
