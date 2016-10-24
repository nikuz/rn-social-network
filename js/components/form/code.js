'use strict';

import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Switch,
  Picker
} from 'react-native';
import * as _ from 'underscore';
import * as config from '../../config';
import * as device from '../../modules/device';
import * as ajax from '../../modules/ajax';
import * as EventManager from '../../modules/events';
import * as formsHelpers from '../../modules/forms';
import * as postsHelpers from '../../modules/posts';
import {Suggest} from '../suggest/code';
import TextEditor from '../text-editor/code';
import Attachment from '../attachment/code';
import RemoteValidator from './remote-validator';
import {
  ButtonGreen,
  ButtonGray,
  ButtonRed,
  ButtonBlue
} from '../buttons/code';
import {
  Selector,
  SelectorDate
} from '../selectors/code';
import {
  SuccessNote,
  ErrorNote
} from '../notifications/code';
import styles from './style';

// <Form
//   items={[]}
//   scrollToField={() => {}}
//   scrollToTop={() => {}}
//   controller={() => {}}
//   additionalValidation={() => {}}
//   suggestController={() => {}}
//   onParagraphPress={() => {}}
//   clearAfter={true}
//   afterSuccessClose={() => {}}
//   remoteValidationMap={{}}
//   onButtonPress={() => {}}
//   loadingColor=""
//   showNativeIOSSelectors={true}
// />

class Form extends Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    scrollToField: React.PropTypes.func,
    scrollToTop: React.PropTypes.func,
    controller: React.PropTypes.func.isRequired,
    additionalValidation: React.PropTypes.func,
    suggestController: React.PropTypes.func,
    onParagraphPress: React.PropTypes.func,
    clearAfter: React.PropTypes.bool,
    afterSuccessClose: React.PropTypes.func,
    remoteValidationMap: React.PropTypes.object,
    onButtonPress: React.PropTypes.func
  };
  state = {
    loading: false,
    error: null,
    success: null
  };
  fieldOnFocus = (item) => {
    formsHelpers.refreshStyle({
      field: this.refs[item.name]
    });
    this.props.scrollToField && this.props.scrollToField(this.refs[item.name]);
  };
  onValueChange = (item, value) => {
    this.setState({
      [item.name]: value
    });
  };
  onSuggestChanged = (item, value, text) => {
    this.setState({
      [item.name]: value,
      [`${item.name}_text`]: text
    });
  };
  onSelectorChanged = (item, value) => {
    this.setState({
      [item.name]: value,
      [`${item.name}_text`]: item.items[value]
    });
  };
  onFileSelected = (file, item) => {
    this.setState({
      [item.name]: file,
      [`${item.name}_error`]: false
    });
  };
  onSwitcherPress = (item) => {
    this.setState({
      [item.name]: !this.state[item.name]
    });
  };
  imageShow = (item) => {
    var image = postsHelpers.getImage(item.image.src, postsHelpers.getRatioIndex());
    EventManager.trigger('galleryOpen', {
      photo: image,
      cover: image,
      title: item.placeholder
    });
  };
  errorCloseHandler = () => {
    this.setState({
      error: false
    });
  };
  successCloseHandler = () => {
    var props = this.props;
    if (props.afterSuccessClose) {
      props.afterSuccessClose();
    } else {
      let newState = {
        success: false
      };
      if (props.clearAfter) {
        _.each(props.items, (item) => {
          if (item.name && this.state[item.name]) {
            newState[item.name] = null;
          }
        });
      }
      this.setState(newState);
    }
  };
  validate = () => {
    var state = this.state,
      validateFields = [],
      typesForValidation = [
        'text',
        'textarea',
        'password'
      ],
      scrolledToErrorField;

    _.each(this.props.items, (item) => {
      var validate = true;
      if (_.includes(typesForValidation, item.type) && item.required) {
        if (item.autocomplete || item['validation-server']) {
          validate = this.refs[item.name].validate();
          validateFields.push(validate);
        } else {
          validate = formsHelpers.validate([{
            field: this.refs[item.name],
            name: item.name,
            type: item.name.includes('email')
              ? 'email'
              : item.name.includes('website') || item.name.includes('link') ? 'url' : null,
            value: state[item.name]
          }]) === true;
          validateFields.push(validate);
        }
      } else if (item.type === 'upload' && item.required) {
        validate = state[item.name];
        if (!validate) {
          this.setState({
            [`${item.name}_error`]: true
          });
        }
        validateFields.push(validate !== null);
      } else if (item.type === 'richtext') {
        validate = this.refs[item.name].validate();
        validateFields.push(validate);
      }
      if (!validate && !scrolledToErrorField) {
        scrolledToErrorField = true;
        if (item.autocomplete || item['validation-server'] || item.type === 'richtext') {
          this.refs[item.name].scrollTo();
        } else {
          this.props.scrollToField(this.refs[item.name]);
        }
      }
    });

    return _.every(validateFields, (item) => item === true)
      && (!this.props.additionalValidation || this.props.additionalValidation(state, this.refs) === true);
  };
  request;
  submit = () => {
    var props = this.props;
    if (props.validate !== false && !this.validate()) {
      return;
    }

    var nextState = {
        loading: true
      },
      values = {};

    _.each(props.items, (item) => {
      if (item.type === 'paragraph') {
        return;
      }

      var value;
      if (item.type === 'hidden') {
        value = item.value;
      } else if (item.type === 'richtext') {
        value = this.refs[item.name].textEncode();
        nextState[item.name] = value;
      } else if (item.type === 'upload' && this.state[item.name]) {
        if (!values.files) {
          values.files = [];
        }
        values.files.push({
          name: item.name,
          uri: this.state[item.name].uri
        });
      } else if (item.type === 'checkbox') {
        if (!this.state[item.name]) {
          return;
        }
        value = this.state[item.name];
      } else if (item.type === 'submit') {
        if (item.name) {
          value = item.value;
        } else {
          return;
        }
      } else {
        value = this.state[item.name];
      }
      if (value !== undefined) {
        values[item.name] = value;
      }
    });

    this.setState(nextState);
    this.request = props.controller(values, (err, response) => {
      if (!this.request) {
        return;
      }
      var newState = {
        loading: false,
        error: false,
        success: false
      };
      if (err) {
        newState.error = err;
      } else {
        newState.success = response.texthtml;
      }
      props.submit && props.submit(err, response, values);
      this.setState(newState);
      setTimeout(() => {
        props.scrollToTop && props.scrollToTop();
      }, 100);
    });
  };
  componentWillMount() {
    var newState = {};
    _.each(this.props.items, (item) => {
      switch (item.type) {
        case 'select': {
          let value = item.value;
          if (!value) {
            value = _.keys(item.items)[0];
          }
          newState[item.name] = value;
          newState[`${item.name}_text`] = item.items[value];
          break;
        }
        case 'date':
          newState[item.name] = _.isObject(item.value) && item.value.rfc3339;
          break;
        case 'checkbox':
          newState[item.name] = item.checked === 'true' || item.checked === true;
          break;
        default:
          newState[item.name] = item.value;
      }
    });
    if (_.size(newState)) {
      this.setState(newState);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.loading !== nextState.loading
      || state.error !== nextState.error
      || state.success !== nextState.success
      || _.some(this.props.items, (item) => {
        switch (item.type) {
          case 'select':
          case 'date':
          case 'checkbox':
            return state[item.name] !== nextState[item.name];
          case 'upload':
            return state[`${item.name}_error`] !== nextState[`${item.name}_error`];
        }
      });
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  render() {
    var state = this.state,
      props = this.props,
      placeholderColor = device.isAndroid() ? '#666' : '#999';

    if (state.success) {
      return (
        <SuccessNote
          onPress={this.successCloseHandler}
          text={state.success}
        />
      );
    } else {
      let buttons = [];
      return (
        <View>
          {state.error ?
            <ErrorNote
              onPress={this.errorCloseHandler}
              text={state.error}
            />
            : null
          }
          {_.map(props.items, (item, key) => {
            var doNotBeautify, keyboardType;
            if (item.name) {
              doNotBeautify = item.name.includes('email')
                || item.name.includes('antibot')
                || item.name.includes('website')
                || item.name.includes('username')
                || item.name.includes('link');
              keyboardType = item.name.includes('email') || item.name.includes('username')
                ? 'email-address'
                : item.name.includes('website') || item.name.includes('link') ? 'url' : 'default';
            }

            switch (item.type) {
              case 'text':
                if (item.autocomplete) {
                  return (
                    <Suggest
                      key={key}
                      ref={item.name}
                      {...item}
                      defaultValue={state[`${item.name}_text`]}
                      onChangeText={this.onSuggestChanged}
                      controller={props.suggestController}
                      scrollToField={props.scrollToField}
                    />
                  );
                } else if (item['validation-server']) {
                  return (
                    <RemoteValidator
                      key={key}
                      ref={item.name}
                      {...item}
                      defaultValue={state[item.name]}
                      onFocus={this.fieldOnFocus}
                      onChangeText={this.onValueChange}
                      scrollToField={props.scrollToField}
                      map={props.remoteValidationMap}
                    />
                  );
                } else {
                  return (
                    <TextInput
                      key={key}
                      ref={item.name}
                      autoCorrect={!doNotBeautify}
                      autoCapitalize={doNotBeautify ? 'none' : 'sentences'}
                      defaultValue={state[item.name]}
                      placeholder={item.placeholder}
                      placeholderTextColor={placeholderColor}
                      editable={!state.loading}
                      style={styles.field}
                      onFocus={this.fieldOnFocus.bind(null, item)}
                      onChangeText={this.onValueChange.bind(null, item)}
                      keyboardType={keyboardType}
                      returnKeyType="next"
                    />
                  );
                }
              case 'textarea':
                return (
                  <TextInput
                    key={key}
                    ref={item.name}
                    defaultValue={state[item.name]}
                    autoCorrect={!doNotBeautify}
                    autoCapitalize={doNotBeautify ? 'none' : 'sentences'}
                    placeholder={item.placeholder}
                    placeholderTextColor={placeholderColor}
                    editable={!state.loading}
                    style={[styles.field, styles.multiline_field]}
                    multiline={true}
                    onFocus={this.fieldOnFocus.bind(null, item)}
                    onChangeText={this.onValueChange.bind(null, item)}
                    keyboardType={keyboardType}
                    returnKeyType="next"
                  />
                );
              case 'password':
                if (item['validation-server']) {
                  return (
                    <RemoteValidator
                      key={key}
                      ref={item.name}
                      {...item}
                      defaultValue={state[item.name]}
                      onFocus={this.fieldOnFocus}
                      onChangeText={this.onValueChange}
                      scrollToField={props.scrollToField}
                      map={props.remoteValidationMap}
                    />
                  );
                } else {
                  return (
                    <TextInput
                      key={key}
                      ref={item.name}
                      autoCorrect={false}
                      autoCapitalize="none"
                      secureTextEntry={true}
                      defaultValue={state[item.name]}
                      placeholder={item.placeholder}
                      placeholderTextColor={placeholderColor}
                      editable={!state.loading}
                      style={styles.field}
                      onFocus={this.fieldOnFocus.bind(null, item)}
                      onChangeText={this.onValueChange.bind(null, item)}
                      returnKeyType="next"
                    />
                  );
                }
              case 'richtext':
                return (
                  <TextEditor
                    key={key}
                    ref={item.name}
                    text={state[item.name]}
                    placeholder={item.placeholder}
                    loading={state.loading}
                    big={true}
                    smilesButtonOverlay={true}
                    scrollToField={this.props.scrollToField}
                  />
                );
              case 'upload': {
                let image = item.image && item.image.src[0],
                  buttonColor = state[`${item.name}_error`] ? 'red' : 'gray';

                if (item.required && buttonColor !== 'red') {
                  buttonColor = 'blue';
                }
                return (
                  <View ref={item.name} key={key} style={styles.attach_wrap}>
                    {image ?
                      <TouchableOpacity style={styles.attach} onPress={this.imageShow.bind(null, item)}>
                        <Image
                          source={{uri: image.url}}
                          style={{
                            width: image.width,
                            height: image.height
                          }}
                        />
                      </TouchableOpacity>
                      : null
                    }
                    <View style={styles.attach_cont}>
                      <Attachment
                        {...item}
                        placeholder={item.placeholder}
                        onFileSelected={this.onFileSelected}
                        button={buttonColor}
                      />
                    </View>
                  </View>
                );
              }
              case 'paragraph':
                if (item.link) {
                  return (
                    <TouchableOpacity
                      key={key}
                      style={styles.link}
                      onPress={props.onParagraphPress.bind(null, item)}
                    >
                      <Text style={styles.link_text}>{item.texthtml}</Text>
                    </TouchableOpacity>
                  );
                } else {
                  return (
                    <View key={key} style={styles.link}>
                      <Text style={styles.plain_text}>{item.texthtml}</Text>
                    </View>
                  );
                }
              case 'select':
                if (props.showNativeIOSSelectors && device.isIos()) {
                  return (
                    <Picker
                      key={key}
                      selectedValue={state[item.name]}
                      onValueChange={this.onSelectorChanged.bind(null, item)}
                    >
                      {_.map(item.items, (value, key) => {
                        return <Picker.Item key={key} label={value} value={key} />;
                      })}
                    </Picker>
                  );
                } else {
                  return (
                    <Selector
                      key={key}
                      value={state[item.name]}
                      text={state[`${item.name}_text`]}
                      placeholder={item.placeholder}
                      items={item.items}
                      onValueChange={this.onSelectorChanged.bind(null, item)}
                    />
                  );
                }
              case 'date': {
                let date = state[item.name] || Date.now();
                return (
                  <SelectorDate
                    key={key}
                    date={date}
                    placeholder={item.placeholder}
                    onValueChange={this.onValueChange.bind(null, item)}
                  />
                );
              }
              case 'image': {
                let size = postsHelpers.getImageActualSize({
                  width: 640,
                  height: 156,
                  targetWidth: 280,
                  targetHeight: 67
                });
                return (
                  <View key={key} style={styles.captcha}>
                    <Image
                      source={{uri: config.API_URL + item.src[0].url}}
                      style={size}
                    />
                  </View>
                );
              }
              case 'checkbox': {
                return (
                  <TouchableHighlight
                    key={key}
                    style={styles.switcher_wrap}
                    onPress={this.onSwitcherPress.bind(null, item)}
                    underlayColor="#FFF"
                  >
                    <View style={styles.switcher_cont}>
                      <Switch
                        value={state[item.name]}
                        onValueChange={this.onValueChange.bind(null, item)}
                      />
                      <Text style={styles.switcher_text}>{item.placeholder}</Text>
                    </View>
                  </TouchableHighlight>
                );
              }
              case 'button':
              case 'submit':
                buttons.push(item, {type: 'separator'});
                return null;
            }
          })}
          <View style={styles.buttons_container}>
            {_.map(buttons, (item, key) => {
              switch (item.type) {
                case 'button':
                  let Button = item.color === 'danger' ? ButtonRed : ButtonBlue;
                  return (
                    <Button
                      key={key}
                      text={item.text}
                      onPress={this.props.onButtonPress.bind(null, item)}
                    />
                  );
                case 'submit':
                  if (state.loading) {
                    return (
                      <ButtonGray
                        key={key}
                        text={item.text + '...'}
                        loading={true}
                        loadingColor={props.loadingColor}
                      />
                    );
                  } else {
                    let Button = item.color === 'danger' ? ButtonRed : ButtonGreen;
                    return (
                      <Button
                        key={key}
                        text={item.text}
                        onPress={this.submit}
                      />
                    );
                  }
                case 'separator':
                  return (
                    <View key={key} style={styles.button_separator} />
                  );
              }
            })}
          </View>
        </View>
      );
    }
  }
}

export default Form;
