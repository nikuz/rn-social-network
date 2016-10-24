'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Alert
} from 'react-native';
import {
  ButtonGray,
  ButtonBlue,
  ButtonGreen,
  ButtonRed
} from '../../components/buttons/code';
import * as attachment from '../../modules/attachment';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';

class Attachment extends Component {
  static propTypes = {
    placeholder: React.PropTypes.string.isRequired,
    onFileSelected: React.PropTypes.func.isRequired,
    data: React.PropTypes.object
  };
  state = {
    attachment: null
  };
  onPress = () => {
    attachment.get({
      title: this.props.placeholder
    }, (err, response) => {
      if (err) {
        Alert.alert('Attachment error', err);
      } else if (response) {
        this.setState({
          attachment: response
        });
        this.props.onFileSelected(response, this.props);
      }
    });
  };
  removeHandler = () => {
    this.setState({
      attachment: null
    });
    this.props.onFileSelected(null, this.props);
  };
  componentWillMount() {
    if (this.props.data) {
      this.setState({
        attachment: this.props.data
      });
    }
  }
  render() {
    var state = this.state,
      props = this.props,
      Button;

    switch (props.button) {
      case 'blue':
        Button = ButtonBlue;
        break;
      case 'green':
        Button = ButtonGreen;
        break;
      case 'red':
        Button = ButtonRed;
        break;
      default:
        Button = ButtonGray;
    }

    return (
      <View style={props.style}>
        {state.attachment ?
          <View>
            <Text style={styles.title}>{props.placeholder}:</Text>
            <View>
              <TouchableHighlight
                style={styles.cont}
                underlayColor="#CCC"
                onPress={this.onPress}
              >
                <Text style={styles.name}>{state.attachment.name}</Text>
              </TouchableHighlight>
              <TouchableOpacity style={styles.remove} onPress={this.removeHandler}>
                <Icon style={styles.remove_icon} name="times-circle" />
              </TouchableOpacity>
            </View>
          </View>
          :
          <Button
            icon="paperclip"
            text={props.placeholder}
            onPress={this.onPress}
          />
        }
      </View>
    );
  }
}

export default Attachment;
