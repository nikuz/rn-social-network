'use strict';

import React, { Component } from 'react';
import {
  StatusBar
} from 'react-native';
import * as EventManager from '../../modules/events';

const backgroundColor = '#c0bebe';

class StatusBarComponent extends Component {
  state = {
    hidden: false,
    backgroundColor
  };
  show = () => {
    this.setState({
      hidden: false
    });
  };
  hide = () => {
    this.setState({
      hidden: true
    });
  };
  makeTransparent = () => {
    this.setState({
      backgroundColor: 'transparent'
    });
  };
  restoreBackground = () => {
    this.setState({
      backgroundColor
    });
  };
  componentDidMount() {
    EventManager.on('videoOpen', this.makeTransparent);
    EventManager.on('videoClose', this.restoreBackground);
    EventManager.on('galleryOpen', this.makeTransparent);
    EventManager.on('galleryClose', this.restoreBackground);
    EventManager.on('statusBarShow', this.show);
    EventManager.on('statusBarHide', this.hide);
  }
  componentWillUnmount() {
    EventManager.off('videoOpen', this.makeTransparent);
    EventManager.off('videoClose', this.restoreBackground);
    EventManager.off('galleryOpen', this.makeTransparent);
    EventManager.off('galleryClose', this.restoreBackground);
    EventManager.off('statusBarShow', this.show);
    EventManager.off('statusBarHide', this.hide);
  }
  render() {
    var state = this.state;
    return (
      <StatusBar
        backgroundColor={state.backgroundColor} // it's for Android, for iOS see the /views/header/code.js -> ios_statusbar_bg
        barStyle="light-content" // text color for iOS
        translucent={true}
        hidden={state.hidden}
        animated={true}
      />
    );
  }
}

export default StatusBarComponent;
