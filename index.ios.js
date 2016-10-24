'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  View
} from 'react-native';
import StatusBar from './js/components/status-bar/code';
import Main from './js/views/main';

class App extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar />
        <Main />
      </View>
    );
  }
}

AppRegistry.registerComponent('rn_social_network', () => App);