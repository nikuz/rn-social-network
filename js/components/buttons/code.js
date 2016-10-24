'use strict';

import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
  Text,
} from 'react-native';
import * as _ from 'underscore';
import Loading from '../loading/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';

class Button extends Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    stretched: React.PropTypes.bool,
    onPress: React.PropTypes.func,
    icon: React.PropTypes.string,
    text: React.PropTypes.string.isRequired,
    loadingColor: React.PropTypes.string
  };
  render() {
    var props = this.props,
      buttonStyle = [
        styles.button,
        styles[props.type]
      ];

    if (props.stretched) {
      buttonStyle.push(styles.stretched);
    }

    return (
      <View style={styles.wrap}>
        <TouchableHighlight
          style={buttonStyle}
          onPress={props.onPress}
          underlayColor={props.underlayColor}
        >
          <View style={styles.button_cont}>
            {props.icon ? <Icon name={props.icon} style={styles.icon} /> : null}
            <Text style={styles.text}>{props.text}</Text>
          </View>
        </TouchableHighlight>
        {props.loading ?
          <Loading size="small" color={props.loadingColor || '#333'} style={styles.loader} />
          : null
        }
      </View>
    );
  }
}

class ButtonGreen extends Component {
  render() {
    var props = _.extend({
      type: 'green',
      underlayColor: '#69cb3c'
    }, this.props);

    return <Button {...props} />;
  }
}

class ButtonBlue extends Component {
  render() {
    var props = _.extend({
      type: 'blue',
      underlayColor: '#0eb8f7'
    }, this.props);

    return <Button {...props} />;
  }
}

class ButtonGray extends Component {
  render() {
    var props = _.extend({
      type: 'gray',
      underlayColor: '#CCC'
    }, this.props);

    return <Button {...props} />;
  }
}

class ButtonRed extends Component {
  render() {
    var props = _.extend({
      type: 'red',
      underlayColor: '#C91032'
    }, this.props);

    return <Button {...props} />;
  }
}

export {
  ButtonGreen,
  ButtonBlue,
  ButtonGray,
  ButtonRed
};
