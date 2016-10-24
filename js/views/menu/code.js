'use strict';

import React, { Component } from 'react';
import {
  View,
  ListView,
  Text,
  TouchableHighlight
} from 'react-native';
import * as ajax from '../../modules/ajax';
import * as account from '../../modules/account';
import * as menuModel from '../../models/menu';
import * as EventManager from '../../modules/events';
import * as InteractionManager from '../../modules/interactions';
import {
  ButtonBlue
} from '../../components/buttons/code';
import Loading from '../../components/loading/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import sideStyles from '../../../styles/side';
import pageStyles from '../../../styles/page';
import styles from './style';

class Menu extends Component {
  static propTypes = {
    resetPagesStack: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired
  };
  state = {
    loading: true,
    error: null,
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  };
  request;
  downloadInitialData = () => {
    this.request = menuModel.get({}, (err, response) => {
      if (!this.request) {
        return;
      }
      var newState = {
        loading: false
      };
      if (err) {
        newState.error = err;
      } else {
        newState.dataSource = this.state.dataSource.cloneWithRows(response);
      }
      this.setState(newState);
    });
  };
  tryAgain = () => {
    this.setState({
      loading: true,
      error: false
    });
    this.downloadInitialData();
  };
  logout = () => {
    account.logout(() => {
      EventManager.trigger('accountUnauthorized');
      InteractionManager.runAfterInteractions(() => {
        this.props.resetPagesStack({
          page: 'feeds',
          title: ''
        });
      });
    });
  };
  iconsMapper = {
    profile: 'cog',
    logout: 'sign-out',
    contact: 'phone-square',
    queue: 'cloud-upload',
    notification: 'bell',
    friend: 'heart',
    letter: 'envelope'
  };
  getCorrectIcon(iconName) {
    return this.iconsMapper[iconName] || iconName;
  }
  pagesMapper = {
    '/feedback/': 'contacts',
    '/queues/': 'queues',
    '/account/': 'account',
    '/upload/': 'upload',
    '/history/': 'history',
    '/notifications/': 'notifications',
    '/relations/': 'relations',
    '/letters/': 'messages'
  };
  onPressItem = (item) => {
    var url = item.link.url;
    if (url === '/logout/') {
      this.logout();
    } else {
      this.props.resetPagesStack({
        page: this.pagesMapper[url],
        title: item.text
      });
    }
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.downloadInitialData();
    });
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  renderRow = (item) => {
    return (
      <TouchableHighlight
        style={styles.item}
        underlayColor="#3d3d3d"
        onPress={this.onPressItem.bind(this, item)}
      >
        <View style={styles.item_cont}>
          <Icon style={styles.icon} name={this.getCorrectIcon(item.image.icon)} />
          <Text style={styles.item_text}>{item.text}</Text>
        </View>
      </TouchableHighlight>
    );
  };
  renderSeparator(sectionID, rowID) {
    return <View style={styles.separator} key={rowID} />;
  }
  render() {
    var state = this.state,
      props = this.props;

    return (
      <View style={sideStyles.wrap}>
        <View style={sideStyles.title}>
          <Text style={sideStyles.title_text}>{props.title.toUpperCase()}</Text>
        </View>
        {state.loading ?
          <View style={pageStyles.loader_wrap}>
            <View style={pageStyles.loader_cont}>
              <Loading size="large" />
            </View>
          </View>
          : null
        }
        {state.error ?
          <View style={pageStyles.error_wrap}>
            <View style={pageStyles.error_cont}>
              <Text style={pageStyles.error_text}>{state.error}</Text>
              <ButtonBlue
                text="Try again"
                onPress={this.tryAgain}
              />
            </View>
          </View>
          : null
        }
        {!state.loading && !state.error ?
          <ListView
            dataSource={state.dataSource}
            renderRow={this.renderRow}
            renderSeparator={this.renderSeparator}
            pageSize={20}
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={false}
            enableEmptySections={true}
          />
          : null
        }
      </View>
    );
  }
}

export default Menu;
