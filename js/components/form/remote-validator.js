'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput
} from 'react-native';
import * as _ from 'underscore';
import * as device from '../../modules/device';
import * as ajax from '../../modules/ajax';
import * as formsHelpers from '../../modules/forms';
import Loading from '../loading/code';
import styles from './style';

class RemoteValidator extends Component {
  static propTypes = {
    map: React.PropTypes.object.isRequired,
    'validation-server': React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string,
    text: React.PropTypes.string,
    scrollToField: React.PropTypes.func,
    onChangeText: React.PropTypes.func
  };
  state = {
    value: '',
    loading: false,
    error: null,
    warning: null
  };
  request;
  onFocus = () => {
    formsHelpers.refreshStyle({
      field: this.refs.field
    });
    this.props.scrollToField && this.props.scrollToField(this.refs.field);
  };
  value = '';
  onChangeText = (value) => {
    var state = this.state,
      props = this.props;

    this.setState({
      value: value
    });
    props.onChangeText(props, value);
    if (value.length < 3) {
      if (state.error || state.warning) {
        this.setState({
          error: null,
          warning: null
        });
      }
      return;
    }

    this.setState({
      loading: true
    });
    if (this.request) {
      ajax.abort(this.request);
    }

    this.request = props.map[props['validation-server']]({
      value
    }, (err, response) => {
      if (!this.request) {
        return;
      }
      var newState = {
        loading: false,
        error: null,
        warning: null
      };
      if (err) {
        newState.error = err;
      } else if (response && response.warning) {
        newState.warning = response.warning;
      }
      this.setState(newState);
    });
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
  componentWillMount() {
    this.setState({
      value: this.props.defaultValue || this.props.text
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.error !== nextState.error
      || this.state.warning !== nextState.warning;
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  render() {
    var state = this.state,
      props = this.props,
      doNotBeautify = props.name.includes('email')
        || props.name.includes('antibot')
        || props.name.includes('website')
        || props.name.includes('username')
        || props.name.includes('link'),
      keyboardType = props.name.includes('email') || props.name.includes('username')
        ? 'email-address'
        : props.name.includes('website') || props.name.includes('link') ? 'url' : 'default';

    return (
      <View>
        <TextInput
          ref="field"
          secureTextEntry={props.type === 'password'}
          defaultValue={state.value}
          autoCorrect={!doNotBeautify}
          autoCapitalize={doNotBeautify ? 'none' : 'sentences'}
          placeholder={props.placeholder}
          placeholderTextColor={device.isAndroid() ? '#666' : '#999'}
          editable={!state.loading}
          style={styles.field}
          onFocus={this.onFocus}
          onChangeText={this.onChangeText}
          scrollToField={props.scrollToField}
          keyboardType={keyboardType}
          returnKeyType="next"
        />
        {state.loading ?
          <View style={styles.field_loading}>
            <Loading size="small" />
          </View>
          : null
        }
        {state.warning ?
          <View style={[styles.field_error, styles.field_warning]}>
            <Text style={styles.field_warning_text}>{state.warning}</Text>
          </View>
          : null
        }
        {state.error ?
          <View style={styles.field_error}>
            <Text style={styles.field_error_text}>{state.error}</Text>
          </View>
          : null
        }
      </View>
    );
  }
}

export default RemoteValidator;
