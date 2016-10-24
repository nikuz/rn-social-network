'use strict';

import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  Modal,
  BackAndroid
} from 'react-native';
import * as EventManager from '../../modules/events';
import KeyboardAwareScrollView from '../keyboard-aware-scroll-view/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';

class Overlay extends Component {
  static propTypes = {
    closeIcon: React.PropTypes.bool,
    afterClose: React.PropTypes.func.isRequired,
    close: React.PropTypes.bool,
    content: React.PropTypes.any.isRequired
  };
  state = {
    visible: true,
    orientation: null,
    closeIcon: true
  };
  open = () => {
    this.setState({
      visible: true
    });
  };
  close = () => {
    this.setState({
      visible: false
    });
    this.props.afterClose();
  };
  closeHandler = () => {
    EventManager.trigger('overlayClose');
    return true;
  };
  componentWillMount() {
    var props = this.props;
    this.setState({
      closeIcon: props.closeIcon !== undefined ? props.closeIcon : true
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.close) {
      this.close();
    } else {
      this.open();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.visible !== nextState.visible;
  }
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.closeHandler);
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.closeHandler);
  }
  render() {
    var state = this.state;
    return (
      <Modal
        animated={true}
        transparent={true}
        visible={state.visible}
        onRequestClose={this.close}
      >
        <View style={styles.wrap}>
          <TouchableOpacity style={styles.touch_area} onPress={this.closeHandler} />
          <KeyboardAwareScrollView adjustOnAndroid={true}>
            <View style={styles.content}>
              {this.props.content}
              {state.closeIcon ?
                <TouchableOpacity style={styles.close} onPress={this.closeHandler}>
                  <Icon style={styles.close_icon} name="times-circle"/>
                </TouchableOpacity>
                : null
              }
            </View>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    );
  }
}

export default Overlay;
