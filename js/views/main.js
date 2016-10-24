'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  Navigator
} from 'react-native';
import * as _ from 'underscore';
import * as EventManager from '../modules/events';
import * as StateManager from '../modules/states';
import * as settings from '../modules/settings';
import * as device from '../modules/device';
import * as account from '../modules/account';
import * as InteractionManager from '../modules/interactions';
import * as navigatorHelpers from '../modules/navigator';
import Loading from './../components/loading/code';
import NavigatorBar from './../components/navigator-bar/code';
// pages
import OverlaysManager from './../views/overlays-manager/code';
import Header from './header/code';
import Feeds from './feeds/code';
import Search from './search/code';
import PostView from './feeds/preview/code';
import PostViewBlank from './feeds/preview-blank/code';
import Contacts from './contacts/code';
import UploadsList from './uploads/list/code';
import Account from './account/code';
import Upload from './uploads/code';
import Registration from './registration/code';
import Notifications from './notifications/code';
import Relations from './relations/code';
import Messages from './messages/code';
import Messenger from './messenger/code';
//
import {ButtonBlue} from '../components/buttons/code';
import * as mainModel from '../models/main';
import Orientation from 'react-native-orientation';
import DeviceInfo from 'react-native-device-info';
import styles from './style';

import logo from '../../images/logo.png';

// console.disableYellowBox = true;

class Main extends Component {
  state = {
    loading: true,
    data: null,
    error: null,
    page: 'feeds',
    menuWidth: 0,
    menuIsOpened: false,
    menuContent: null,
    animationDuration: 200,
    animLeft: new Animated.Value(0)
  };
  resetPagesStack = (options) => {
    var opts = options || {};
    if (this.state.page !== opts.page) {
      this.setState({
        page: opts.page
      });
      this.refs.navigator.resetTo({
        title: navigatorHelpers.titlePrepare(opts.title),
        id: opts.page,
        data: opts.data
      });
    }
  };
  downloadInitialData = async () => {
    this.setState({
      loading: true,
      error: false,
      page: 'feeds'
    });

    var settingsData = await settings.get();

    mainModel.getInitialData({
      language: settingsData.language && settingsData.language.id,
      type: settingsData.feeds.id
    }, async (err, response) => {
      var state = {
        loading: false
      };
      if (err) {
        state.error = err;
      } else {
        // authorization was out of date
        if (!response.default.query.identification && await account.isAuthorized()) {
          account.logout();
        }
        if (!settingsData.language) {
          let curLanguage;
          _.each(response.languages, (item) => {
            if (item.code === DeviceInfo.getDeviceLocale().substring(0, 2)) {
              curLanguage = item;
            }
          });
          let languageOpts;
          if (curLanguage) {
            languageOpts = {
              id: curLanguage.link.params.language,
              value: curLanguage.text,
              icon: curLanguage.image.src[0].url
            };
          } else {
            languageOpts = {
              id: '5Pe8JqC4DXG',
              value: 'English',
              icon: 'https://api.application.com'
            };
          }
          await settings.set('language', languageOpts);
          return this.downloadInitialData();
        } else {
          state.data = response;
        }
      }
      this.setState(state);
    });
  };
  languageSelectedHandler = () => {
    InteractionManager.runAfterInteractions(() => {
      this.downloadInitialData();
    });
  };
  registrationTriggered = (options) => {
    var opts = options || {};
    InteractionManager.runAfterInteractions(() => {
      this.resetPagesStack({
        title: opts.title,
        page: 'registration'
      });
    });
    this.closeMenuHandler();
  };
  accountAuthorized = () => {
    if (this.state.page === 'registration') {
      InteractionManager.runAfterInteractions(() => {
        this.resetPagesStack({
          title: '',
          page: 'feeds'
        });
      });
    }
  };
  resetDuration = () => {
    this.setState({
      animationDuration: 200
    });
  };
  setMenuWidth = () => {
    Orientation.getOrientation((err, orientation) => {
      orientation = device.orientation(orientation);
      var dimensions = device.dimensions(),
        screenWidth = dimensions.width,
        width;

      if (device.isTablet()) {
        if (orientation === 'portrait') {
          width = Math.round(screenWidth / 4 * 2); // two fourth
        } else {
          width = Math.round(screenWidth / 3); // one third
        }
      } else {
        if (orientation === 'portrait') {
          width = Math.round(screenWidth / 4 * 3); // three fourth
        } else {
          width = Math.round(screenWidth / 4 * 2); // two fourth
        }
      }

      this.setState({
        menuWidth: width
      });
    });
  };
  openMenuHandler = () => {
    var state = this.state;
    Animated.timing(state.animLeft, {
      toValue: state.menuWidth,
      duration: state.animationDuration
    }).start(() => {
      InteractionManager.clearInteractionHandle();
      this.resetDuration();
      if (!state.menuIsOpened) {
        this.setState({
          menuIsOpened: true
        });
      }
    });
  };
  closeMenuHandler = () => {
    var state = this.state;
    Animated.timing(state.animLeft, {
      toValue: 0,
      duration: state.animationDuration
    }).start(() => {
      InteractionManager.clearInteractionHandle();
      this.resetDuration();
      this.setState({
        menuIsOpened: false,
        menuContent: null
      });
    });
  };
  menuContentUpdateHandler = (options) => {
    var opts = options || {};
    this.setState({
      menuContent: opts.content
    });
    this.openMenuHandler();
  };
  prevLeftShift;
  currentLeftShift;
  onMove = (evt, gestureState) => {
    var state = this.state,
      x = Math.round(gestureState.dx);

    if (this.currentLeftShift) {
      this.prevLeftShift = this.currentLeftShift;
    }
    this.currentLeftShift = x;

    if (x < 0 && state.menuIsOpened) {
      let leftShift = state.menuWidth - Math.abs(x);
      if (leftShift < 0) {
        leftShift /= 5;
      }
      state.animLeft.setValue(leftShift);
    }
  };
  onMoveEnd = () => {
    var state = this.state,
      isFastProcessing = Math.abs(this.currentLeftShift - this.prevLeftShift) > 10;

    if (state.menuIsOpened) {
      let animLeftValue = state.animLeft._value;
      if (isFastProcessing) {
        this.setState({
          animationDuration: 80
        });
      }
      if (animLeftValue < state.menuWidth && animLeftValue < state.menuWidth - 30) {
        this.closeMenuHandler();
      } else {
        this.openMenuHandler();
      }
    }
  };
  routingMap = {
    feeds: Feeds,
    hashtag: Feeds,
    user: Feeds,
    post_view: PostView,
    post_view_blank: PostViewBlank,
    search: Search,
    extended_search: Feeds,
    queues: UploadsList,
    contacts: Contacts,
    account: Account,
    upload: Upload,
    history: Feeds,
    registration: Registration,
    notifications: Notifications,
    relations: Relations,
    messages: Messages,
    messenger: Messenger
  };
  renderScene = (route, navigator) => {
    var Component = this.routingMap[route.id];
    return (
      <Component
        id={route.id}
        {...route.data}
        navigator={navigator}
        navigatorResetPagesStack={this.resetPagesStack}
      />
    );
  };
  _panResponder = null;
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return this.state.menuIsOpened && Math.round(gestureState.dx) < 0;
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
      onPanResponderMove: this.onMove,
      onPanResponderRelease: this.onMoveEnd,
      onPanResponderTerminate: this.onMoveEnd
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    if (state.menuIsOpened && state.menuWidth !== nextState.menuWidth) {
      state.animLeft.setValue(nextState.menuWidth);
    }
    return state.loading !== nextState.loading
      || state.data !== nextState.data
      || state.shouldMenuClose !== nextState.shouldMenuClose
      || state.shouldMenuOpen !== nextState.shouldMenuOpen
      || state.menuContent !== nextState.menuContent
      || state.menuIsOpened !== nextState.menuIsOpened
      || (state.menuWidth !== nextState.menuWidth && state.menuIsOpened);
  }
  componentDidMount() {
    Orientation.unlockAllOrientations();
    StateManager.init();
    this.downloadInitialData();
    this.setMenuWidth();
    Orientation.addOrientationListener(this.setMenuWidth);
    EventManager.on('sideMenuOpen', this.menuContentUpdateHandler);
    EventManager.on('sideMenuClose', this.closeMenuHandler);
    EventManager.on('languageSelected', this.languageSelectedHandler);
    EventManager.on('registrationTriggered', this.registrationTriggered);
    EventManager.on('accountAuthorized', this.accountAuthorized);
  }
  componentWillUnmount() {
    Orientation.removeOrientationListener(this.setMenuWidth);
    EventManager.off('sideMenuOpen', this.menuContentUpdateHandler);
    EventManager.off('sideMenuClose', this.closeMenuHandler);
    EventManager.off('languageSelected', this.languageSelectedHandler);
    EventManager.off('accountAuthorized', this.accountAuthorized);
  }
  render() {
    var state = this.state;
    if (state.loading) {
      return (
        <View style={styles.loader_wrap}>
          <View style={styles.loader_cont}>
            <Image source={logo} />
            <Loading size="large" style={styles.loader} />
          </View>
        </View>
      );
    } else if (state.error) {
      return (
        <View style={styles.error_wrap}>
          <View style={styles.error_cont}>
            <Image source={logo} />
            <Text style={styles.error_text}>Data load error occurred</Text>
            <ButtonBlue
              text="Try again"
              onPress={this.downloadInitialData}
            />
          </View>
        </View>
      );
    } else {
      let contentStyle = [
        styles.content,
        {left: state.animLeft}
      ];
      let menuStyle = [
        styles.side_menu,
        {width: state.menuWidth}
      ];
      let blockerStyle = [
        styles.blocker,
        {left: state.menuWidth}
      ];
      let initialRoute = {
        id: 'feeds',
        initial: true,
        title: '',
        type: state.type
      };
      return (
        <View style={styles.container} {...this._panResponder.panHandlers}>
          <View style={menuStyle}>
            {state.menuContent}
          </View>
          <Animated.View style={contentStyle}>
            <Header
              {...state.data.head}
              resetPagesStack={this.resetPagesStack}
            />
            <Navigator
              ref="navigator"
              initialRoute={initialRoute}
              renderScene={this.renderScene}
              navigationBar={
                <NavigatorBar route={initialRoute} />
              }
              style={styles.navigator}
            />
            <OverlaysManager />
          </Animated.View>
          {state.menuIsOpened ?
            <TouchableOpacity
              style={blockerStyle}
              onPress={this.closeMenuHandler}
            />
            : null
          }
        </View>
      );
    }
  }
}

export default Main;
