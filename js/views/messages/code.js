'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  ListView,
  TouchableHighlight,
  Image
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../modules/ajax';
import Loading from '../../components/loading/code';
import * as InteractionManager from '../../modules/interactions';
import {
  ButtonBlue
} from '../../components/buttons/code';
import {Avatar} from '../../components/pictures/code';
import * as messagesModel from '../../models/messages';
import HTMLView from '../../components/html-view/code';
import styles from './style';
import pageStyles from '../../../styles/page';

class Message extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    link: React.PropTypes.object.isRequired,
    texthtml: React.PropTypes.object.isRequired,
    datetime: React.PropTypes.object.isRequired
  };
  state = {
    user: '',
    text: '',
    date: ''
  };
  updateLastMessage = (message) => {
    this.setState({
      user: message.user,
      text: message.texthtml.text,
      date: message.datetime.text
    });
  };
  onPress = () => {
    var props = this.props;
    props.navigator.push({
      title: props.user.text,
      id: 'messenger',
      backButton: true,
      data: {
        url: props.link.url,
        updateLastMessage: this.updateLastMessage
      }
    });
  };
  componentWillMount() {
    var props = this.props;
    this.setState({
      user: props.user,
      text: props.texthtml.text,
      date: props.datetime.text
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.user,
      text: nextProps.texthtml.text,
      date: nextProps.datetime.text
    });
  }
  render() {
    var state = this.state;
    return (
      <TouchableHighlight
        style={styles.item_wrap}
        onPress={this.onPress}
        underlayColor="#EFEFEF"
      >
        <View style={styles.item}>
          <Avatar src={state.user.image.src} size="large" />
          <View style={styles.item_cont}>
            <View style={styles.item_header}>
              <Text style={styles.item_title}>{state.user.text}</Text>
              <Text style={styles.posted_time}>{state.date}</Text>
            </View>
            <HTMLView
              value={state.text}
              inline={true}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

class MessagesList extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired
  };
  state = {
    loading: true,
    isLoadingTail: false,
    error: false,
    full: null,
    empty: null,
    rawData: [],
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }),
    pageUrl: null
  };
  request;
  downloadData = () => {
    var curState = this.state;
    this.request = messagesModel.getList({
      page: curState.pageUrl
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
        let feeds = curState.rawData;
        if (!response.rows.length) {
          if (feeds.length) {
            newState.full = true;
          } else {
            newState.empty = true;
          }
        } else {
          if (feeds.length) {
            feeds = feeds.concat(response.rows);
          } else {
            feeds = response.rows;
          }
        }
        _.extend(newState, {
          rawData: feeds,
          dataSource: curState.dataSource.cloneWithRows(feeds),
          pageUrl: response.pager
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
  tryAgain = () => {
    this.setState({
      loading: true,
      error: false
    });
    this.downloadData();
  };
  onEndReached = () => {
    var state = this.state;
    if (!state.isLoadingTail && !state.full && !state.empty && (state.rawData.length && state.pageUrl)) {
      this.setState({
        isLoadingTail: true
      });
      this.downloadData();
    }
  };
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.loading !== nextState.loading
      || state.error !== nextState.error
      || state.isLoadingTail !== nextState.isLoadingTail
      || state.rawData !== nextState.rawData;
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.downloadData();
    });
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  renderFooter = () => {
    return this.state.isLoadingTail ?
      <Loading style={styles.footer_loader} />
      : null;
  };
  renderItem = (item) => {
    return (
      <Message
        {...item}
        navigator={this.props.navigator}
      />
    );
  };
  render() {
    var state = this.state;
    return (
      <View style={pageStyles.wrap_white}>
        {state.loading ?
          <View style={pageStyles.loader_wrap}>
            <View style={pageStyles.loader_cont}>
              <Loading size="large" />
            </View>
          </View>
          : null
        }
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
          <ListView
            dataSource={state.dataSource}
            renderRow={this.renderItem}
            onEndReached={this.onEndReached}
            renderFooter={this.renderFooter}
            enableEmptySections={true}
          />
          : null
        }
        <View style={pageStyles.shadow_line} />
      </View>
    );
  }
}

export default MessagesList;
