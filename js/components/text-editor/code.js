'use strict';

import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput
} from 'react-native';
import * as _ from 'underscore';
import {
  Smiles,
  smilesList
} from '../smiles/code';
import Loading from '../loading/code';
import * as forms from '../../modules/forms';
import * as device from '../../modules/device';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Autolinker from 'autolinker';
import Orientation from 'react-native-orientation';
import entities from 'he';
import styles from './style';

class TextEditor extends Component {
  static propTypes = {
    doNotValid: React.PropTypes.bool,
    scrollToField: React.PropTypes.func,
    submitOnPress: React.PropTypes.func,
    text: React.PropTypes.string,
    big: React.PropTypes.bool,
    smilesOverlay: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    editable: React.PropTypes.bool,
    autoFocus: React.PropTypes.bool,
    smilesButtonOverlay: React.PropTypes.bool,
    submit: React.PropTypes.bool,
    transparentField: React.PropTypes.bool
  };
  state = {
    text: '',
    placeholder: '',
    smilesShown: false,
    imgReg: '<img\\b[^>]*?src="([^"]+)"[^>]*?/?>',
    linkReg: '<a\\b[^>]*?href="([^"]+)"[^>]*?>([^<]+)</a>',
    smilesReg: /\[[^\]]+\]/g,
    smilesOverlayWidth: 0
  };
  textDecode = (text) => {
    var state = this.state,
      links = text.match(new RegExp(state.linkReg, 'gi')),
      images = text.match(new RegExp(state.imgReg, 'gi'));

    if (links) {
      let linkReg = new RegExp(state.linkReg, 'i');
      _.each(links, function(item) {
        var linkText = item.match(linkReg)[2];
        text = text.replace(item, linkText);
      });
    }
    if (images) {
      let imgReg = new RegExp(state.imgReg, 'i');
      _.each(images, function(item) {
        var smileSrc = item.match(imgReg)[1],
          smileCode = _.findWhere(smilesList, {url: smileSrc.replace('/image/', '')});

        text = text.replace(item, smileCode ? smileCode.code : '');
      });
    }

    return entities.decode(text);
  };
  textEncode = () => {
    var state = this.state,
      text = state.text,
      smilesInText = text.match(state.smilesReg),
      imgTag = '<img src="/image/{url}" width="{width}" width="{height}" alt="" />',
      linkTag = '<a href="{href}">{text}</a>';

    if (smilesInText) {
      _.each(smilesInText, (item) => {
        var smile = _.findWhere(smilesList, {code: item}),
          image = imgTag
            .replace('{url}', smile.url)
            .replace('{width}', smile.width)
            .replace('{height}', smile.height);

        text = text.replace(item, image);
      });
    }

    Autolinker.link(text, {
      replaceFn: function(autolinker, match) {
        var link = linkTag
          .replace('{href}', match.getAnchorHref())
          .replace('{text}', match.getAnchorText());

        text = text.replace(match.getAnchorText(), link);
      }
    });

    return text;
  };
  smilesShow = () => {
    this.setState({
      smilesShown: !this.state.smilesShown,
      smilesOverlayWidth: device.dimensions().width / 100 * 80
    });
  };
  smileOnPress = (smile) => {
    var state = this.state,
      text = state.text;

    if (text.length && !/\s$/.test(text)) {
      text += ' ';
    }

    text += smile.code;

    this.refs.text.setNativeProps({text});
    forms.refreshStyle({
      field: this.refs.text
    });
    this.setState({text});
  };
  setSmilesOverlayWidth = () => {
    this.setState({
      smilesOverlayWidth: device.dimensions().width / 100 * 80
    });
  };
  onFocusHandler = () => {
    var props = this.props;
    if (_.isFunction(props.scrollToField)) {
      props.scrollToField(this.refs.text);
    }
    if (props.doNotValid !== true) {
      forms.refreshStyle({
        field: this.refs.text
      });
    }
  };
  onChangeHandler = (value) => {
    this.setState({
      text: value
    });
  };
  validate = () => {
    var validateFields = [{
      field: this.refs.text,
      name: 'text',
      value: this.state.text
    }];

    return forms.validate(validateFields) === true;
  };
  submitOnPress = () => {
    if (this.state.text.length && this.props.submitOnPress) {
      this.props.submitOnPress();
    }
  };
  refresh = () => {
    this.setState({
      text: '',
      smilesShown: false
    });
  };
  scrollTo = () => {
    if (_.isFunction(this.props.scrollToField)) {
      this.props.scrollToField(this.refs.text);
    }
  };
  componentWillMount() {
    if (this.props.text) {
      this.setState({
        text: this.textDecode(this.props.text)
      });
    }
  }
  componentDidMount() {
    if (this.props.big) {
      Orientation.addOrientationListener(this.setSmilesOverlayWidth);
    }
  }
  componentWillUnmount() {
    if (this.props.big) {
      Orientation.removeOrientationListener(this.setSmilesOverlayWidth);
    }
  }
  render() {
    var state = this.state,
      props = this.props,
      fieldStyle = [styles.field];

    if (props.big) {
      fieldStyle.push(styles.field_big);
    }
    if (props.transparentField) {
      fieldStyle.push(styles.transparent);
    }

    return (
      <View>
        {state.smilesShown && !props.smilesOverlay ?
          <View style={!props.big ? styles.smiles_wrap : null}>
            <Smiles onPress={this.smileOnPress} />
          </View>
          : null
        }
        <View style={styles.content}>
          <View style={styles.field_wrap}>
            <TextInput
              ref="text"
              defaultValue={state.text}
              placeholder={props.placeholder}
              placeholderTextColor={device.isAndroid() ? '#666' : '#999'}
              style={fieldStyle}
              editable={props.editable || !state.loading}
              multiline={true}
              autoFocus={props.autoFocus}
              onFocus={this.onFocusHandler}
              onChangeText={this.onChangeHandler}
            />
            {state.smilesShown && props.smilesOverlay ?
              <View style={[styles.smiles_wrap_tooltip, {width: state.smilesOverlayWidth}]}>
                <Smiles onPress={this.smileOnPress} />
              </View>
              : null
            }
          </View>
          <TouchableOpacity
            style={[styles.smile_button, props.smilesButtonOverlay ? styles.smile_button_overlay : null]}
            onPress={this.smilesShow}
          >
            <Icon
              name="smile-o"
              style={[
                styles.smile_button_icon,
                state.smilesShown ? styles.smile_button_icon_active : null
              ]}
            />
          </TouchableOpacity>
          {state.loading ?
            <View style={styles.loading_wrap}>
              <Loading color="#5181b8" size="small" />
            </View>
            : null
          }
          {props.submit && !state.loading ?
            <TouchableOpacity style={styles.send_button} onPress={this.submitOnPress}>
              <Icon name="paper-plane" style={styles.send_button_icon} />
            </TouchableOpacity>
            : null
          }
        </View>
      </View>
    );
  }
}

export default TextEditor;
