'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableHighlight,
  TextInput
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../modules/ajax';
import * as device from '../../modules/device';
import * as EventManager from '../../modules/events';
import * as formsHelpers from '../../modules/forms';
import constants from '../../modules/constants';
import Loading from '../loading/code';
import Orientation from 'react-native-orientation';
import styles from './style';

class SuggestTooltip extends Component {
  static propTypes = {
    afterClose: React.PropTypes.func.isRequired,
    anchorEl: React.PropTypes.any.isRequired,
    content: React.PropTypes.any.isRequired,
    marginTop: React.PropTypes.number,
    marginLeft: React.PropTypes.number,
    close: React.PropTypes.bool
  };
  state = {
    content: null,
    isOpen: false,
    parentWidth: 0,
    parentHeight: 0,
    parentX: 0,
    parentY: 0,
    marginTop: -5,
    marginLeft: -2,
    marginRight: -2
  };
  open = (content) => {
    this.setState({
      isOpen: true,
      content
    });
  };
  close = () => {
    this.props.afterClose();
  };
  orientationChangedHandler = () => {
    if (this.state.isOpen) {
      this.close();
    }
  };
  componentWillMount() {
    var props = this.props,
      state = this.state;

    if (!props.anchorEl) {
      return constants.REQUIRED('anchorEl');
    }

    var dimensions = device.dimensions();
    props.anchorEl.measure((ox, oy, width, height, px, py) => {
      this.setState({
        shouldOpen: true,
        content: props.content,
        anchorEl: props.anchorEl,
        parentWidth: width,
        parentHeight: height,
        parentX: px,
        parentXRight: dimensions.width - (px + width),
        parentY: py,
        marginTop: props.marginTop || state.marginTop,
        marginLeft: props.marginLeft || state.marginLeft
      });
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.content !== nextState.content;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.close) {
      this.close();
    } else {
      this.open(nextProps.content);
    }
  }
  componentDidMount() {
    Orientation.addOrientationListener(this.orientationChangedHandler);
  }
  componentWillUnmount() {
    Orientation.removeOrientationListener(this.orientationChangedHandler);
  }
  render() {
    var state = this.state,
      positionStyle = {
        top: state.parentY + state.marginTop,
        left: state.parentX + state.marginLeft,
        width: state.parentWidth
      };

    return (
      <View style={styles.wrap}>
        <TouchableOpacity style={styles.touch_area} onPress={this.close} />
        <View style={[styles.suggest, positionStyle]}>
          {this.state.content}
        </View>
      </View>
    );
  }
}

class Suggest extends Component {
  static propTypes = {
    controller: React.PropTypes.func.isRequired,
    scrollToField: React.PropTypes.func,
    onChangeText: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string,
    text: React.PropTypes.string,
    placeholder: React.PropTypes.string.isRequired
  };
  state = {
    value: '',
    data: null,
    loading: false,
    isOpened: false
  };
  request;
  downloadData = () => {
    this.setState({
      loading: true
    });
    if (this.request) {
      ajax.abort(this.request);
    }
    this.request = this.props.controller({
      value: this.value
    }, (err, response) => {
      if (!this.request) {
        return;
      }
      var newState = {
        loading: false
      };
      if (err) {
        newState.error = err;
      } else {
        newState.data = response;
      }
      this.setState(newState);
    });
  };
  showSuggest = () => {
    var data = this.state.data;
    var suggestContent = (
      <View>
        {_.map(data, (item, key) => {
          return (
            <TouchableHighlight
              key={key}
              style={styles.item}
              underlayColor="#DFDFDF"
              onPress={this.onPressItem.bind(this, item)}
            >
              <Text style={styles.item_text}>{item.value}</Text>
            </TouchableHighlight>
          );
        })}
      </View>
    );

    EventManager.trigger('suggestOpen', {
      content: suggestContent,
      anchorEl: this.refs.suggest,
      marginTop: -12
    });
  };
  onFocus = () => {
    if (this.state.data) {
      this.showSuggest();
    }
    formsHelpers.refreshStyle({
      field: this.refs.field
    });
    this.props.scrollToField && this.props.scrollToField(this.refs.field);
  };
  value = '';
  onChangeText = (value) => {
    var state = this.state,
      newState = {
        value: value
      };

    this.value = value;
    if (state.value !== this.value && this.value.length >= 3) {
      this.downloadData();
    } else if (state.value && this.value.length < 3 && state.isOpened) {
      _.extend(newState, {
        data: null,
        isOpened: false
      });
      EventManager.trigger('suggestClose');
    }
    this.setState(newState);
  };
  onPressItem = (item) => {
    this.props.onChangeText(this.props, item.id, item.value);
    this.setState({
      value: item.value
    });
    EventManager.trigger('suggestClose');
  };
  validate = () => {
    var props = this.props;
    var field = [{
      field: this.refs.field,
      name: props.name,
      type: props.name.includes('email')
        ? 'email'
        : props.name.includes('website') || props.name.includes('link') ? 'url' : null,
      value: this.state.value
    }];
    return formsHelpers.validate(field) === true;
  };
  scrollTo = () => {
    if (_.isFunction(this.props.scrollToField)) {
      this.props.scrollToField(this.refs.field);
    }
  };
  onLayout = (e) => {};
  componentWillMount() {
    this.setState({
      value: this.props.defaultValue || this.props.text
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.value !== nextState.value
      || state.data !== nextState.data
      || state.loading !== nextState.loading;
  }
  componentDidUpdate() {
    var data = this.state.data;
    if (!data || this.state.loading) {
      return;
    }
    this.setState({
      isOpened: true
    });
    this.showSuggest();
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  render() {
    var state = this.state,
      props = this.props;

    return (
      <View>
        <TextInput
          ref="field"
          defaultValue={state.value}
          placeholder={props.placeholder}
          placeholderTextColor={device.isAndroid() ? '#666' : '#999'}
          style={styles.field}
          onFocus={this.onFocus}
          onChangeText={this.onChangeText}
          returnKeyType="next"
        />
        {state.loading ? <Loading size="small" style={styles.loader} /> : null}
        <View ref="suggest" onLayout={this.onLayout} />
      </View>
    );
  }
}

export {
  SuggestTooltip,
  Suggest
};
