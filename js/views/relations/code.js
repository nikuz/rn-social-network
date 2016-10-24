'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  ListView,
  TouchableHighlight,
  Image
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../modules/ajax';
import Loading from '../../components/loading/code';
import * as InteractionManager from '../../modules/interactions';
import {
  ButtonBlue
} from '../../components/buttons/code';
import {Avatar} from '../../components/pictures/code';
import * as navigatorHelpers from '../../modules/navigator';
import * as postsHelpers from '../../modules/posts';
import * as relationsModel from '../../models/relations';
import HTMLView from '../../components/html-view/code';
import styles from './style';
import pageStyles from '../../../styles/page';

class RelationsNavigator extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired
  };
  state = {
    loading: true,
    isLoadingTail: false,
    error: false,
    page: 'relations',
    menuItems: null,
    rawData: [],
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }),
    pageUrl: null,
    full: null,
    empty: null
  };
  menuItemOnPress = (item) => {
    var itemId = navigatorHelpers.getMenuItemId(item);
    this.setState({
      page: itemId,
      loading: true,
      pageUrl: null
    });
    this.downloadData();
  };
  request;
  downloadData = () => {
    var curState = this.state,
      props = this.props,
      subUrl;

    switch (curState.page) {
      case 'relationsblock':
        subUrl = '/block';
        break;
      case 'relationsfollowers':
        subUrl = '/followers';
        break;
    }
    this.request = relationsModel.get({
      url: props.url,
      subUrl,
      page: curState.pageUrl
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
        if (!props.url && response.menuItems && !curState.menuItems) {
          response.menuItems.menuItemOnPress = this.menuItemOnPress;
          _.each(response.menuItems.items, (item) => {
            var itemId = navigatorHelpers.getMenuItemId(item);
            if (itemId === curState.page) {
              item.current = true;
            }
          });
          // update navigator state for generate initial dropdown menu
          props.navigator._navBar.update({
            menuItems: response.menuItems
          });
          newState.menuItems = response.menuItems;
          let activePage = navigatorHelpers.getMenuItemId(response.menuItems.items[0]);
          if (curState.page !== activePage) {
            this.menuItemOnPress(response.menuItems.items[0]);
          }
        }
        let rows = curState.rawData.slice(0);
        if (!response.rows.length) {
          if (rows.length) {
            newState.full = true;
          } else {
            newState.empty = true;
          }
        } else {
          if (rows.length && curState.pageUrl) {
            rows = rows.concat(response.rows);
          } else {
            rows = response.rows;
          }
        }
        _.extend(newState, {
          rawData: rows,
          dataSource: this.state.dataSource.cloneWithRows(rows),
          pageUrl: response.pager
        });
      }
      this.setState(newState);
      setTimeout(() => {
        this.setState({
          isLoadingTail: false
        });
      }, 100);
    });
  };
  tryAgain = () => {
    this.setState({
      loading: true,
      error: false
    });
    this.downloadData();
  };
  onEndReached = () => {
    var state = this.state;
    if (!state.isLoadingTail && !state.full && !state.empty && (state.rawData.length && state.pageUrl)) {
      this.setState({
        isLoadingTail: true
      });
      this.downloadData();
    }
  };
  itemOnPress = (item) => {
    postsHelpers.openPostOwnerFromList({
      data: item
    }, this.props.navigator);
  };
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.loading !== nextState.loading
      || state.isLoadingTail !== nextState.isLoadingTail
      || state.error !== nextState.error
      || state.page !== nextState.page
      || state.rawData !== nextState.rawData;
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.downloadData();
    });
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  renderFooter = () => {
    return this.state.isLoadingTail ?
      <Loading style={styles.footer_loader} />
      : null;
  };
  renderItem = (item) => {
    return (
      <TouchableHighlight
        style={styles.item_wrap}
        onPress={this.itemOnPress.bind(this, item)}
        underlayColor="#EFEFEF"
      >
        <View style={styles.item}>
          <Avatar src={item.image.src} size="large" />
          <View style={styles.item_cont}>
            <Text style={styles.item_title}>{item.text}</Text>
            {item.texthtml.text !== '' ?
              <HTMLView
                value={item.texthtml.text}
                inline={true}
              />
              : null
            }
            <View style={styles.location}>
              <Image
                source={{uri: item.location.image.src[0].url}}
                style={styles.location_icon}
              />
              <Text style={styles.location_text}>
                {item.location.text}
              </Text>
            </View>
            <View style={styles.location}>
              <Image
                source={{uri: item.language.image.src[0].url}}
                style={styles.location_icon}
              />
              <Text style={styles.location_text}>
                {item.language.text}
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  render() {
    var state = this.state;
    return (
      <View style={pageStyles.wrap_white}>
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
            renderRow={this.renderItem}
            onEndReached={this.onEndReached}
            renderFooter={this.renderFooter}
            enableEmptySections={true}
          />
          : null
        }
        <View style={pageStyles.shadow_line} />
      </View>
    );
  }
}

export default RelationsNavigator;
