'use strict';

import React, { Component } from 'react';
import {
  Navigator,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  BackAndroid
} from 'react-native';
import * as _ from 'underscore';
import * as device from '../../modules/device';
import * as navigatorHelpers from '../../modules/navigator';
import * as EventManager from '../../modules/events';
import * as StateManager from '../../modules/states';
import * as InteractionManager from '../../modules/interactions';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';

class NavigatorBar extends Component {
  static propTypes = {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object.isRequired
  };
  state = {
    leftButton: null,
    prevLeftButton: null,
    menuItems: null,
    title: null,
    prevTitle: null,
    rightButton: null,
    prevRightButton: null,
    transitionDirection: null,
    animShiftHide: new Animated.Value(0),
    animShiftShow: null,
    animOpacityHide: new Animated.Value(1),
    animOpacityShow: new Animated.Value(0),
    shiftValue: 50,
    animDuration: 400
  };
  back = () => {
    var appState = StateManager.get(),
      notAllowedStates = [
        'video-full-screen',
        'photo-gallery-opened',
        'overlay-opened',
        'tooltip-menu-opened'
      ];

    if (this.state.leftButton && !_.some(notAllowedStates, (item) => item === appState)) {
      this.props.navigator.pop();
      return true;
    }
  };
  leftButtonRender = (route) => {
    if (route.backButton) {
      return (
        <TouchableOpacity style={styles.left_button} onPress={this.back}>
          <Icon name="arrow-left" style={styles.left_button_icon} />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };
  menuItemSelectHandler = (item) => {
    var state = this.state,
      menuItems = state.menuItems;

    _.each(menuItems.items, function(menuItem) {
      menuItem.current = menuItem.text === item.text;
    });

    if (menuItems.menuItemOnPress) {
      InteractionManager.runAfterInteractions(() => {
        menuItems.menuItemOnPress(item);
      });
    }
    EventManager.trigger('tooltipMenuClose');
    this.setState({
      title: this.titleWithMenuRender(menuItems)
    });
  };
  update = (options) => {
    var opts = options || {},
      newState = {},
      curRoute;

    if (opts.menuItems || !_.isUndefined(opts.rightButton)) {
      curRoute = navigatorHelpers.getCurRoute(this.props.navigator);
      if (!curRoute.data) {
        curRoute.data = {};
      }
    }
    if (opts.menuItems) {
      curRoute.data.menuItems = opts.menuItems;
      _.extend(newState, {
        menuItems: opts.menuItems,
        title: this.titleWithMenuRender(opts.menuItems)
      });
    }
    if (!_.isUndefined(opts.rightButton)) {
      newState.rightButton = this.rightButtonRender(opts);
      curRoute.rightButton = newState.rightButton;
    }
    if (opts.title) {
      newState.title = this.titleRender(opts);
    }
    this.setState(newState);
  };
  menuOpenHandler = () => {
    var state = this.state,
      menuItems = state.menuItems.items,
      menuContent,
      curMenuItem;

    _.each(menuItems, function(item) {
      if (item.current) {
        curMenuItem = item;
      }
    });
    if (!curMenuItem) {
      curMenuItem = menuItems[0];
    }

    menuContent = (
      <View>
        {_.map(menuItems, (item, key) => {
          return (
            <TouchableHighlight
              key={key}
              underlayColor="#3d3d3d"
              onPress={this.menuItemSelectHandler.bind(this, item)}
            >
              <View style={styles.dropdown_menu_item}>
                <Text style={styles.dropdown_menu_item_text}>{item.text}</Text>
                {item === curMenuItem ?
                  <Icon style={styles.dropdown_menu_cur_icon} name="check" />
                  : null
                }
              </View>
            </TouchableHighlight>
          );
        })}
      </View>
    );

    EventManager.trigger('tooltipMenuOpen', {
      content: menuContent,
      anchorEl: this.navBarTitle,
      marginTop: 5
    });
  };
  navBarTitle;
  titleOnLayoutHandler(e) {}; // do not delete, needed for correct work of title.measure on Android
  titleWithMenuRender = (menuItems) => {
    let curMenuItem;
    _.each(menuItems.items, function(item) {
      if (item.current) {
        curMenuItem = item;
      }
    });
    if (!curMenuItem) {
      curMenuItem = menuItems.items[0];
    }

    return (
      <TouchableOpacity
        onPress={this.menuOpenHandler}
        style={styles.title}
        onLayout={this.titleOnLayoutHandler}
        ref={component => this.navBarTitle = component}
      >
        <Text>
          <Text style={styles.title_text}>{curMenuItem.text}</Text>
          <Text>&nbsp;</Text>
          <Icon name="caret-down" style={styles.menu_icon} />
        </Text>
      </TouchableOpacity>
    );
  };
  titleRender = (route) => {
    if (route.data && route.data.menuItems) {
      return this.titleWithMenuRender(route.data.menuItems);
    } else {
      let title = navigatorHelpers.titlePrepare(route.title);
      return (
        <View style={styles.title}>
          <Text style={styles.title_text}>{title}</Text>
        </View>
      );
    }
  };
  rightButtonRender = (route) => {
    return route.rightButton || null;
  };
  handleWillFocus(route) {
    var state = this.state,
      newState = {
        menuItems: route.data && route.data.menuItems,
        leftButton: this.leftButtonRender(route),
        prevLeftButton: state.leftButton,
        title: this.titleRender(route),
        prevTitle: state.title,
        rightButton: this.rightButtonRender(route),
        prevRightButton: state.rightButton
      };

    this.setState(newState);
  }
  onAnimationStart(fromIndex, toIndex) {
    var state = this.state,
      shiftValue = state.shiftValue,
      newState = {
        animOpacityShow: new Animated.Value(0),
        animOpacityHide: new Animated.Value(1)
      };

    if (fromIndex < toIndex) {
      _.extend(newState, {
        transitionDirection: 'left',
        animShiftShow: new Animated.Value(shiftValue),
        animShiftHide: new Animated.Value(0)
      });
    } else {
      _.extend(newState, {
        transitionDirection: 'right',
        animShiftShow: new Animated.Value(-shiftValue),
        animShiftHide: new Animated.Value(0)
      });
    }
    this.setState(newState);
  }
  updateProgress(progress) {
    var state = this.state,
      shiftValue = state.shiftValue,
      curShift = shiftValue - (shiftValue * (1 - progress));

    state.animOpacityShow.setValue(progress);
    state.animOpacityHide.setValue(1 - progress);
    if (state.transitionDirection === 'left') {
      state.animShiftHide.setValue(-curShift);
      state.animShiftShow.setValue(shiftValue * (1 - progress));
    } else {
      state.animShiftHide.setValue(curShift);
      state.animShiftShow.setValue(-(shiftValue * (1 - progress)));
    }
  }
  onAnimationEnd() {
    InteractionManager.clearInteractionHandle();
    this.setState({
      transitionDirection: null,
      prevTitle: null,
      prevLeftButton: null,
      prevRightButton: null
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.transitionDirection !== nextState.transitionDirection
      || state.title !== nextState.title
      || state.rightButton !== nextState.rightButton;
  }
  componentWillMount() {
    var props = this.props;
    this.setState({
      curRoute: props.route,
      leftButton: this.leftButtonRender(props.route),
      title: this.titleRender(props.route),
      rightButton: this.rightButtonRender(props.route)
    });
  }
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.back);
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.back);
  }
  render() {
    var state = this.state,
      cont = (
        <View>
          {state.title}
          <View style={styles.left_button_container}>
            {state.leftButton}
          </View>
          <View style={styles.right_button_container}>
            {state.rightButton}
          </View>
        </View>
      ),
      contPrev,
      width;

    if (state.transitionDirection) {
      contPrev = (
        <View>
          {state.prevTitle}
          <View style={styles.left_button_container}>
            {state.prevLeftButton}
          </View>
          <View style={styles.right_button_container}>
            {state.prevRightButton}
          </View>
        </View>
      );
      width = device.dimensions().width;
    }

    return (
      <View style={styles.navbar}>
        {state.transitionDirection ?
          <View>
            <Animated.View
              style={[
                styles.navbar_animated,
                {
                  width: width,
                  left: state.animShiftHide,
                  opacity: state.animOpacityHide
                }
              ]}
              renderToHardwareTextureAndroid={true}
            >
              {contPrev}
            </Animated.View>
            <Animated.View
              style={[
                styles.navbar_animated,
                {
                  width: width,
                  left: state.animShiftShow,
                  opacity: state.animOpacityShow
                }
              ]}
              renderToHardwareTextureAndroid={true}
            >
              {cont}
            </Animated.View>
          </View>
          :
          cont
        }
      </View>
    );
  }
}

export default NavigatorBar;
