'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Picker,
  DatePickerIOS,
  DatePickerAndroid
} from 'react-native';
import * as _ from 'underscore';
import * as device from '../../modules/device';
import * as EventManager from '../../modules/events';
import * as dateHelpers from '../../modules/date';
import {
  ButtonGreen,
  ButtonGray
} from '../buttons/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import ovlStyles from '../../../styles/ovl';

class Overlay extends Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired,
    onValueChange: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired,
    items: React.PropTypes.object
  };
  state = {
    value: ''
  };
  onValueChange = (value) => {
    this.setState({
      value
    });
  };
  save = () => {
    this.props.onValueChange(this.state.value);
    EventManager.trigger('overlayClose');
  };
  cancel = () => {
    EventManager.trigger('overlayClose');
  };
  componentWillMount() {
    this.setState({
      value: this.props.value
    });
  }
  render() {
    var props = this.props,
      state = this.state,
      selector,
      selectorWrapStyle;

    switch (props.type) {
      case 'selector':
        selector = (
          <Picker
            selectedValue={state.value}
            onValueChange={this.onValueChange}
          >
            {_.map(props.items, (value, key) => {
              return <Picker.Item key={key} label={value} value={key} />;
            })}
          </Picker>
        );
        break;
      case 'date-selector':
        selector = (
          <DatePickerIOS
            date={new Date(state.value)}
            mode="date"
            onDateChange={this.onValueChange}
          />
        );
        selectorWrapStyle = styles.picker_wrap;
        break;
    }

    return (
      <View>
        <View style={ovlStyles.title}>
          <Text style={ovlStyles.title_text}>{props.title}</Text>
        </View>
        <View style={ovlStyles.content}>
          <View style={selectorWrapStyle}>
            {selector}
          </View>
          <View style={styles.buttons}>
            <ButtonGreen
              text="Save"
              onPress={this.save}
            />
            <View style={styles.button_separator} />
            <ButtonGray
              text="Cancel"
              onPress={this.cancel}
            />
          </View>
        </View>
      </View>
    );
  }
}

class Selector extends Component {
  static propTypes = {
    placeholder: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    onValueChange: React.PropTypes.func.isRequired,
    items: React.PropTypes.object.isRequired
  };
  selectorOnFocus = () => {
    var props = this.props;
    EventManager.trigger('overlayOpen', {
      content: (
        <Overlay
          type="selector"
          title={props.placeholder}
          value={props.value}
          items={props.items}
          onValueChange={props.onValueChange}
        />
      )
    });
  };
  render() {
    var props = this.props;
    return (
      <View style={styles.wrap}>
        {device.isIos() ?
          <TextInput
            defaultValue={props.text}
            placeholder={props.placeholder}
            editable={false}
            style={styles.field}
          />
          :
          <Picker
            style={styles.picker}
            selectedValue={props.value}
            onValueChange={this.props.onValueChange}
          >
            {_.map(props.items, (value, key) => {
              return <Picker.Item key={key} label={value} value={key} />;
            })}
          </Picker>
        }
        <Icon style={styles.icon} name="arrow-circle-down" />
        {device.isIos() ?
          <TouchableOpacity
            style={styles.blocker}
            onPress={this.selectorOnFocus}
          />
          : null
        }
      </View>
    );
  }
}

class SelectorDate extends Component {
  static propTypes = {
    placeholder: React.PropTypes.string.isRequired,
    date: React.PropTypes.any.isRequired,
    onValueChange: React.PropTypes.func.isRequired
  };
  dateParse(date) {
    if (date instanceof String) {
      let dashes = date.match(/-/g);
      if (!dashes || dashes.length < 2) {
        return date;
      }
    }

    var d = new Date(date);
    if (isNaN(d.getTime())) {
      return date;
    } else {
      var year = dateHelpers.compensation(d.getFullYear()),
        month = dateHelpers.compensation(d.getMonth() + 1),
        day = dateHelpers.compensation(d.getDate());

      return `${year}-${month}-${day}`;
    }
  };
  selectorOnFocus = async () => {
    var props = this.props;
    if (device.isIos()) {
      EventManager.trigger('overlayOpen', {
        content: (
          <Overlay
            type="date-selector"
            title={props.placeholder}
            value={props.date}
            onValueChange={props.onValueChange}
          />
        )
      });
    } else {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date(props.date)
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        props.onValueChange(new Date(year, month, day));
      }
    }
  };
  render() {
    var props = this.props;
    return (
      <View style={styles.wrap}>
        <TextInput
          defaultValue={this.dateParse(props.date)}
          placeholder={props.placeholder}
          placeholderTextColor={device.isAndroid() ? '#666' : '#999'}
          style={styles.field}
          editable={false}
        />
        <Icon style={styles.icon} name="calendar" />
        <TouchableOpacity
          style={styles.blocker}
          onPress={this.selectorOnFocus}
        />
      </View>
    );
  }
}

export {
  Selector,
  SelectorDate
};
