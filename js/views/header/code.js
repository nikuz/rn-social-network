'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import * as _ from 'underscore';
import * as account from '../../modules/account';
import * as EventManager from '../../modules/events';
import Language from '../language/code';
import Login from '../login/code';
import Menu from '../menu/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';

import logo from '../../../images/logo.png';

class Header extends Component {
  static propTypes = {
    resetPagesStack: React.PropTypes.func.isRequired,
    language: React.PropTypes.object,
    menu: React.PropTypes.object,
    username: React.PropTypes.object
  };
  state = {
    user: null
  };
  openMainPage = () => {
    this.props.resetPagesStack({
      page: 'feeds',
      title: ''
    });
  };
  contactsOpen = (text) => {
    this.props.resetPagesStack({
      page: 'contacts',
      title: text,
      data: {
        immediatelyDataLoading: true
      }
    });
  };
  userOpen = () => {
    var user = this.state.user;
    this.props.resetPagesStack({
      page: 'user',
      title: user.text,
      data: {
        user: user.link.url.replace('/user/', ''),
        text: user.text,
        immediatelyDataLoading: true
      }
    });
  };
  openSideMenu = (component) => {
    EventManager.trigger('sideMenuOpen', {
      content: component
    });
  };
  closeSideMenu = () => {
    EventManager.trigger('sideMenuClose');
  };
  resetPagesStackByMenu = (options) => {
    this.props.resetPagesStack(options);
    this.closeSideMenu();
  };
  openLanguage = () => {
    this.openSideMenu(
      <Language
        title={this.props.language.text}
        onSelect={this.languageSelectedHandler}
      />
    );
  };
  languageSelectedHandler = () => {
    this.closeSideMenu();
    EventManager.trigger('languageSelected');
  };
  searchPressHandler = () => {
    this.props.resetPagesStack({
      page: 'search',
      title: 'Search'
    });
  };
  menuPressHandler = async () => {
    if (await account.isAuthorized()) {
      this.openSideMenu(
        <Menu
          title={this.props.menu.text}
          resetPagesStack={this.resetPagesStackByMenu}
        />
      );
    } else {
      this.openSideMenu(
        <Login />
      );
    }
  };
  accountAuthorizedHandler = (options) => {
    var opts = options || {};
    this.closeSideMenu();
    this.setState({
      user: opts.username
    });
  };
  accountUnauthorizedHandler = () => {
    this.closeSideMenu();
    this.setState({
      user: null
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.user !== nextState.user
      || this.state.menu !== nextState.menu;
  }
  componentWillMount() {
    this.setState({
      user: this.props.username
    });
  }
  componentDidMount() {
    EventManager.on('accountAuthorized', this.accountAuthorizedHandler);
    EventManager.on('accountRegistered', this.accountAuthorizedHandler);
    EventManager.on('accountUnauthorized', this.accountUnauthorizedHandler);
  }
  componentWillUnmount() {
    EventManager.off('accountAuthorized', this.accountAuthorizedHandler);
    EventManager.off('accountRegistered', this.accountAuthorizedHandler);
    EventManager.off('accountUnauthorized', this.accountUnauthorizedHandler);
  }
  render() {
    var props = this.props,
      user = this.state.user,
      contact;

    if (!user) {
      _.each(props.menu.items, function(item) {
        if (item.image && item.image.icon === 'contact') {
          contact = item;
        }
      });
    }
    return (
      <View style={styles.header}>
        <View style={styles.ios_statusbar_bg} />
        <View style={styles.content}>
          <TouchableOpacity onPress={this.openMainPage}>
            <Image source={logo} style={styles.logo} />
          </TouchableOpacity>
          <View style={styles.links}>
            <TouchableOpacity onPress={this.openLanguage}>
              <View style={styles.content_item}>
                <Image
                  source={{uri: props.language.image.src[0].url}}
                  style={styles.content_item_icon}
                />
                <Text style={styles.link}>
                  {props.language.text}
                </Text>
              </View>
            </TouchableOpacity>
            {user ?
              <TouchableOpacity onPress={this.userOpen}>
                <View style={styles.content_item}>
                  {user.image.src ?
                    <Image
                      source={{uri: user.image.src[0].url}}
                      style={styles.content_item_icon}
                    />
                    : null
                  }
                  <Text style={styles.link}>{user.text}</Text>
                </View>
              </TouchableOpacity>
              : null
            }
            {contact ?
              <TouchableOpacity onPress={this.contactsOpen.bind(null, contact.text)}>
                <View style={styles.content_item}>
                  <Icon style={styles.icon} name="phone" />
                  <Text style={styles.link}>{contact.text}</Text>
                </View>
              </TouchableOpacity>
              : null
            }
          </View>
          <View style={styles.icons}>
            <TouchableOpacity style={styles.icon_wrap} onPress={this.searchPressHandler}>
              <Icon style={styles.icon} name="search" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon_wrap} onPress={this.menuPressHandler}>
              <Icon style={styles.icon} name="bars" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Header;
