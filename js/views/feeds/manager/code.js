'use strict';

import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  Alert,
  Image
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../../modules/ajax';
import * as EventManager from '../../../modules/events';
import * as relationModel from '../../../models/relations';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import ovlStyles from '../../../../styles/ovl';

class InfoOverlay extends Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    navigator: React.PropTypes.object.isRequired,
    title: React.PropTypes.string.isRequired
  };
  itemOnPress = (data) => {
    EventManager.trigger('overlayClose');
    this.props.navigator.push({
      title: data.text,
      id: 'relations',
      backButton: true,
      data: {
        url: data.link.url
      }
    });
  };
  render() {
    var props = this.props;
    return (
      <View>
        <View style={ovlStyles.title}>
          <Text style={ovlStyles.title_text}>{props.title}</Text>
        </View>
        <View style={ovlStyles.content}>
          {_.map(props.items, (item, key) => {
            var icon,
              text = <Text style={styles.info_text}>{item.text}</Text>;

            if (item.image.src) {
              icon = (
                <Image
                  source={{uri: item.image.src[0].url}}
                  style={styles.info_image}
                />
              );
            } else {
              switch (item.image.icon) {
                case 'calendar':
                  icon = <Icon name="calendar" style={styles.info_icon} />;
                  break;
                case 'followers':
                case 'following':
                  text = (
                    <TouchableOpacity onPress={this.itemOnPress.bind(null, item)}>
                      <Text style={styles.info_text_link}>{item.text}</Text>
                    </TouchableOpacity>
                  );
                  break;
              }
            }
            return (
              <View style={styles.info_row} key={key}>
                <View style={styles.info_icon_wrap}>
                  {icon}
                </View>
                <View style={styles.info_text_wrap}>
                  {text}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

class ManagerMenu extends Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    updateManageButtons: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired,
    userName: React.PropTypes.string.isRequired
  };
  state = {
    menuItems: null
  };
  request;
  action = (options) => {
    this.request = relationModel[options.method]({
      url: options.link.url,
      data: options.link.params
    }, (err, response) => {
      if (!this.request) {
        return;
      }
      if (err) {
        Alert.alert(options.text, err);
      } else {
        Alert.alert(options.text, response.message.texthtml);
        this.props.updateManageButtons(response.manageButtons);
      }
    });
  };
  follow = (data) => {
    _.extend(data, {
      method: 'follow'
    });
    this.action(data);
  };
  unfollow = (data) => {
    _.extend(data, {
      method: 'unfollow'
    });
    this.action(data);
  };
  block = (data) => {
    _.extend(data, {
      method: 'block'
    });
    this.action(data);
  };
  unblock = (data) => {
    _.extend(data, {
      method: 'unblock'
    });
    this.action(data);
  };
  menuSelectedHandler = (data) => {
    EventManager.trigger('tooltipMenuClose');
    if (data.type === 'info') {
      EventManager.trigger('overlayOpen', {
        content: (
          <InfoOverlay
            title={data.text}
            items={data.items}
            navigator={this.props.navigator}
          />
        )
      });
    } else if (data.link.url.indexOf('/letters') !== -1) {
      this.props.navigator.push({
        title: this.props.userName,
        id: 'messenger',
        backButton: true,
        data: {
          url: data.link.url
        }
      });
    } else if (data.link.url.indexOf('/relation-follow') !== -1) {
      this.follow(data);
    } else if (data.link.url.indexOf('/relation-delete') !== -1) {
      this.unfollow(data);
    } else if (data.link.url.indexOf('/relation-block') !== -1) {
      this.block(data);
    } else if (data.link.url.indexOf('/relation-unblock') !== -1) {
      this.unblock(data);
    }
  };
  openMenu = () => {
    var menuContent = (
      <View>
        {_.map(this.props.items, (item, key) => {
          return (
            <TouchableHighlight
              key={key}
              underlayColor="#3d3d3d"
              onPress={this.menuSelectedHandler.bind(null, item)}
            >
              <View style={styles.dropdown_item}>
                <Text style={styles.dropdown_item_text}>{item.text}</Text>
              </View>
            </TouchableHighlight>
          );
        })}
      </View>
    );
    EventManager.trigger('tooltipMenuOpen', {
      content: menuContent,
      anchorEl: this.refs.button,
      direction: 'right',
      marginTop: 0,
      marginRight: 3
    });
  };
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  render() {
    return (
      <TouchableOpacity
        ref="button"
        onPress={this.openMenu}
        style={styles.button}
      >
        <Icon name="ellipsis-v" style={styles.button_icon} />
      </TouchableOpacity>
    );
  }
}

export default ManagerMenu;
