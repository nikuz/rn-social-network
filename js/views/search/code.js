'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  Image
} from 'react-native';
import * as _ from 'underscore';
import * as device from '../../modules/device';
import * as ajax from '../../modules/ajax';
import {ButtonBlue} from '../../components/buttons/code';
import {Avatar} from '../../components/pictures/code';
import * as postsHelpers from '../../modules/posts';
import Loading from '../../components/loading/code';
import * as searchModel from '../../models/search';
import HTMLView from '../../components/html-view/code';
import KeyboardAwareScrollView from '../../components/keyboard-aware-scroll-view/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import pageStyles from '../../../styles/page';

class Search extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired
  };
  state = {
    value: '',
    updateInterval: 500,
    loading: false,
    error: null,
    users: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }),
    posts: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }),
    empty: null,
    more: null
  };
  value = '';
  downloadHandler = () => {
    var state = this.state;
    this.setState({
      loading: true,
      error: false
    });
    if (this.request) {
      ajax.abort(this.request);
    }
    this.request = searchModel.search({
      value: this.value
    }, (err, response) => {
      if (!this.request) {
        return;
      }
      var newState = {
        loading: false
      };
      if (err) {
        newState.error = err;
      } else {
        _.extend(newState, {
          users: state.users.cloneWithRows(response.users),
          posts: state.posts.cloneWithRows(response.posts),
          empty: response.empty,
          more: response.more
        });
      }
      this.setState(newState);
    });
  };
  selectPostHandler = (item) => {
    postsHelpers.openPostFromList({
      title: item.title,
      data: item
    }, this.props.navigator);
  };
  selectUserHandler = (item) => {
    postsHelpers.openPostOwnerFromList({
      data: item
    }, this.props.navigator);
  };
  linkOpenHandler = (url, text) => {
    postsHelpers.openLinkInText(url, text, this.props.navigator);
  };
  fieldValueChangedHandler = (value) => {
    var state = this.state;
    this.value = value;

    if (state.value !== this.value && this.value.length >= 3) {
      this.downloadHandler();
    }
    this.setState({
      value: this.value
    });
  };
  moreOnPressHandler = () => {
    var state = this.state;
    this.props.navigator.push({
      title: state.value,
      id: 'extended_search',
      backButton: true,
      data: {
        text: state.value
      }
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.users !== nextState.users
      || state.posts !== nextState.posts
      || state.loading !== nextState.loading
      || state.error !== nextState.error;
  }
  componentWillUnmount() {
    this.request = false;
  }
  renderRow = (item) => {
    var cont;
    switch (item.type) {
      case 'user': {
        let icon;
        if (item.image && _.isArray(item.image.src) && item.image.src[0]) {
          icon = (
            <Avatar src={item.image.src} size="large" />
          );
        }
        cont = (
          <TouchableOpacity
            style={styles.item_user}
            onPress={this.selectUserHandler.bind(this, item)}
          >
            {icon}
            <View style={styles.item_user_text_wrap}>
              <Text style={styles.item_user_text}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        );
        break;
      }
      case 'article':
      case 'text':
      case 'video':
      case 'photo':
      case 'audio':
      case 'media':
      case 'album':
      case 'link':
      case 'like': {
        let image, imageSize,
          title = item.title;

        if (item.image && _.isArray(item.image.src) && (item.image.src[1] || item.image.src[0])) {
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
        if (title.length > 50) {
          title = title.substr(0, 50) + '...';
        }
        cont = (
          <TouchableOpacity
            style={styles.item}
            onPress={this.selectPostHandler.bind(null, item)}
          >
            <View style={styles.item_cont}>
              {image}
              <View style={styles.item_text_wrap}>
                <Text style={styles.item_text}>{item.user.text}</Text>
                <Text style={styles.item_text}>{title}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
        break;
      }
      case 'posting': {
        cont = (
          <TouchableOpacity
            style={styles.item}
            onPress={this.selectPostHandler.bind(null, item)}
          >
            <View style={styles.item_cont}>
              <HTMLView
                value={item.texthtml.text}
                onLinkPress={this.linkOpenHandler}
                inline={true}
              />
            </View>
          </TouchableOpacity>
        );
        break;
      }
    }
    return cont;
  };
  render() {
    var state = this.state;
    return (
      <View style={pageStyles.wrap_white}>
        <KeyboardAwareScrollView>
          <View style={styles.field_wrap}>
            <TextInput
              placeholder="Search"
              autoFocus={true}
              placeholderTextColor={device.isAndroid() ? '#666' : '#999'}
              style={styles.field}
              onChangeText={this.fieldValueChangedHandler}
              returnKeyType="search"
            />
            {state.loading ?
              <View style={styles.field_loading}>
                <Loading size="small" />
              </View>
              : null
            }
          </View>
          {state.error ?
            <View style={pageStyles.error_wrap}>
              <View style={pageStyles.error_cont}>
                <Text style={pageStyles.error_text}>{state.error}</Text>
                <ButtonBlue
                  text="Try again"
                  onPress={this.downloadHandler}
                />
              </View>
            </View>
            : null
          }
          <View style={styles.result_rows}>
            <View style={styles.users_list}>
              <ListView
                dataSource={state.users}
                renderRow={this.renderRow}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                enableEmptySections={true}
              />
            </View>
            <View style={styles.posts_list}>
              <ListView
                style={styles.posts_list}
                dataSource={state.posts}
                renderRow={this.renderRow}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                enableEmptySections={true}
              />
            </View>
          </View>
          {!state.empty && state.more ?
            <TouchableOpacity
              style={styles.more}
              onPress={this.moreOnPressHandler}
            >
              <View style={styles.more_cont}>
                <Icon name="arrows-alt" style={styles.more_icon} />
                <Text style={styles.more_text}>{state.more.texthtml}</Text>
              </View>
            </TouchableOpacity>
            : null
          }
          {state.empty ?
            <View style={styles.empty_result}>
              <Text style={styles.empty_result_text}>{state.empty.texthtml}</Text>
            </View>
            : null
          }
        </KeyboardAwareScrollView>
        <View style={pageStyles.shadow_line} />
      </View>
    );
  }
}

export default Search;
