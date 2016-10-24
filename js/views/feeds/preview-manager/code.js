'use strict';

import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  TextInput,
  Switch,
  Clipboard,
  Animated
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../../modules/ajax';
import * as device from '../../../modules/device';
import * as EventManager from '../../../modules/events';
import * as feedsModel from '../../../models/feeds';
import * as browser from '../../../modules/browser';
import * as account from '../../../modules/account';
import Login from '../../login/code';
import Loading from '../../../components/loading/code';
import Report from '../../../components/report/code';
import {
  ButtonBlue
} from '../../../components/buttons/code';
import Form from '../../../components/form/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import ovlStyles from '../../../../styles/ovl';

class AddToAlbumForm extends Component {
  static propTypes = {
    disableTabs: React.PropTypes.func.isRequired,
    close: React.PropTypes.func.isRequired,
    items: React.PropTypes.array.isRequired
  };
  submit = () => {
    this.props.disableTabs();
  };
  close = () => {
    this.props.close();
  };
  render() {
    return (
      <Form
        items={this.props.items}
        controller={feedsModel.saveToAlbum}
        submit={this.submit}
        afterSuccessClose={this.close}
        showNativeIOSSelectors={true}
      />
    );
  }
}

class AddNewAlbumForm extends Component {
  static propTypes = {
    close: React.PropTypes.func.isRequired,
    items: React.PropTypes.array.isRequired
  };
  close = () => {
    this.props.close();
  };
  render() {
    return (
      <Form
        items={this.props.items}
        controller={feedsModel.createAlbum}
        afterSuccessClose={this.close}
      />
    );
  }
}

class AddToAlbumOverlay extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired
  };
  state = {
    data: null,
    currentTab: 'saveToAlbum',
    saveToAlbumDisabled: false,
    disableTabs: false,
    loading: false,
    error: false
  };
  downloadInitialData = () => {
    this.request = feedsModel.getAddToAlbumForm({
      url: this.props.url
    }, (err, response) => {
      if (!this.request) {
        return;
      }
      var newState = {};
      if (err) {
        newState.error = err;
      } else {
        var curTab = response[this.state.currentTab],
          albumsList = _.findWhere(curTab.items, {name: 'album'});

        if (!_.size(albumsList.items)) {
          newState.currentTab = 'createNewAlbum';
          newState.saveToAlbumDisabled = true;
        }
        newState.data = response;
      }
      this.setState(newState);
    });
  };
  tryAgain = () => {
    this.setState({
      loading: true,
      error: false
    });
    this.downloadInitialData();
  };
  changeActiveTab = (tab) => {
    if (this.state.currentTab !== tab) {
      this.setState({
        currentTab: tab
      });
    }
  };
  disableTabs = () => {
    this.setState({
      disableTabs: true
    });
  };
  close = () => {
    EventManager.trigger('overlayClose');
  };
  componentDidMount() {
    this.downloadInitialData();
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.data !== nextState.data
      || state.error !== nextState.error
      || state.currentTab !== nextState.currentTab
      || state.disableTabs !== nextState.disableTabs;
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  render() {
    var state = this.state,
      props = this.props,
      tabContent = state.data && state.data[state.currentTab];

    if (!tabContent && !state.error) {
      return (
        <View style={ovlStyles.loader}>
          <Loading />
        </View>
      );
    } else {
      return (
        <View>
          <View style={ovlStyles.tabs}>
            {_.map(state.data, (item, key) => {
              if (key === 'saveToAlbum' && state.saveToAlbumDisabled) {
                return null;
              }

              var itemStyle = [ovlStyles.tab],
                itemTextStyle = [ovlStyles.tab_text];

              if (key === state.currentTab) {
                itemStyle.push(ovlStyles.tab_active);
                itemTextStyle.push(ovlStyles.tab_text_active);
              }
              if (state.disableTabs) {
                return (
                  <View key={key} style={itemStyle}>
                    <Text style={itemTextStyle}>{item.title}</Text>
                  </View>
                );
              } else {
                return (
                  <TouchableHighlight
                    key={key}
                    underlayColor="#DFDFDF"
                    style={itemStyle}
                    onPress={this.changeActiveTab.bind(this, key)}
                  >
                    <Text style={itemTextStyle}>{item.title}</Text>
                  </TouchableHighlight>
                );
              }
            })}
          </View>
          <View style={ovlStyles.content}>
            {state.error ?
              <View>
                <View style={ovlStyles.error}>
                  <Text style={ovlStyles.error_text}>{state.error}</Text>
                </View>
                <ButtonBlue
                  text="Try again"
                  onPress={this.tryAgain}
                />
              </View>
              : null
            }
            {!state.error && state.currentTab === 'saveToAlbum' ?
              <AddToAlbumForm
                {...tabContent}
                {...props}
                close={this.close}
                disableTabs={this.disableTabs}
              />
              : null
            }
            {!state.error && state.currentTab === 'createNewAlbum' ?
              <AddNewAlbumForm
                {...tabContent}
                {...props}
                close={this.close}
                disableTabs={this.disableTabs}
              />
              : null
            }
          </View>
        </View>
      );
    }
  }
}

class DownloadOverlay extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired
  };
  state = {
    data: null,
    error: null
  };
  downloadInitialData = () => {
    this.request = feedsModel.getDownloadLinks({
      url: this.props.url
    }, (err, response) => {
      if (!this.request) {
        return;
      }
      var newState = {};
      if (err) {
        newState.error = err;
      } else {
        newState.data = response;
      }
      this.setState(newState);
    });
  };
  tryAgain = () => {
    this.setState({
      error: null
    });
    this.downloadInitialData();
  };
  itemOnPressHandler = (url) => {
    browser.openURL(url);
  };
  close = () => {
    EventManager.trigger('overlayClose');
  };
  componentDidMount() {
    this.downloadInitialData();
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.data !== nextState.data
      || state.error !== nextState.error;
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  render() {
    var state = this.state,
      data = state.data;

    return (
      <View>
        {data ?
          <View style={ovlStyles.title}>
            <Text style={ovlStyles.title_text}>{data.title}</Text>
          </View>
          : null
        }
        <View>
          {!data && !state.error ?
            <View style={ovlStyles.loader}>
              <Loading />
            </View>
            : null
          }
          {state.error ?
            <View style={ovlStyles.content}>
              <View style={ovlStyles.error}>
                <Text style={ovlStyles.error_text}>{state.error}</Text>
              </View>
              <ButtonBlue
                text="Try again"
                onPress={this.tryAgain}
              />
            </View>
            : null
          }
          {data && !state.error ?
            <View>
              {_.map(data.links, (item, key) => {
                var icon = item.image.icon;
                switch (icon) {
                  case 'video':
                    icon = <Icon name="video-camera" style={styles.dlist_icon} />;
                    break;
                  case 'audio':
                    icon = <Icon name="headphones" style={styles.dlist_icon} />;
                    break;
                  case 'photo':
                    icon = <Icon name="picture-o" style={styles.dlist_icon} />;
                    break;
                }
                return (
                  <TouchableHighlight
                    key={key}
                    style={styles.dlist_item}
                    underlayColor="#DFDFDF"
                    onPress={this.itemOnPressHandler.bind(this, item.link.url)}
                  >
                    <View style={styles.dlist_cont}>
                      {icon}
                      <Text style={styles.dlist_text}>{item.text}</Text>
                    </View>
                  </TouchableHighlight>
                );
              })}
            </View>
            : null
          }
        </View>
      </View>
    );
  }
}

class EmbedOverlay extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired
  };
  state = {
    title: '',
    data: null,
    error: null,
    width: 768,
    defaultWidth: 768,
    height: 432,
    defaultHeight: 432,
    ratio: 1.777,
    autoplay: false,
    embed: '',
    lastMedia: '',
    embedOpacity: new Animated.Value(0),
    lastMediaOpacity: new Animated.Value(0),
    animationDuration: 200
  };
  generateIframeString = (options) => {
    var opts = options || {},
      src = opts.src,
      width = opts.width,
      height = opts.height,
      autoplay = opts.autoplay,
      str = '<iframe {props}></iframe>',
      props = {
        src: '',
        width: width,
        height: height,
        frameborder: '0',
        scrolling: 'no',
        allowfullscreen: true
      },
      propsStr = '';

    src = src
      .replace(/width\/\d+/, `width/${width}`)
      .replace(/width=\/\d+/, `width=/${width}`)
      .replace(/height\/\d+/, `height/${height}`)
      .replace(/height=\/\d+/, `height=/${height}`);

    if (autoplay) {
      src += '/autoplay/';
    }

    props.src = src;

    _.each(props, function(value, key) {
      if (_.isBoolean(value)) {
        value = key;
      } else {
        value = `${key}="${value}"`;
      }
      propsStr += `${value} `;
    });
    propsStr = propsStr.replace(/ $/, '');

    return str.replace('{props}', propsStr);
  };
  downloadInitialData = () => {
    this.request = feedsModel.getEmbeddedLinks({
      url: this.props.url
    }, (err, response) => {
      if (!this.request) {
        return;
      }
      var newState = {};
      if (err) {
        newState.error = err;
      } else {
        let width = response.items.width.value,
          height = response.items.height.value;

        _.extend(newState, {
          title: response.title,
          data: response.items,
          width: width,
          height: height,
          embed: response.items.embed && this.generateIframeString({
            src: response.items.embed.value,
            width: width,
            height: height
          }),
          lastMedia: response.items.lastMedia && this.generateIframeString({
            src: response.items.lastMedia.value,
            width: width,
            height: height
          })
        });
      }
      this.setState(newState);
    });
  };
  tryAgain = () => {
    this.setState({
      error: null
    });
    this.downloadInitialData();
  };
  updateIframeStrings = (options) => {
    var state = this.state,
      opts = options || {},
      width = opts.width || state.width,
      height = opts.height || state.height,
      autoplay = opts.autoplay !== undefined ? opts.autoplay : state.autoplay;

    this.setState({
      width: width,
      height: height,
      autoplay,
      embed: state.data.embed && this.generateIframeString({
        src: state.data.embed.value,
        width: width,
        height: height,
        autoplay
      }),
      lastMedia: state.data.lastMedia && this.generateIframeString({
        src: state.data.lastMedia.value,
        width: width,
        height: height,
        autoplay
      })
    });
  };
  widthChangedHandler = (value) => {
    var state = this.state,
      width = parseInt(value),
      height;

    if (!width) {
      width = state.defaultWidth;
    }
    height = Math.round(width / state.ratio);

    this.updateIframeStrings({
      width: String(width),
      height: String(height)
    });
  };
  heightChangedHandler = (value) => {
    var state = this.state,
      width,
      height = parseInt(value);

    if (!height) {
      height = state.defaultHeight;
    }
    width = Math.round(height * state.ratio);

    this.updateIframeStrings({
      width: String(width),
      height: String(height)
    });
  };
  playAutoHandler = () => {
    this.updateIframeStrings({
      autoplay: !this.state.autoplay
    });
  };
  embedTimer;
  lastMediaTimer;
  messageShow = (type) => {
    var state = this.state;
    clearTimeout(this[`${type}Timer`]);
    Animated.timing(state[`${type}Opacity`], {
      toValue: 1,
      duration: state.animationDuration
    }).start(() => {
      this[`${type}Timer`] = setTimeout(() => {
        this.messageHide(type);
      }, 1000);
    });
  };
  messageHide = (type) => {
    var state = this.state;
    Animated.timing(state[`${type}Opacity`], {
      toValue: 0,
      duration: state.animationDuration
    }).start();
  };
  copyToClipboard = (type) => {
    var state = this.state,
      options = {
        width: state.width,
        height: state.height,
        autoplay: state.autoplay
      };

    if (type === 'embed') {
      options.src = state.data.embed.value;
    } else {
      options.src = state.data.lastMedia.value;
    }
    Clipboard.setString(this.generateIframeString(options));
    this.messageShow(type);
  };
  close = () => {
    EventManager.trigger('overlayClose');
  };
  componentDidMount() {
    this.downloadInitialData();
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.data !== nextState.data
      || state.error !== nextState.error
      || state.autoplay !== nextState.autoplay
      || state.embed !== nextState.embed
      || state.lastMedia !== nextState.lastMedia;
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  render() {
    var state = this.state,
      data = state.data,
      clipBoardButtons = [],
      placeholderColor = device.isAndroid() ? '#666' : '#999';

    if (state.embed) {
      clipBoardButtons.push({
        id: 'embed',
        value: state.embed
      });
    }
    if (state.lastMedia) {
      clipBoardButtons.push({
        id: 'lastMedia',
        value: state.lastMedia
      });
    }

    return (
      <View>
        {data ?
          <View style={ovlStyles.title}>
            <Text style={ovlStyles.title_text}>{state.title}</Text>
          </View>
          : null
        }
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
              <ButtonBlue
                text="Try again"
                onPress={this.tryAgain}
              />
            </View>
            : null
          }
          {data && !state.error ?
            <View>
              <View style={styles.embed_fields_wrap}>
                <TextInput
                  defaultValue={state.width}
                  placeholder={data.width.placeholder}
                  placeholderTextColor={placeholderColor}
                  style={styles.embed_field}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onChangeText={this.widthChangedHandler}
                />
                <View style={styles.embed_fields_separator}>
                  <Text style={styles.embed_fields_separator_text}>X</Text>
                </View>
                <TextInput
                  defaultValue={state.height}
                  placeholder={data.height.placeholder}
                  placeholderTextColor={placeholderColor}
                  style={styles.embed_field}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onChangeText={this.heightChangedHandler}
                />
              </View>
              <TouchableHighlight
                style={styles.switcher_wrap}
                onPress={this.playAutoHandler}
                underlayColor="#FFF"
              >
                <View style={styles.switcher_cont}>
                  <Switch value={state.autoplay} onValueChange={this.playAutoHandler} />
                  <Text style={styles.switcher_text}>{data.playAuto.placeholder}</Text>
                </View>
              </TouchableHighlight>
              {_.map(clipBoardButtons, (item) => {
                var messageStyle = [
                  styles.clipboard_message,
                  {opacity: state[`${item.id}Opacity`]}
                ];
                return (
                  <TouchableOpacity key={item.id} onPress={this.copyToClipboard.bind(null, item.id)}>
                    <View style={styles.embedded}>
                      <Text style={styles.embedded_text}>{item.value}</Text>
                    </View>
                    <Icon name="clipboard" style={styles.clipboard_icon} />
                    <Animated.View style={messageStyle}>
                      <Text style={styles.clipboard_message_text}>Copied to clipboard</Text>
                    </Animated.View>
                  </TouchableOpacity>
                );
              })}
            </View>
            : null
          }
        </View>
      </View>
    );
  }
}

class PreviewManagerMenu extends Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    id: React.PropTypes.string,
    type: React.PropTypes.string
  };
  state = {
    menuItems: null
  };
  getMenuItem(items, name) {
    var targetItem;
    _.each(items, function(item) {
      if (item.image.icon === name) {
        targetItem = item;
      }
    });
    return targetItem;
  }
  addToAlbumHandler = async (url) => {
    if (await account.isAuthorized()) {
      let props = this.props;
      EventManager.trigger('overlayOpen', {
        content: (
          <AddToAlbumOverlay
            url={url}
            id={props.id}
            type={props.type}
          />
        )
      });
    } else {
      EventManager.trigger('sideMenuOpen', {
        content: <Login />
      });
      EventManager.trigger('tooltipMenuClose');
    }
  };
  reportAbuseHandler = (url) => {
    var props = this.props;
    EventManager.trigger('overlayOpen', {
      content: (
        <Report
          url={url}
          id={props.id}
          type={props.type}
        />
      )
    });
  };
  downloadHandler = async (url) => {
    if (await account.isAuthorized()) {
      let props = this.props;
      EventManager.trigger('overlayOpen', {
        content: (
          <DownloadOverlay
            url={url}
            id={props.id}
            type={props.type}
          />
        )
      });
    } else {
      EventManager.trigger('sideMenuOpen', {
        content: <Login />
      });
      EventManager.trigger('tooltipMenuClose');
    }
  };
  embedHandler = (url) => {
    EventManager.trigger('overlayOpen', {
      content: (
        <EmbedOverlay
          url={url}
        />
      )
    });
  };
  menuSelectedHandler = (data) => {
    var type = data.image.icon,
      url = data.link.url;

    switch (type) {
      case 'album-add':
        return this.addToAlbumHandler(url);
      case 'complaint':
        return this.reportAbuseHandler(url);
      case 'download':
        return this.downloadHandler(url);
      case 'embed':
        return this.embedHandler(url);
    }
  };
  openMenu = () => {
    var menuItems = _.compact(this.state.menuItems);
    var menuContent = (
      <View>
        {_.map(menuItems, (item, key) => {
          return (
            <TouchableHighlight
              key={key}
              underlayColor="#3d3d3d"
              onPress={this.menuSelectedHandler.bind(null, item)}
            >
              <View style={styles.dropdown_item}>
                <Text style={styles.dropdown_item_text}>{item.text}</Text>
              </View>
            </TouchableHighlight>
          );
        })}
      </View>
    );
    EventManager.trigger('tooltipMenuOpen', {
      content: menuContent,
      anchorEl: this.refs.button,
      direction: 'right',
      marginTop: 0,
      marginRight: 3
    });
  };
  getMenuItems = (items) => {
    this.setState({
      menuItems: [
        this.getMenuItem(items, 'album-add'), // Add to album
        this.getMenuItem(items, 'embed'), // Embedded link
        this.getMenuItem(items, 'download'), // Download
        this.getMenuItem(items, 'complaint') // Report abuse
      ]
    });
  };
  componentWillMount() {
    this.getMenuItems(this.props.items);
  }
  componentWillReceiveProps(nextProps) {
    this.getMenuItems(nextProps.items);
  }
  render() {
    return (
      <TouchableOpacity
        ref="button"
        onPress={this.openMenu}
        style={styles.button}
      >
        <Icon name="ellipsis-v" style={styles.button_icon} />
      </TouchableOpacity>
    );
  }
}

export default PreviewManagerMenu;
