'use strict';

import React, { Component } from 'react';
import ReactAddonsUpdate from 'react-addons-update';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  RefreshControl,
  Image,
  PanResponder,
  Animated
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../../modules/ajax';
import * as postsHelpers from '../../../modules/posts';
import * as EventManager from '../../../modules/events';
import * as device from '../../../modules/device';
import * as feedsModel from '../../../models/feeds';
import * as InteractionManager from '../../../modules/interactions';
import Loading from '../../../components/loading/code';
import {Avatar} from '../../../components/pictures/code';
import Manager from '../preview-manager/code';
import {
  VideoPreview,
  PhotoPreview,
  NewsPreview,
  BookPreview,
  LinkPreview
} from '../types/code';
import {
  ButtonBlue
} from '../../../components/buttons/code';
import AudioPlayer from '../../../components/audio-player/code';
import Statistic from '../statistic/code';
import Comments from '../../feeds/comments/code';
import HTMLView from '../../../components/html-view/code';
import KeyboardAwareScrollView from '../../../components/keyboard-aware-scroll-view/code';
import styles from './style';
import pageStyles from '../../../../styles/page';

class Post extends Component {
  static propTypes = {
    main: React.PropTypes.array,
    navigator: React.PropTypes.object.isRequired,
    type: React.PropTypes.string,
    link: React.PropTypes.object,
    url: React.PropTypes.string,
    texthtml: React.PropTypes.object,
    title: React.PropTypes.string,
    album_title: React.PropTypes.string,
    user: React.PropTypes.object,
    duration: React.PropTypes.number,
    statistic: React.PropTypes.array,
    tools: React.PropTypes.array,
    parent: React.PropTypes.object,
    datetime: React.PropTypes.object,
    scrollToComments: React.PropTypes.bool,
    albumData: React.PropTypes.object,
    increaseCommentsCounter: React.PropTypes.func,
    increaseLikesCounter: React.PropTypes.func,
    updateSharingStatistic: React.PropTypes.func,
    immediatelyDataLoading: React.PropTypes.bool
  };
  state = {
    type: null,
    initialType: null,
    author: null,
    link: null,
    remoteUrl: null,
    image: null,
    title: null,
    album_title: null,
    texthtml: null,
    textExtended: null,
    duration: 0,
    pagesCounter: 0,
    statistic: null,
    tools: null,
    parent: null,
    created: null,
    refresh: false,
    error: null,
    loading: true,
    loaded: false,
    dimensions: device.staticDimensions(),
    scrollToComments: false,
    commentsRawData: [],
    commentsStatistic: 0,
    commentsForm: null,
    commentsPager: null,
    commentsRefresh: null,
    isLoadingTail: false,
    albumListData: null,
    albumListHeight: 0,
    albumListIsOpened: false,
    albumListAnimHeight: new Animated.Value(0),
    albumListTongueAnimTop: new Animated.Value(0),
    albumListAnimaDuration: 200
  };
  getImage = (options) => {
    var opts = options || {},
      ratioIndex = postsHelpers.getRatioIndex(),
      image = _.isArray(opts.image) ? opts.image : _.isObject(opts.image) && opts.image.src,
      dimensions = device.staticDimensions();

    if (opts.type === 'album') {
      image = _.isArray(opts.images) && opts.images[0] && opts.images[0].src;
      ratioIndex += 1;
    }

    if (image) {
      image = postsHelpers.getImage(image, ratioIndex);
      _.extend(image, postsHelpers.getImageActualSize({
        width: image.width,
        height: image.height,
        targetWidth: dimensions.width,
        targetHeight: dimensions.height
      }));
    }
    return image;
  };
  extractInitialState = () => {
    var props = this.props,
      text = props.texthtml && props.texthtml.text,
      state = {
        type: props.type,
        initialType: props.type,
        link: props.link,
        remoteUrl: props.url,
        title: props.title,
        album_title: props.album_title,
        author: props.user,
        image: this.getImage(props),
        duration: props.duration,
        pagesCounter: props.pages,
        statistic: props.statistic,
        tools: props.tools,
        parent: props.parent,
        created: props.datetime && props.datetime.text,
        scrollToComments: props.scrollToComments,
        albumListData: props.albumData,
        commentsStatistic: props.statistic && props.statistic[0]
      };

    if (text) {
      state.texthtml = text;
    }
    if (props.type === 'album' && device.isAndroid()) {
      _.extend(state, {
        albumListAnimHeight: new Animated.Value(1),
        albumListTongueAnimTop: new Animated.Value(1)
      });
    }
    if (_.size(state)) {
      this.setState(state);
    }
  };
  extractFinalState = (data) => {
    data = data || {};
    var curState = this.state,
      newState = {
        loaded: true,
        refresh: false,
        loading: false,
        scrollToComments: false
      },
      comments = data.comments || [];

    _.extend(newState, {
      type: data.type,
      link: data.link,
      author: data.user,
      image: this.getImage(data),
      parent: data.parent,
      duration: data.duration,
      pagesCounter: data.pagesCounter,
      statistic: data.statistic,
      tools: data.tools,
      commentsRawData: comments,
      textExtended: data.textExtended,
      texthtml: data.textExtended ? null : curState.texthtml,
      media: data.media,
      albumListData: curState.albumListData ? curState.albumListData : data.albumData,
      created: data.created,
      commentsForm: data.commentsForm,
      commentsPager: data.commentsPager,
      commentsRefresh: data.commentsRefresh,
      commentsStatistic: data.statistic && data.statistic[0]
    });

    if (!curState.initialType) {
      newState.initialType = data.type;
    }
    if (curState.scrollToComments) {
      this.scrollToComments();
    }
    this.setState(newState);
  };
  request;
  getData = () => {
    if (this.request === null) {
      return;
    }

    var props = this.props,
      url = props.link ? props.link.url : props.parent.link.url,
      requestParams = {
        url
      };

    if (props.type === 'link') {
      _.extend(requestParams, {
        url: '',
        postings: true,
        link: props.link.params.link
      });
    }

    this.request = feedsModel.getItem(requestParams, (err, response) => {
      if (!this.request) {
        return;
      }
      if (err) {
        this.setState({
          refresh: false,
          loading: false,
          error: err
        });
      } else {
        this.extractFinalState(response);
        // update navigator right button
        if (response.tools) {
          this.props.navigator._navBar.update({
            rightButton: <Manager items={response.tools} />
          });
        }
      }
    });
  };
  tryAgain = () => {
    this.setState({
      loading: true,
      error: false
    });
    this.getData();
  };
  refresh = () => {
    this.setState({
      refresh: true
    });
    this.getData();
  };
  updateAfterAuthorize = () => {
    InteractionManager.runAfterInteractions(() => {
      this.getData();
    });
  };
  getComments = () => {
    var state = this.state;
    this.request = feedsModel.getItem({
      url: state.commentsPager
    }, (err, response) => {
      if (!this.request) {
        return;
      }
      var newState = {};
      if (err) {
        newState.error = err;
      } else {
        _.extend(newState, {
          commentsRawData: state.commentsRawData.concat(response.comments),
          commentsPager: response.commentsPager
        });
      }
      this.setState(newState);
      setTimeout(() => {
        this.setState({
          isLoadingTail: false
        });
      }, 100);
    });
  };
  scrollToComments = () => {
    setTimeout(() => {
      this.refs.content.scrollTo(this.refs.commentsList, true);
    }, 50);
  };
  scrollToCommentsField = (field) => {
    this.refs.content.scrollTo(field);
  };
  videoOpen = () => {
    if (this.state.loading) {
      return;
    }
    var state = this.state,
      props = this.props;

    EventManager.trigger('videoOpen', {
      files: state.media,
      duration: props.duration,
      cover: state.image,
      title: props.title
    });
  };
  photoOpen = () => {
    if (this.state.loading) {
      return;
    }
    var state = this.state,
      props = this.props,
      media = state.media || [state.image],
      multi;

    if (media.images && media.pages) {
      media = media.images;
      multi = true;
    }

    EventManager.trigger('galleryOpen', {
      photo: media,
      cover: state.image,
      title: props.title,
      multi
    });
  };
  imageInTextOpen = (imageParams) => {
    imageParams.url = imageParams.src;
    EventManager.trigger('galleryOpen', {
      photo: [imageParams],
      cover: imageParams,
      title: this.props.title
    });
  };
  postOwnerOpenHandler = () => {
    var user = this.props.user;
    postsHelpers.openPostOwnerFromList({
      data: user
    }, this.props.navigator);
  };
  linkOpenHandler = (url, text) => {
    postsHelpers.openLinkInText(url, text, this.props.navigator);
  };
  addNewComment = () => {
    var state = this.state,
      newAmount = state.commentsStatistic.number + 1,
      commentsStatistic = ReactAddonsUpdate(state.commentsStatistic, {
        number: {
          $set: newAmount
        },
        text: {
          $set: newAmount
        }
      });

    this.setState({
      commentsStatistic
    });
    var incrementer = this.props.increaseCommentsCounter;
    if (_.isFunction(incrementer)) {
      incrementer();
    }
  };
  addNewLike = () => {
    var incrementer = this.props.increaseLikesCounter;
    if (_.isFunction(incrementer)) {
      incrementer();
    }
  };
  addNewSharing = () => {
    var incrementer = this.props.updateSharingStatistic;
    if (_.isFunction(incrementer)) {
      incrementer();
    }
  };
  scrollHandler = (e) => {
    e = e.nativeEvent;
    var state = this.state,
      scrollTarget = e.contentSize.height - e.layoutMeasurement.height - 100,
      curScroll = e.contentOffset.y;

    if (scrollTarget > 0 && curScroll > scrollTarget && state.commentsPager && !state.isLoadingTail) {
      this.setState({
        isLoadingTail: true
      });
      this.getComments();
    }
  };
  albumListOnLayout = (e) => {
    var layout = e.nativeEvent.layout,
      height = layout.height;

    if (height > 300) {
      height = 300;
    }
    this.setState({
      albumListHeight: height
    });
  };
  albumListOpen = () => {
    var state = this.state;
    Animated.parallel([
      Animated.timing(state.albumListAnimHeight, {
        toValue: state.albumListHeight,
        duration: state.albumListAnimaDuration
      }),
      Animated.timing(state.albumListTongueAnimTop, {
        toValue: state.albumListHeight,
        duration: state.albumListAnimaDuration
      })
    ]).start(() => {
      InteractionManager.clearInteractionHandle();
      if (!state.albumListIsOpened) {
        this.setState({
          albumListIsOpened: true
        });
      }
    });
  };
  albumListClose = () => {
    var state = this.state,
      targetValue = device.isAndroid() ? 1 : 0;

    Animated.parallel([
      Animated.timing(state.albumListAnimHeight, {
        toValue: targetValue,
        duration: state.albumListAnimaDuration
      }),
      Animated.timing(state.albumListTongueAnimTop, {
        toValue: targetValue,
        duration: state.albumListAnimaDuration
      })
    ]).start(() => {
      InteractionManager.clearInteractionHandle();
      this.setState({
        albumListIsOpened: false
      });
    });
  };
  albumListTongueOnPress = () => {
    var state = this.state;
    if (state.albumListIsOpened) {
      this.albumListClose();
    } else {
      this.albumListOpen();
    }
  };
  albumListOnMove = (evt, gestureState) => {
    var state = this.state,
      y = Math.round(gestureState.dy),
      heightShift;

    if (y < 0) {
      if (state.albumListIsOpened) {
        heightShift = state.albumListHeight - Math.abs(y);
      } else {
        heightShift = y;
      }
      if (heightShift < 0) {
        heightShift = 0;
      }
    } else {
      if (state.albumListIsOpened) {
        heightShift = state.albumListHeight + Math.abs(y) / 5;
      } else {
        heightShift = Math.abs(y);
      }
      if (heightShift > state.albumListHeight) {
        heightShift = state.albumListHeight + (heightShift - state.albumListHeight) / 5;
      }
    }
    if (device.isAndroid() && heightShift === 0) {
      heightShift = 1;
    }
    state.albumListAnimHeight.setValue(heightShift);
    state.albumListTongueAnimTop.setValue(heightShift);
  };
  albumListOnMoveEnd = () => {
    var state = this.state,
      heightValue = state.albumListAnimHeight._value;

    if (state.albumListIsOpened) {
      if (heightValue < state.albumListHeight && heightValue < state.albumListHeight / 100 * 80) {
        this.albumListClose();
      } else {
        this.albumListOpen();
      }
    } else {
      if (heightValue < state.albumListHeight && heightValue < state.albumListHeight / 100 * 20) {
        this.albumListClose();
      } else {
        this.albumListOpen();
      }
    }
  };
  albumListItemOnPress = (item) => {
    var state = this.state;
    this.props.navigator.replace({
      title: state.album_title || state.title,
      id: 'post_view',
      backButton: true,
      data: _.extend(item, {
        type: 'album',
        album_title: state.title,
        albumData: state.albumListData
      })
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.refresh !== nextState.refresh
      || state.loading !== nextState.loading
      || state.isLoadingTail !== nextState.isLoadingTail
      || state.commentsRawData !== nextState.commentsRawData
      || state.albumListHeight !== nextState.albumListHeight
      || state.commentsStatistic !== nextState.commentsStatistic;
  }
  _panResponder = null;
  componentWillMount() {
    var props = this.props;
    if (_.isArray(props.comments)) {
      this.extractFinalState(props);
    } else {
      this.extractInitialState();
    }
    if (props.type === 'album') {
      this._panResponder = PanResponder.create({
        onStartShouldSetResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onShouldBlockNativeResponder: (evt, gestureState) => true,
        onPanResponderMove: this.albumListOnMove,
        onPanResponderRelease: this.albumListOnMoveEnd,
        onPanResponderTerminate: this.albumListOnMoveEnd
      });
    }
  }
  componentDidMount() {
    EventManager.on('accountAuthorized', this.updateAfterAuthorize);
    EventManager.on('accountUnauthorized', this.updateAfterAuthorize);
    InteractionManager.runAfterInteractions(() => {
      this.getData();
    });
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
    EventManager.off('accountAuthorized', this.updateAfterAuthorize);
    EventManager.off('accountUnauthorized', this.updateAfterAuthorize);
  }
  renderDescription = () => {
    var state = this.state,
      description = null,
      text = state.texthtml && state.texthtml.text;

    if (text) {
      description = (
        <View style={styles.description}>
          <HTMLView
            value={text}
            onLinkPress={this.linkOpenHandler}
          />
        </View>
      );
    }

    return description;
  };
  render() {
    var state = this.state,
      author = state.author,
      preview,
      text,
      textExtended,
      refreshControl,
      title,
      likesInfo,
      sharingInfo;

    refreshControl = (
      <RefreshControl
        refreshing={this.state.refresh}
        onRefresh={this.refresh}
      />
    );

    switch (state.type) {
      case 'video':
        preview = (
          <VideoPreview
            duration={state.duration}
            image={state.image}
            onPress={this.videoOpen}
            loading={state.loading}
            error={state.error}
          />
        );
        break;
      case 'photo':
        preview = (
          <PhotoPreview
            image={state.image}
            onPress={this.photoOpen}
            loading={state.loading}
            error={state.error}
          />
        );
        break;
      case 'text':
        text = this.renderDescription();
        if (state.image) {
          preview = (
            <BookPreview
              pagesCounter={state.pagesCounter}
              image={state.image}
              compact={state.compact}
              loading={state.loading}
              error={state.error}
              onPress={this.photoOpen}
            />
          );
        }
        break;
      case 'article':
      case 'posting':
        text = this.renderDescription();
        if (state.image) {
          preview = (
            <NewsPreview
              image={state.image}
              compact={state.compact}
              loading={state.loading}
              error={state.error}
              onPress={this.photoOpen}
            />
          );
        }
        if (state.type === 'posting') {
          title = (
            <TouchableOpacity style={styles.title} onPress={this.postOpenHandler}>
              <Text style={styles.title_text}>{state.parent && state.parent.title}</Text>
            </TouchableOpacity>
          );
        }
        break;
      case 'album':
        if (state.image) {
          preview = (
            <PhotoPreview
              image={state.image}
              onPress={this.photoOpen}
              loading={state.loading}
              error={state.error}
            />
          );
        }
        break;
      case 'audio':
        preview = (
          <AudioPlayer
            duration={state.duration}
            title={state.title}
            file={state.media}
            loading={state.loading}
            error={state.error}
          />
        );
        break;
      case 'link':
        preview = (
          <LinkPreview
            image={state.image}
            compact={state.compact}
            url={state.remoteUrl}
            loading={state.loading}
            error={state.error}
            onPress={this.linkOpenHandler.bind(null, state.remoteUrl)}
          />
        );
        break;
    }

    if (state.textExtended) {
      textExtended = (
        <View style={styles.description}>
          <HTMLView
            value={state.textExtended}
            onImagePress={this.imageInTextOpen}
            onLinkPress={this.linkOpenHandler}
          />
        </View>
      );
    }

    if (state.statistic && state.tools) {
      likesInfo = _.extend(state.statistic[1], {
        alreadyLiked: !state.tools[1].link
      });
      sharingInfo = {
        url: state.tools[0].link && state.tools[0].link.url,
        title: state.tools[0].text,
        alreadyShared: !state.tools[0].link
      };
    }

    return (
      <View style={styles.wrap}>
        {state.initialType === 'album' && state.albumListData ?
          <Animated.View
            ref="album_list"
            style={[styles.album_list, {height: state.albumListAnimHeight}]}
          >
            <View
              style={state.albumListHeight ? {height: state.albumListHeight} : null}
              onLayout={this.albumListOnLayout}
            >
              <ScrollView>
                {_.map(state.albumListData.items, (item, key) => {
                  var image, imageSize,
                    itemStyle = [
                      styles.album_list_item
                    ];

                  if (state.link.url.indexOf('/album') === 0) {
                    if (key === 0) {
                      itemStyle.push(styles.album_list_item_current);
                    }
                  } else {
                     if (item.link === state.link) {
                      itemStyle.push(styles.album_list_item_current);
                    }
                  }
                  if (item.image && _.isArray(item.image.src)) {
                    image = postsHelpers.getImage(item.image.src, 1);
                    imageSize = postsHelpers.getImageActualSize({
                      width: image.width,
                      height: image.height,
                      targetWidth: 100,
                      targetHeight: 100 / (image.width / image.height)
                    });
                    image = (
                      <Image
                        source={{uri: image.url}}
                        style={{
                          width: imageSize.width,
                          height: imageSize.height
                        }}
                      />
                    );
                  }
                  return (
                    <TouchableHighlight
                      key={key}
                      underlayColor="#666"
                      style={itemStyle}
                      onPress={this.albumListItemOnPress.bind(this, item)}
                    >
                      <View style={styles.album_list_item_cont}>
                        {image}
                        <View style={[styles.album_list_item_text_wrap, {height: (imageSize && imageSize.height) || 48}]}>
                          <View style={styles.album_list_item_text_cont}>
                            <Text style={styles.album_list_item_text}>{item.title}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableHighlight>
                  );
                })}
              </ScrollView>
            </View>
          </Animated.View>
          : null
        }
        <KeyboardAwareScrollView
          ref="content"
          style={styles.content}
          refreshControl={refreshControl}
          onScroll={this.scrollHandler}
          scrollEventThrottle={1}
        >
          <TouchableOpacity style={styles.author_wrap} onPress={this.postOwnerOpenHandler}>
            <Avatar src={author.image.src} />
            <View style={styles.author_cont}>
              <Text style={styles.author_name}>{author.text}</Text>
              <Text style={styles.posted_time}>{state.created}</Text>
            </View>
          </TouchableOpacity>
          <View>
            {title}
            {preview}
            {text}
            {textExtended}
          </View>
          {state.statistic ?
            <Statistic
              comments={state.commentsStatistic}
              like={likesInfo}
              sharing={sharingInfo}
              views={state.statistic[2]}
              data={{
                url: state.link && state.link.url,
                type: state.type,
                id: state.link && state.link.params[state.initialType],
                title: state.title,
                text: state.texthtml || state.textExtended
              }}
              addNewLike={this.addNewLike}
              addNewSharing={this.addNewSharing}
            />
            : null
          }
          {state.loading ? <Loading size="large" /> : null}
          {state.error ?
            <View style={pageStyles.error_wrap}>
              <View style={pageStyles.error_cont}>
                <Text style={pageStyles.error_text}>{state.error}</Text>
                <ButtonBlue
                  text="Try again"
                  onPress={this.tryAgain}
                />
              </View>
            </View>
            : null
          }
          {!state.loading && !state.error ?
            <View ref="commentsList">
              <Comments
                data={{
                  type: state.type,
                  id: state.link && state.link.params[state.initialType],
                  form: state.commentsForm,
                  refresh: state.commentsRefresh
                }}
                comments={state.commentsRawData}
                isLoadingTail={state.isLoadingTail}
                navigator={this.props.navigator}
                scrollToCommentsField={this.scrollToCommentsField}
                addNewCommentCallback={this.addNewComment}
              />
            </View>
            : null
          }
        </KeyboardAwareScrollView>
        {state.initialType === 'album' && state.albumListData ?
          <Animated.View
            ref="tongue"
            style={[styles.album_list_tongue_wrap, {top: state.albumListTongueAnimTop}]}
          >
            <View {...this._panResponder.panHandlers}>
              <TouchableHighlight
                onPress={this.albumListTongueOnPress}
                underlayColor="#666"
                style={styles.album_list_tongue}
              >
                <View style={styles.album_list_tongue_cont}>
                  <View style={styles.album_list_tongue_line_sm} />
                  <View style={styles.album_list_tongue_line} />
                </View>
              </TouchableHighlight>
            </View>
          </Animated.View>
          : null
        }
        <View style={[pageStyles.shadow_line, styles.shadow_line]} />
      </View>
    );
  }
}

export default Post;
