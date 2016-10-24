'use strict';

import React, { Component } from 'react';
import ReactAddonsUpdate from 'react-addons-update';
import {
  View,
  Text,
  ListView,
  TouchableOpacity,
  TouchableHighlight,
  DeviceEventEmitter
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../modules/ajax';
import * as storage from '../../modules/storage';
import * as EventManager from '../../modules/events';
import * as InteractionManager from '../../modules/interactions';
import * as postsHelpers from '../../modules/posts';
import * as messagesModel from '../../models/messages';
import Loading from '../../components/loading/code';
import {Avatar} from '../../components/pictures/code';
import {
  ButtonBlue,
  ButtonGreen
} from '../../components/buttons/code';
import KeyboardAwareScrollView from '../../components/keyboard-aware-scroll-view/code';
import TextEditor from '../../components/text-editor/code';
import HTMLView from '../../components/html-view/code';
import Form from '../../components/form/code';
import dismissKeyboard from 'dismissKeyboard';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import pageStyles from '../../../styles/page';
import ovlStyles from '../../../styles/ovl';

class MessageRemoveOverlay extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    removeMessage: React.PropTypes.func.isRequired,
    title: React.PropTypes.string
  };
  state = {
    loading: false,
    error: null,
    data: null
  };
  request;
  downloadInitialData = () => {
    this.setState({
      loading: true
    });
    this.request = messagesModel.getRemoveForm({
      url: this.props.url
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
        newState.data = response;
      }
      this.setState(newState);
    });
  };
  submit = (err, response) => {
    if (!err) {
      this.props.removeMessage(response.texthtml);
    }
  };
  close = () => {
    EventManager.trigger('overlayClose');
  };
  componentDidMount() {
    this.downloadInitialData();
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  render() {
    var state = this.state,
      data = state.data,
      title = (data && data.title) || this.props.title;

    return (
      <View>
        <View style={ovlStyles.title}>
          <Text style={ovlStyles.title_text}>{title}</Text>
        </View>
        <View style={ovlStyles.content}>
          {!data && !state.error ?
            <View style={ovlStyles.loader}>
              <Loading />
            </View>
            : null
          }
          {state.error ?
            <View>
              <View style={ovlStyles.error}>
                <Text style={ovlStyles.error_text}>{state.error}</Text>
              </View>
              <ButtonGreen
                text="Close"
                onPress={this.close}
              />
            </View>
            : null
          }
          {data && !state.error ?
            <View>
              <Form
                items={state.data.items}
                controller={messagesModel.remove}
                submit={this.submit}
                afterSuccessClose={this.close}
              />
            </View>
            : null
          }
        </View>
      </View>
    );
  }
}

class Message extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    curUser: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    texthtml: React.PropTypes.object.isRequired,
    datetime: React.PropTypes.object.isRequired,
    tools: React.PropTypes.array,
    error: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    tryAgain: React.PropTypes.func.isRequired
  };
  state = {
    removed: false,
    removedMessage: '',
    loading: null,
    error: null
  };
  onPressUser = () => {
    postsHelpers.openPostOwnerFromList({
      data: this.props.user
    }, this.props.navigator);
  };
  remove = (message) => {
    this.setState({
      removed: true,
      removedMessage: message
    });
  };
  removeOnPress = (options) => {
    EventManager.trigger('overlayOpen', {
      content: (
        <MessageRemoveOverlay
          title={options.text}
          url={options.link.url}
          removeMessage={this.remove}
        />
      )
    });
  };
  actionOnPress = (action) => {
    switch (action.image.icon) {
      case 'trash':
        InteractionManager.runAfterInteractions(() => {
          this.removeOnPress(action);
        });
        break;
    }
    EventManager.trigger('tooltipMenuClose');
  };
  onPressItem = () => {
    if (!this.props.tools || this.state.removed) {
      return;
    }

    var overlayContent = (
      <View>
        {_.map(this.props.tools, (item, key) => {
          return (
            <TouchableHighlight
              key={key}
              style={styles.action_overlay_item}
              onPress={this.actionOnPress.bind(this, item)}
              underlayColor="#DFDFDF"
            >
              <Text style={styles.action_overlay_text}>{item.text}</Text>
            </TouchableHighlight>
          );
        })}
      </View>
    );
    EventManager.trigger('tooltipMenuOpen', {
      content: overlayContent
    });
  };
  tryAgain = () => {
    this.setState({
      loading: true,
      error: null
    });
    this.props.tryAgain({
      text: this.props.texthtml.text
    });
  };
  componentWillMount() {
    this.setState({
      error: this.props.error,
      loading: this.props.loading
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      error: nextProps.error,
      loading: nextProps.loading
    });
  }
  render() {
    var state = this.state,
      props = this.props,
      userCont,
      messageCont,
      isMyMessage = props.curUser.text === props.user.text,
      messageStyle = [styles.message],
      messageTextStyle = [styles.message_text],
      messageText = props.texthtml.text;

    if (this.state.removed) {
      messageStyle.push(styles.message_removed);
      messageTextStyle.push(styles.message_text_removed);
      messageText = this.state.removedMessage;
    } else if (isMyMessage) {
      messageStyle.push(styles.message_me);
      messageTextStyle.push(styles.message_me_text);
    }

    userCont = (
      <View>
        <TouchableOpacity
          style={styles.avatar}
          onPress={this.onPressUser}
        >
          <Avatar src={props.user.image.src} />
        </TouchableOpacity>
        {state.loading ?
          <Loading size="small" />
          : null
        }
        {state.error ?
          <TouchableOpacity
            style={styles.error_marker}
            onPress={this.tryAgain}
          >
            <Icon name="exclamation-triangle" style={styles.error_marker_icon} />
          </TouchableOpacity>
          : null
        }
      </View>
    );
    messageCont = (
      <TouchableOpacity
        style={messageStyle}
        onPress={this.onPressItem}
      >
        <HTMLView
          value={messageText}
          textStyle={messageTextStyle}
          inline={true}
        />
        {!state.removed ?
          <Text style={styles.message_time}>{props.datetime.text}</Text>
          : null
        }
      </TouchableOpacity>
    );

    return (
      <View>
        {isMyMessage ?
          <View style={styles.item_wrap}>
            {messageCont}
            {userCont}
          </View>
          :
          <View style={styles.item_wrap}>
            {userCont}
            {messageCont}
          </View>
        }
      </View>
    );
  }
}

class Messenger extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    navigator: React.PropTypes.object.isRequired,
    updateLastMessage: React.PropTypes.func
  };
  state = {
    data: null,
    loading: true,
    isLoadingTail: false,
    submitLoading: null,
    error: false,
    full: null,
    empty: null,
    rawData: [],
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }),
    pageUrl: null,
    user: null,
    userReceiver: null,
    editor_bottom: 0,
    formData: null,
    formPlaceholder: null,
    refreshId: null,
    refreshPeriod: 10 * 1000
  };
  downloadMessages = () => {
    var curState = this.state;
    this.request = messagesModel.getListByUser({
      url: this.props.url,
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
        let feeds = curState.rawData.slice(0);
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
          refreshId: response.refresh && response.refresh.value,
          dataSource: curState.dataSource.cloneWithRows(feeds),
          pageUrl: response.pager
        });
        if (!curState.formPlaceholder) {
          _.extend(newState, {
            formData: response.form,
            formPlaceholder: _.findWhere(response.form.items, {name: 'letter-text'}).placeholder,
            userReceiver: _.findWhere(response.form.items, {name: 'user'}).value
          });
        }
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
      error: null
    });
    this.downloadMessages();
  };
  keyboardWillShown = (event) => {
    var keyboardSize = 0;
    if (event && event.endCoordinates.screenY < event.startCoordinates.screenY) {
      keyboardSize = event.endCoordinates.height;
    }

    this.setState({
      editor_bottom: keyboardSize
    });
  };
  onScroll = (e) => {
    e = e.nativeEvent;
    var state = this.state,
      scrollTarget = e.contentSize.height - e.layoutMeasurement.height - 100,
      curScroll = e.contentOffset.y;

    if (scrollTarget > 0 && curScroll > scrollTarget && !state.isLoadingTail && !state.full && !state.empty && (state.rawData.length && state.pageUrl)) {
      this.setState({
        isLoadingTail: true
      });
      this.downloadMessages();
    }
  };
  addNewMessage = (text) => {
    var state = this.state,
      message = {
        user: state.user,
        texthtml : {
          text
        },
        datetime: {
          text: 'Right now'
        },
        loading: true
      };

    var newState = ReactAddonsUpdate(state, {
      rawData: {
        $unshift: [message]
      }
    });
    newState.dataSource = state.dataSource.cloneWithRows(newState.rawData);
    this.setState(newState);
  };
  addNewMessageError = () => {
    var messages = ReactAddonsUpdate(this.state.rawData, {
      0: {
        error: {
          $set: true
        },
        loading: {
          $set: false
        }
      }
    });

    this.setState({
      rawData: messages,
      dataSource: this.state.dataSource.cloneWithRows(messages)
    });
  };
  addNewMessageSuccess = (response) => {
    this.setState({
      rawData: response.rows,
      refreshId: response.refresh && response.refresh.value,
      dataSource: this.state.dataSource.cloneWithRows(response.rows),
      pageUrl: response.pager
    });
    if (_.isFunction(this.props.updateLastMessage)) {
      this.props.updateLastMessage(response.rows[0]);
    }
  };
  submitRequest = (options, callback) => {
    this.request = messagesModel.add({
      text: options.text,
      user: this.state.userReceiver
    }, (err, response) => {
      if (!this.request) {
        return;
      }
      if (err) {
        this.addNewMessageError();
      } else {
        this.addNewMessageSuccess(response);
      }
      callback && callback(err, response);
    });
  };
  submitOnPress = () => {
    if (this.state.submitLoading) {
      return;
    }

    var textEditor = this.refs.textEditor,
      text = textEditor.textEncode();

    this.setState({
      submitLoading: true
    });
    this.addNewMessage(text);
    dismissKeyboard();
    textEditor.refresh();

    this.submitRequest({
      text
    }, () => {
      this.setState({
        submitLoading: false
      });
    });
  };
  refresh = () => {
    var state = this.state;
    if (!state.formData) {
      return;
    }

    var formFields = _.where(state.formData.items, {type: 'hidden'}),
      requestData = {
        boundary: state.refreshId
      };

    _.each(formFields, function(item) {
      if (item.name !== 'mission' && item.name !== 'identification') {
        requestData[item.name] = item.value;
      }
    });

    this.request = messagesModel.refresh(requestData, (err, response) => {
      if (!this.request) {
        return;
      }
      if (!err && response && response.items) {
        let newState = ReactAddonsUpdate(state, {
          rawData: {
            $unshift: response.items
          }
        });
        _.extend(newState, {
          refreshId: response.value,
          dataSource: state.dataSource.cloneWithRows(newState.rawData)
        });
        this.setState(newState);
        if (_.isFunction(this.props.updateLastMessage)) {
          this.props.updateLastMessage(response.items[0]);
        }
      }
      this.startRefresh();
    });
  };
  refreshTimer;
  startRefresh = () => {
    this.refreshTimer = setTimeout(this.refresh, this.state.refreshPeriod);
  };
  stopRefresh = () => {
    clearTimeout(this.refreshTimer);
  };
  async componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.downloadMessages();
    });
    this.setState({
      user: await storage.get('account')
    });
    this._listeners = [
      DeviceEventEmitter.addListener('keyboardWillChangeFrame', this.keyboardWillShown)
    ];
    this.startRefresh();
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.loading !== nextState.loading
      || state.isLoadingTail !== nextState.isLoadingTail
      || state.submitLoading !== nextState.submitLoading
      || state.error !== nextState.error
      || state.editor_bottom !== nextState.editor_bottom
      || state.rawData !== nextState.rawData;
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
    this._listeners.forEach(function(listener) {
      listener.remove();
    });
    this.stopRefresh();
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
        curUser={this.state.user}
        navigator={this.props.navigator}
        tryAgain={this.submitRequest}
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
        {!state.loading && !state.error && !state.rawData.length ?
          <View style={pageStyles.error_wrap}>
            <View style={pageStyles.error_cont}>
              <Icon name="commenting-o" style={styles.empty_icon} />
            </View>
          </View>
          : null
        }
        {!state.loading && !state.error && state.rawData.length ?
          <KeyboardAwareScrollView
            ref="scrollContent"
            additionalMarginBottom={!state.loading ? 49 : null}
            onScroll={this.onScroll}
            style={styles.wrap}
          >
            <ListView
              style={styles.content}
              dataSource={state.dataSource}
              renderRow={this.renderItem}
              renderFooter={this.renderFooter}
              enableEmptySections={true}
            />
            <View ref="scrollTarget" />
          </KeyboardAwareScrollView>
          : null
        }
        {!state.loading && !state.error ?
          <View style={[styles.editor, {bottom: state.editor_bottom}]}>
            <TextEditor
              ref="textEditor"
              placeholder={state.formPlaceholder}
              loading={state.submitLoading}
              submit={true}
              submitOnPress={this.submitOnPress}
              doNotValid={true}
            />
          </View>
          : null
        }
        <View style={pageStyles.shadow_line} />
      </View>
    );
  }
}

export default Messenger;
