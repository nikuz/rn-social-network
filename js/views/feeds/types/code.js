'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import * as postsHelpers from '../../../modules/posts';
import {Picture} from '../../../components/pictures/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from '../../../components/loading/code';
import styles from './style';

class VideoPreview extends Component {
  state = {
    loaded: false
  };
  onLoadEndHandler = () => {
    this.setState({
      loaded: true
    });
  };
  render() {
    var state = this.state,
      props = this.props,
      image = props.image,
      sizeStyle = {
        width: image.actualWidth || image.width,
        height: image.actualHeight || image.height
      },
      onPress = !props.loading && !props.error ? props.onPress : null;

    return (
      <View style={styles.image_preview_container}>
        <Picture
          url={image.url}
          actualWidth={image.actualWidth}
          actualHeight={image.actualHeight}
          width={image.width}
          height={image.height}
          onLoadEnd={this.onLoadEndHandler}
        />
        {state.loaded ?
          <TouchableOpacity style={[styles.video_icon_wrap, sizeStyle]} onPress={onPress}>
            {props.loading ?
              <View style={styles.video_icon_cont}>
                <Loading color="#FFF" size="large" />
              </View>
              : null
            }
            {!props.loading && !props.error ?
              <View style={styles.video_icon_cont}>
                <View style={[styles.video_icon_bg, props.compact ? styles.video_icon_bg_sm : null]}>
                  <Icon
                    name="play"
                    style={[styles.video_icon, props.compact ? styles.video_icon_sm : null]}
                  />
                </View>
              </View>
              : null
            }
            {!props.loading && !props.error ?
              <Text style={[styles.video_duration, props.compact ? styles.video_duration_sm : null]}>
                {postsHelpers.duration(props.duration)}
              </Text>
              : null
            }
          </TouchableOpacity>
          : null
        }
      </View>
    );
  }
}

class AudioPreview extends Component {
  state = {
    loaded: false
  };
  onLoadEndHandler = () => {
    this.setState({
      loaded: true
    });
  };
  render() {
    var state = this.state,
      props = this.props,
      image = props.image,
      sizeStyle = {
        width: image.actualWidth || image.width,
        height: image.actualHeight || image.height
      },
      onPress = !props.loading && !props.error ? props.onPress : null;

    return (
      <View style={styles.image_preview_container}>
        <Picture
          url={image.url}
          actualWidth={image.actualWidth}
          actualHeight={image.actualHeight}
          width={image.width}
          height={image.height}
          onLoadEnd={this.onLoadEndHandler}
        />
        {state.loaded ?
          <TouchableOpacity style={[styles.image_touch_area, sizeStyle]} onPress={onPress}>
            {props.loading ?
              <View style={styles.video_icon_cont}>
                <Loading color="#FFF" size="large" />
              </View>
              : null
            }
            {!props.loading && !props.error ?
              <View style={styles.video_icon_cont}>
                <View style={[styles.video_icon_bg, props.compact ? styles.video_icon_bg_sm : null]}>
                  <Icon
                    name="headphones"
                    style={[styles.video_icon, props.compact ? styles.video_icon_sm : null]}
                  />
                </View>
              </View>
              : null
            }
            {!props.loading && !props.error ?
              <Text style={[styles.video_duration, props.compact ? styles.video_duration_sm : null]}>
                {postsHelpers.duration(props.duration)}
              </Text>
              : null
            }
          </TouchableOpacity>
          : null
        }
      </View>
    );
  }
}

class PhotoPreview extends Component {
  render() {
    var props = this.props,
      image = props.image,
      sizeStyle = {
        width: image.actualWidth || image.width,
        height: image.actualHeight || image.height
      },
      onPress = !props.loading && !props.error ? props.onPress : null;

    return (
      <View style={styles.image_preview_container}>
        <Picture
          url={image.url}
          actualWidth={image.actualWidth}
          actualHeight={image.actualHeight}
          width={image.width}
          height={image.height}
        />
        <TouchableOpacity style={[styles.image_touch_area, sizeStyle]} onPress={onPress}>
          {props.loading ?
            <View style={styles.video_icon_cont}>
              <Loading color="#FFF" size="large" />
            </View>
            : null
          }
        </TouchableOpacity>
      </View>
    );
  }
}

class PhotoAlbumPreview extends Component {
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
      image = props.image,
      sizeStyle = {
        width: image.actualWidth || image.width,
        height: image.actualHeight || image.height
      },
      onPress = !props.loading && !props.error ? props.onPress : null;

    return (
      <View style={styles.image_preview_container}>
        <Picture
          url={image.url}
          actualWidth={image.actualWidth}
          actualHeight={image.actualHeight}
          width={image.width}
          height={image.height}
          onLoadEnd={this.onLoadEndHandler}
        />
        {this.state.loaded ?
          <TouchableOpacity style={[styles.image_touch_area, sizeStyle]} onPress={onPress}>
            {props.loading ?
              <View style={styles.video_icon_cont}>
                <Loading color="#FFF" size="large" />
              </View>
              : null
            }
            {!props.loading && !props.error ?
              <View style={styles.album_counter_wrap}>
                <Text style={styles.album_counter}>{props.itemsCounter}</Text>
              </View>
              : null
            }
          </TouchableOpacity>
          : null
        }
      </View>
    );
  }
}

class NewsPreview extends Component {
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
      image = props.image,
      sizeStyle = {
        width: image.actualWidth || image.width,
        height: image.actualHeight || image.height
      },
      onPress = !props.loading && !props.error ? props.onPress : null;

    return (
      <View style={styles.image_preview_container}>
        <Picture
          url={image.url}
          actualWidth={image.actualWidth}
          actualHeight={image.actualHeight}
          width={image.width}
          height={image.height}
          onLoadEnd={this.onLoadEndHandler}
        />
        {this.state.loaded ?
          <TouchableOpacity style={[styles.image_touch_area, sizeStyle]} onPress={onPress}>
            {props.loading ?
              <View style={styles.video_icon_cont}>
                <Loading color="#FFF" size="large" />
              </View>
              :
              null
            }
            {!props.loading && !props.error ?
              <View style={styles.icon_wrap}>
                <Icon name="newspaper-o" style={styles.icon} />
              </View>
              : null
            }
          </TouchableOpacity>
          : null
        }
      </View>
    );
  }
}

class BookPreview extends Component {
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
      image = props.image,
      sizeStyle = {
        width: image.actualWidth || image.width,
        height: image.actualHeight || image.height
      },
      onPress = !props.loading && !props.error ? props.onPress : null;

    return (
      <View style={styles.image_preview_container}>
        <Picture
          url={image.url}
          actualWidth={image.actualWidth}
          actualHeight={image.actualHeight}
          width={image.width}
          height={image.height}
          onLoadEnd={this.onLoadEndHandler}
        />
        {this.state.loaded ?
          <TouchableOpacity style={[styles.image_touch_area, sizeStyle]} onPress={onPress}>
            {props.loading ?
              <View style={styles.video_icon_cont}>
                <Loading color="#FFF" size="large" />
              </View>
              :
              null
            }
            {!props.loading && !props.error ?
              <View style={styles.news_pager_wrap}>
                <Icon name="file-text" style={styles.news_pager_icon} />
                <Text style={styles.news_pager}>{props.pagesCounter} page(s)</Text>
              </View>
              : null
            }
            {!props.loading && !props.error ?
              <View style={styles.icon_wrap}>
                <Icon name="book" style={styles.icon} />
              </View>
              : null
            }
          </TouchableOpacity>
          : null
        }
      </View>
    );
  }
}

class LinkPreview extends Component {
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
      image = props.image,
      sizeStyle = {
        width: image.actualWidth || image.width,
        height: image.actualHeight || image.height
      },
      onPress = !props.loading && !props.error ? props.onPress : null;

    return (
      <View style={styles.image_preview_container}>
        <Picture
          url={image.url}
          actualWidth={image.actualWidth}
          actualHeight={image.actualHeight}
          width={image.width}
          height={image.height}
          onLoadEnd={this.onLoadEndHandler}
        />
        {this.state.loaded ?
          <TouchableOpacity style={[styles.image_touch_area, sizeStyle]} onPress={onPress}>
            {props.loading ?
              <View style={styles.video_icon_cont}>
                <Loading color="#FFF" size="large" />
              </View>
              : null
            }
            {!props.loading && !props.error ?
              <View style={styles.icon_wrap}>
                <Icon name="external-link" style={styles.icon} />
              </View>
              : null
            }
          </TouchableOpacity>
          : null
        }
      </View>
    );
  }
}

export {
  VideoPreview,
  AudioPreview,
  PhotoPreview,
  PhotoAlbumPreview,
  NewsPreview,
  BookPreview,
  LinkPreview
};
