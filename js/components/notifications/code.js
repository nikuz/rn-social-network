'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';

class Notification extends Component {
  static propTypes = {
    error: React.PropTypes.bool,
    onPress: React.PropTypes.func.isRequired,
    text: React.PropTypes.string.isRequired
  };
  render() {
    var props = this.props;
    return (
      <View style={[styles.wrap, props.error ? styles.wrap_error : null]}>
        <TouchableOpacity style={styles.close} onPress={props.onPress}>
          <Icon style={[styles.close_text, props.error ? styles.close_text_error : null]} name="times" />
        </TouchableOpacity>
        <Text style={[styles.text, props.error ? styles.text_error : null]}>{props.text}</Text>
      </View>
    );
  }
}

class SuccessNote extends Component {
  render() {
    return <Notification {...this.props} />;
  }
}

class ErrorNote extends Component {
  render() {
    return <Notification {...this.props} error={true} />;
  }
}

export {
  SuccessNote,
  ErrorNote
};
