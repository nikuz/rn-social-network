'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import * as _ from 'underscore';
import * as config from '../../../config';
import * as postsHelpers from '../../../modules/posts';
import * as device from '../../../modules/device';
import * as browser from '../../../modules/browser';
import {Avatar} from '../../../components/pictures/code';
import {
  VideoPreview,
  PhotoPreview,
  AudioPreview,
  PhotoAlbumPreview,
  NewsPreview,
  BookPreview,
  LinkPreview
} from '../types/code';
import Statistic from '../statistic/code';
import HTMLView from '../../../components/html-view/code';
import styles from './style';

class Item extends Component {
  static propTypes = {
    openOwner: React.PropTypes.func.isRequired,
    parent: React.PropTypes.object,
    openItem: React.PropTypes.func.isRequired,
    openLink: React.PropTypes.func.isRequired,
    statistic: React.PropTypes.array,
    tools: React.PropTypes.array,
    user: React.PropTypes.object,
    type: React.PropTypes.string.isRequired,
    link: React.PropTypes.object,
    location: React.PropTypes.object,
    texthtml: React.PropTypes.object,
    language: React.PropTypes.object,
    title: React.PropTypes.string
  };
  state = {
    compact: false,
    image: null,
    commentsCounter: 0,
    likesCounter: 0,
    alreadyLiked: false,
    likesUpdated: false,
    alreadyShared: false,
    sharingUpdated: false
  };
  postOwnerOpenHandler = () => {
    this.props.openOwner({
      data: this.props.user
    });
  };
  postParentOwnerOpenHandler = () => {
    this.props.openOwner({
      data: this.props.parent.user
    });
  };
  increaseCommentsCounter = () => {
    this.setState({
      commentsCounter: this.state.commentsCounter + 1
    });
  };
  increaseLikesCounter = () => {
    this.setState({
      likesCounter: this.state.likesCounter + 1,
      likesUpdated: true,
      alreadyLiked: true
    });
  };
  updateSharingStatistic = () => {
    this.setState({
      alreadyShared: true,
      sharingUpdated: true
    });
  };
  postOpenHandler = (inOverlay, scrollToComments) => {
    var state = this.state,
      props = this.props.parent ? this.props.parent : this.props,
      data = _.extend({
        increaseCommentsCounter: this.increaseCommentsCounter,
        increaseLikesCounter: this.increaseLikesCounter,
        updateSharingStatistic: this.updateSharingStatistic
      }, props);

    if (data.statistic) {
      _.extend(data.statistic[0], {
        number: state.commentsCounter,
        text: state.commentsCounter
      });
      _.extend(data.statistic[1], {
        number: state.likesCounter,
        text: state.likesCounter
      });
    }
    if (state.alreadyLiked && data.tools) {
      delete data.tools[1].link;
    }
    if (state.alreadyShared && data.tools) {
      delete data.tools[0].link;
    }

    this.props.openItem({
      overlay: inOverlay === true,
      title: props.title,
      data,
      scrollToComments
    });
  };
  postOpenByCommentsHandler = () => {
    this.postOpenHandler(null, true);
  };
  linkOpenHandler = (url, rawText) => {
    this.props.openLink(url, rawText);
  };
  remoteLinkOpenHandler = (link) => {
    browser.openURL(config.API_URL + link.url);
  };
  getImageParams = (options) => {
    var ratioIndex = postsHelpers.getRatioIndex(),
      image = options.image && options.image.src,
      dimensions = device.staticDimensions();

    if (options.type === 'album') {
      image = _.isArray(options.images) && options.images[0] && options.images[0].src;
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
    return {
      image,
      compact: image && image.width < dimensions.width / 2
    };
  };
  componentWillMount() {
    var props = this.props,
      statistic = props.statistic,
      tools = props.tools,
      newState = {
        commentsCounter: statistic && statistic[0] && statistic[0].number,
        likesCounter: statistic && statistic[1] && statistic[1].number,
        alreadyLiked: tools && tools[1] && !tools[1].link,
        alreadyShared: tools && tools[0] && !tools[0].link
      };

    this.setState(newState);
  }
  renderPreview = (props) => {
    var imageParams = this.getImageParams(props),
      preview = null;

    switch (props.type) {
      case 'video':
        preview = (
          <VideoPreview
            {...props}
            image={imageParams.image}
            compact={imageParams.compact}
            onPress={this.postOpenHandler.bind(null, true)}
          />
        );
        break;
      case 'photo':
        preview = (
          <PhotoPreview
            {...props}
            image={imageParams.image}
            compact={imageParams.compact}
            onPress={this.postOpenHandler.bind(null, true)}
          />
        );
        break;
      case 'audio':
        preview = (
          <AudioPreview
            {...props}
            image={imageParams.image}
            compact={imageParams.compact}
            onPress={this.postOpenHandler}
          />
        );
        break;
      case 'text':
        if (imageParams.image) {
          preview = (
            <BookPreview
              pagesCounter={props.pages}
              image={imageParams.image}
              compact={imageParams.compact}
              onPress={this.postOpenHandler}
            />
          );
        }
        break;
      case 'article':
      case 'posting':
        if (imageParams.image) {
          preview = (
            <NewsPreview
              image={imageParams.image}
              compact={imageParams.compact}
              onPress={this.postOpenHandler}
            />
          );
        }
        break;
      case 'album':
        if (imageParams.image) {
          preview = (
            <PhotoAlbumPreview
              itemsCounter={props.number}
              image={imageParams.image}
              compact={imageParams.compact}
              onPress={this.postOpenHandler}
            />
          );
        }
        break;
      case 'link':
        if (imageParams.image) {
          preview = (
            <LinkPreview
              {...props}
              image={imageParams.image}
              compact={imageParams.compact}
              url={props.url}
              onPress={this.remoteLinkOpenHandler.bind(null, props.link)}
            />
          );
        }
        break;
      case 'user':
        preview = (
          <View style={styles.user_content}>
            <View style={styles.user_text}>
              {props.texthtml.text.length ?
                <HTMLView
                  value={props.texthtml.text}
                  inline={true}
                  onLinkPress={this.linkOpenHandler}
                />
                : null
              }
            </View>
            <View style={styles.user_location}>
              <Image
                source={{uri: props.location.image.src[0].url}}
                style={styles.user_location_icon}
              />
              <Text style={styles.user_location_text}>
                {props.location.text}
              </Text>
            </View>
            <View style={styles.user_location}>
              <Image
                source={{uri: props.language.image.src[0].url}}
                style={styles.user_location_icon}
              />
              <Text style={styles.user_location_text}>
                {props.language.text}
              </Text>
            </View>
          </View>
        );
        break;
    }

    return preview;
  };
  renderDescription = (props) => {
    var description = null,
      text = props.texthtml && props.texthtml.text;

    if (text) {
      description = (
        <TouchableOpacity style={styles.description} onPress={this.postOpenHandler}>
          <HTMLView
            value={text}
            inline={true}
            onLinkPress={this.linkOpenHandler}
          />
        </TouchableOpacity>
      );
    }

    return description;
  };
  render() {
    var state = this.state,
      props = this.props,
      author = props.user,
      title,
      text,
      commentsInfo = {
        text: state.commentsCounter
      },
      likesInfo = {
        text: state.likesCounter,
        alreadyLiked: state.alreadyLiked,
        thirdPartyUpdate: state.likesUpdated
      },
      sharingInfo,
      preview,
      authorText;

    if (props.tools) {
      sharingInfo = {
        url: props.tools[0].link && props.tools[0].link.url,
        title: props.tools[0].text,
        alreadyShared: state.alreadyShared,
        thirdPartyUpdate: state.sharingUpdated
      };
    }

    title = (
      <TouchableOpacity style={styles.title} onPress={this.postOpenHandler}>
        <Text style={styles.title_text}>{(props.parent && props.parent.title) || props.title}</Text>
      </TouchableOpacity>
    );

    switch (props.type) {
      case 'video':
        preview = this.renderPreview(props);
        break;
      case 'photo':
        preview = this.renderPreview(props);
        break;
      case 'audio':
        preview = this.renderPreview(props);
        break;
      case 'article':
      case 'text':
      case 'posting':
        preview = this.renderPreview(props);
        text = this.renderDescription(props);
        break;
      case 'album':
        preview = this.renderPreview(props);
        break;
      case 'like': {
        authorText = props.text;
        preview = this.renderPreview(props.parent);
        text = this.renderDescription(props.parent);
        break;
      }
      case 'link':
        preview = this.renderPreview(props);
        text = this.renderDescription(props);
        break;
      case 'user':
        author = props;
        authorText = props.text;
        title = null;
        preview = this.renderPreview(props);
        break;
    }

    if (!authorText) {
      authorText = author.text;
    }

    return (
      <View style={styles.wrap}>
        <View style={styles.author_wrap} onPress={this.postOwnerOpenHandler}>
          <TouchableOpacity onPress={this.postOwnerOpenHandler}>
            <Avatar src={author.image.src} />
          </TouchableOpacity>
          <View style={styles.author_name_wrap}>
            <Text style={styles.names_wrap}>
              <Text
                style={styles.author_name}
                onPress={this.postOwnerOpenHandler}
              >
                {authorText}
              </Text>
              {props.parent && props.parent.user ?
                <Text>
                  <Text>{'\u00a0'}</Text>
                  <Text
                    style={styles.parent_author_name}
                    onPress={this.postParentOwnerOpenHandler}
                  >{props.parent.user.text}</Text>
                </Text>
                : null
              }
            </Text>
            <Text style={styles.posted_time}>{props.datetime.text}</Text>
          </View>
        </View>
        {state.compact ?
          <View>
            <View style={styles.compact_layout_preview_wrap}>
              {preview}
              <View style={styles.compact_layout_title_wrap}>
                {title}
              </View>
            </View>
            {text}
          </View>
          :
          <View>
            {title}
            {preview}
            {text}
          </View>
        }
        {props.statistic ?
          <Statistic
            comments={commentsInfo}
            like={likesInfo}
            sharing={sharingInfo}
            views={props.statistic[2]}
            data={{
              url: props.link.url,
              type: props.type,
              id: props.link.params[props.type],
              title: props.title,
              text:  props.texthtml.text
            }}
            addNewLike={this.increaseLikesCounter}
            postOpenHandler={this.postOpenByCommentsHandler}
            addNewSharing={this.updateSharingStatistic}
          />
          : null
        }
      </View>
    );
  }
}

export default Item;
