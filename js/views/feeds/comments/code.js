'use strict';

import React, { Component } from 'react';
import ReactAddonsUpdate from 'react-addons-update';
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  ListView,
  DeviceEventEmitter,
  Alert
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../../modules/ajax';
import * as storage from '../../../modules/storage';
import * as postsHelpers from '../../../modules/posts';
import * as account from '../../../modules/account';
import * as EventManager from '../../../modules/events';
import * as InteractionManager from '../../../modules/interactions';
import {
  ButtonGreen
} from '../../../components/buttons/code';
import {Avatar} from '../../../components/pictures/code';
import * as commentsModel from '../../../models/comments';
import Login from '../../login/code';
import Loading from '../../../components/loading/code';
import Report from '../../../components/report/code';
import TextEditor from '../../../components/text-editor/code';
import HTMLView from '../../../components/html-view/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import dismissKeyboard from 'dismissKeyboard';
import Form from '../../../components/form/code';
import styles from './style';
import ovlStyles from '../../../../styles/ovl';

class CommentEditOverlay extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    updateComment: React.PropTypes.func.isRequired,
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
    this.request = commentsModel.getEditForm({
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
  submit = (err, response, values) => {
    if (!err) {
      dismissKeyboard();
      this.props.updateComment(values['posting-htmltext']);
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
            <Form
              items={data.items}
              controller={commentsModel.save}
              submit={this.submit}
              afterSuccessClose={this.close}
            />
            : null
          }
        </View>
      </View>
    );
  }
}

class CommentRemoveOverlay extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    removeComment: React.PropTypes.func.isRequired,
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
    this.request = commentsModel.getRemoveForm({
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
      this.props.removeComment(response.texthtml);
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
                controller={commentsModel.remove}
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

class Comment extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    tools: React.PropTypes.array,
    texthtml: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    datetime: React.PropTypes.object.isRequired,
    commentOwnerOpenHandler: React.PropTypes.func.isRequired,
    loading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    tryAgain: React.PropTypes.func.isRequired
  };
  state = {
    text: '',
    alreadyLiked: false,
    removed: false,
    loading: null,
    error: null
  };
  linkOpenHandler = (url, text) => {
    postsHelpers.openLinkInText(url, text, this.props.navigator);
  };
  commentOwnerOpenHandler = () => {
    this.props.commentOwnerOpenHandler(this.props);
  };
  commentActionOnPress = (action) => {
    switch (action.image.icon) {
      case 'like':
        this.likeCommentOnPress();
        break;
      case 'complaint':
        InteractionManager.runAfterInteractions(() => {
          this.reportCommentOnPress();
        });
        break;
      case 'settings':
        InteractionManager.runAfterInteractions(() => {
          this.editCommentOnPress(action);
        });
        break;
      case 'trash':
        InteractionManager.runAfterInteractions(() => {
          this.removeCommentOnPress(action);
        });
        break;
    }
    EventManager.trigger('tooltipMenuClose');
  };
  commentOnPress = () => {
    var state = this.state,
      props = this.props;

    if (!props.tools || state.removed) {
      return;
    }

    var overlayContent = (
      <View>
        {_.map(props.tools, (item, key) => {
          if (!item.link || state.alreadyLiked && item.image.icon === 'like') {
            return null;
          } else {
            return (
              <TouchableHighlight
                key={key}
                style={styles.action_overlay_item}
                onPress={this.commentActionOnPress.bind(this, item)}
                underlayColor="#DFDFDF"
              >
                <Text style={styles.action_overlay_text}>{item.text}</Text>
              </TouchableHighlight>
            );
          }
        })}
      </View>
    );
    EventManager.trigger('tooltipMenuOpen', {
      content: overlayContent
    });
  };
  likeCommentOnPress = async () => {
    if (!await account.isAuthorized()) {
      return EventManager.trigger('sideMenuOpen', {
        content: <Login />
      });
    }

    var link = this.props.tools[0].link;
    if (link) {
      commentsModel.like({
        id: link.url.replace(/\/posting\/([^\/]+).+$/, '$1')
      }, (err) => {
        if (err) {
          Alert.alert('Comment like error', err);
        } else {
          this.setState({
            alreadyLiked: true
          });
        }
      });
    }
  };
  reportCommentOnPress = () => {
    var link = this.props.tools[1].link;
    if (link) {
      EventManager.trigger('overlayOpen', {
        content: (
          <Report
            url={link.url}
            id={link.url.replace(/\/posting\/([^\/]+).+$/, '$1')}
            type="posting"
          />
        )
      });
    }
  };
  editCommentOnPress = async (options) => {
    if (!await account.isAuthorized() || !options.link.url) {
      return EventManager.trigger('sideMenuOpen', {
        content: <Login />
      });
    }

    EventManager.trigger('overlayOpen', {
      content: (
        <CommentEditOverlay
          title={options.text}
          url={options.link.url}
          updateComment={this.update}
        />
      )
    });
  };
  removeCommentOnPress = async (options) => {
    if (!await account.isAuthorized() || !options.link.url) {
      return EventManager.trigger('sideMenuOpen', {
        content: <Login />
      });
    }

    EventManager.trigger('overlayOpen', {
      content: (
        <CommentRemoveOverlay
          title={options.text}
          url={options.link.url}
          removeComment={this.remove}
        />
      )
    });
  };
  update = (text) => {
    this.setState({text});
  };
  remove = (message) => {
    this.setState({
      removed: true,
      text: message
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
    var props = this.props;
    this.setState({
      text: props.texthtml.extended || props.texthtml.text,
      alreadyLiked: props.tools && !props.tools[0].link,
      error: this.props.error,
      loading: this.props.loading
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      text: nextProps.texthtml.extended || nextProps.texthtml.text,
      alreadyLiked: nextProps.tools && !nextProps.tools[0].link,
      error: nextProps.error,
      loading: nextProps.loading
    });
  }
  render() {
    var state = this.state,
      props = this.props,
      alreadyLiked = this.state.alreadyLiked;

    return (
      <View style={styles.comment}>
        <View style={styles.author_wrap}>
          <TouchableOpacity
            onPress={this.commentOwnerOpenHandler}
          >
            <Avatar src={props.user.image.src} />
          </TouchableOpacity>
        </View>
        <View style={styles.comment_cont}>
          <TouchableOpacity onPress={this.commentOnPress}>
            <Text style={styles.author_name}>{props.user.text}</Text>
            <HTMLView
              value={state.text}
              inline={true}
              onLinkPress={this.linkOpenHandler}
              textStyle={state.removed ? styles.removedCommentText : null}
            />
          </TouchableOpacity>
          {!state.removed ?
            <View style={styles.statistic}>
              <Text style={styles.posted_time}>{props.datetime.text}</Text>
              {props.tools ?
                <TouchableOpacity
                  style={styles.comment_stats_button}
                  onPress={this.reportCommentOnPress}
                >
                  <Icon name="flag" style={styles.comment_stats_icon}/>
                </TouchableOpacity>
                : null
              }
              {props.tools ?
                <TouchableOpacity
                  style={styles.comment_stats_button}
                  onPress={this.likeCommentOnPress}
                >
                  <Icon
                    name="thumbs-up"
                    style={[
                    styles.comment_stats_icon,
                    alreadyLiked ? styles.comment_stats_icon_liked : null
                  ]}
                  />
                </TouchableOpacity>
                : null
              }
              {state.loading ?
                <View style={[styles.comment_stats_button, styles.comment_stats_loading]}>
                  <Loading size="small" />
                </View>
                : null
              }
              {state.error ?
                <TouchableOpacity
                  style={[styles.comment_stats_button, styles.comment_stats_error]}
                  onPress={this.tryAgain}
                >
                  <Icon name="exclamation-triangle" style={styles.error_marker_icon} />
                </TouchableOpacity>
                : null
              }
            </View>
            : null
          }
        </View>
      </View>
    );
  }
}

class Comments extends Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired,
    comments: React.PropTypes.array.isRequired,
    isLoadingTail: React.PropTypes.bool,
    scrollToCommentsField: React.PropTypes.func.isRequired,
    addNewCommentCallback: React.PropTypes.func.isRequired
  };
  state = {
    rawData: [],
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }),
    formPlaceholder: null,
    curUser: null,
    refreshPeriod: 10 * 1000,
    refreshId: null
  };
  commentOwnerOpenHandler = (item) => {
    postsHelpers.openPostOwnerFromList({
      data: item.user
    }, this.props.navigator);
  };
  postOpenHandler = (item) => {
    postsHelpers.openLinkInText(item.link.url, item.text, this.props.navigator);
  };
  addNewComment = (text) => {
    var state = this.state,
      comment = {
        type: 'posting',
        user: state.curUser,
        texthtml : {
          text
        },
        datetime: {
          text: 'just now'
        },
        loading: true
      };

    var newState = ReactAddonsUpdate(state, {
      rawData: {
        $unshift: [comment]
      }
    });
    newState.dataSource = state.dataSource.cloneWithRows(newState.rawData);
    this.setState(newState);
  };
  addNewCommentError = () => {
    var comments = ReactAddonsUpdate(this.state.rawData, {
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
      rawData: comments,
      dataSource: this.state.dataSource.cloneWithRows(comments)
    });
  };
  addNewCommentSuccess = (response) => {
    var comments = ReactAddonsUpdate(this.state.rawData, {
      0: {
        $set: response
      }
    });
    this.setState({
      rawData: comments,
      dataSource: this.state.dataSource.cloneWithRows(comments)
    });
    if (_.isFunction(this.props.addNewCommentCallback)) {
      this.props.addNewCommentCallback();
    }
  };
  addNewLike = (data) => {
    var newState = ReactAddonsUpdate(this.state, {
      rawData: {
        $unshift: [data]
      }
    });
    newState.dataSource = this.state.dataSource.cloneWithRows(newState.rawData);
    this.setState(newState);
  };
  request = null;
  submitRequest = (options, callback) => {
    var props = this.props;
    this.request = commentsModel.add({
      type: props.data.type,
      id: props.data.id,
      text: options.text
    }, (err, response) => {
      if (!this.request) {
        return;
      }
      if (err || !response) {
        this.addNewCommentError();
      } else {
        this.addNewCommentSuccess(response);
      }
      callback && callback(err, response);
    });
  };
  submitOnPress = async () => {
    if (!await account.isAuthorized()) {
      return EventManager.trigger('sideMenuOpen', {
        content: <Login afterLogin={this.submitOnPress} />
      });
    }

    var textEditor = this.refs.textEditor,
      text = textEditor.textEncode();

    this.setState({
      submitLoading: true
    });

    this.addNewComment(text);
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
    var state = this.state,
      formFields = _.where(this.props.data.form.items, {type: 'hidden'}),
      requestData = {
        boundary: state.refreshId
      };

    _.each(formFields, function(item) {
      if (item.name !== 'mission' && item.name !== 'identification') {
        requestData[item.name] = item.value;
      }
    });

    this.request = commentsModel.refresh(requestData, (err, response) => {
      if (!this.request) {
        return;
      }
      if (!err && response && response.items) {
        let newMessages = _.filter(response.items, function(item) {
            return item.user.text !== state.curUser.text;
          }),
          newState = ReactAddonsUpdate(state, {
            rawData: {
              $unshift: newMessages
            }
          });

        if (newMessages.length) {
          newState.dataSource = state.dataSource.cloneWithRows(newState.rawData);
          if (_.isFunction(this.props.addNewCommentCallback)) {
            this.props.addNewCommentCallback();
          }
        }
        newState.refreshId = response.value;
        this.setState(newState);
      }
      this.startRefresh();
    });
  };
  refreshTimer;
  startRefresh = () => {
    if (this.props.data.form) {
      this.refreshTimer = setTimeout(this.refresh, this.state.refreshPeriod);
    }
  };
  stopRefresh = () => {
    clearTimeout(this.refreshTimer);
  };
  async componentWillMount() {
    var props = this.props,
      formPlaceholder,
      refreshId;

    if (props.data.form) {
      let data = _.findWhere(props.data.form.items, {name: 'posting-text'});
      if (data && data.placeholder) {
        formPlaceholder = data.placeholder;
      }
    }
    if (props.data.refresh) {
      refreshId = props.data.refresh.value;
    }

    this.setState({
      rawData: props.comments,
      dataSource: this.state.dataSource.cloneWithRows(props.comments),
      curUser: await storage.get('account'),
      formPlaceholder,
      refreshId
    });
  }
  componentWillReceiveProps(nextProps) {
    var props = this.props;
    if (props.isLoadingTail !== nextProps.isLoadingTail || props.comments !== nextProps.comments) {
      this.setState({
        isLoadingTail: nextProps.isLoadingTail,
        rawData: nextProps.comments,
        dataSource: this.state.dataSource.cloneWithRows(nextProps.comments)
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.rawData !== nextState.rawData
      || state.submitLoading !== nextState.submitLoading
      || state.isLoadingTail !== nextState.isLoadingTail;
  }
  componentDidMount() {
    EventManager.on('likeAdded', this.addNewLike);
    this.startRefresh();
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
    EventManager.off('likeAdded', this.addNewLikeOrSharing);
    this.stopRefresh();
  }
  renderSeparator(sectionID, rowID) {
    return <View style={styles.comment_separator} key={rowID} />;
  }
  renderFooter = () => {
    return this.props.isLoadingTail ?
      <Loading style={styles.footer_loader} />
      : null;
  };
  renderItem = (item) => {
    switch (item.type) {
      case 'posting':
        return (
          <Comment
            {...item}
            commentOwnerOpenHandler={this.commentOwnerOpenHandler}
            navigator={this.props.navigator}
            tryAgain={this.submitRequest}
          />
        );
      case 'like':
        return (
          <TouchableOpacity
            style={styles.like}
            onPress={this.commentOwnerOpenHandler.bind(this, item)}
          >
            <View style={styles.like_avatar}>
              <Avatar src={item.user.image.src} size="small" />
            </View>
            <Text style={styles.like_text}>{item.text}</Text>
            <Text style={styles.posted_time_like}>{item.datetime.text}</Text>
          </TouchableOpacity>
        );
      case 'mention':
        return (
          <TouchableOpacity
            style={styles.like}
            onPress={this.postOpenHandler.bind(this, item)}
          >
            <View style={styles.like_avatar}>
              <Avatar src={item.user.image.src} size="small" />
            </View>
            <Text style={styles.mention_text}>{item.text}</Text>
          </TouchableOpacity>
        );
    }
  };
  render() {
    var state = this.state,
      props = this.props;

    return (
      <View>
        <View style={styles.text_editor_wrap}>
          <TextEditor
            ref="textEditor"
            placeholder={state.formPlaceholder}
            loading={state.submitLoading}
            submit={true}
            submitOnPress={this.submitOnPress}
            doNotValid={true}
            scrollToField={props.scrollToCommentsField}
            transparentField={true}
          />
        </View>
        <ListView
          dataSource={state.dataSource}
          renderRow={this.renderItem}
          renderSeparator={this.renderSeparator}
          renderFooter={this.renderFooter}
          enableEmptySections={true}
        />
      </View>
    );
  }
}

export default Comments;
