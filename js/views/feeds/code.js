'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  ListView,
  ScrollView,
  RefreshControl
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../modules/ajax';
import * as EventManager from '../../modules/events';
import * as InteractionManager from '../../modules/interactions';
import * as settings from '../../modules/settings';
import * as navigatorHelpers from '../../modules/navigator';
import * as postsHelper from '../../modules/posts';
// controllers
import * as feedsModel from '../../models/feeds';
import * as hashtagsModel from '../../models/hashtags';
import * as searchModel from '../../models/search';
import * as accountModel from '../../models/account';
//
import FeedsItemView from './item/code';
import Manager from './manager/code';
import Loading from '../../components/loading/code';
import {
  ButtonBlue
} from '../../components/buttons/code';
import pageStyles from '../../../styles/page';

class Feeds extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string,
    hashtag: React.PropTypes.string,
    user: React.PropTypes.string,
    navigator: React.PropTypes.object.isRequired,
    immediatelyDataLoading: React.PropTypes.bool
  };
  state = {
    loading: true,
    type: '',
    error: false,
    full: false,
    empty: false,
    update: false,
    pageUrl: null,
    isLoadingTail: false,
    rawData: [],
    menuItems: null,
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  };
  menuItemOnPress = (item) => {
    var itemId = navigatorHelpers.getMenuItemId(item);
    this.setState({
      type: itemId,
      pageUrl: null,
      rawData: [],
      full: null,
      empty: null,
      error: null,
      loading: true
    });
    this.getFeeds();
    if (this.props.id === 'feeds') {
      settings.set('feeds', {
        id: itemId,
        value: item.text
      });
    }
  };
  getController = () => {
    switch (this.props.id) {
      case 'feeds':
        return feedsModel.get;
      case 'extended_search':
        return searchModel.extendedSearch;
      case 'hashtag':
        return hashtagsModel.getFeeds;
      case 'history':
        return accountModel.history;
      case 'user':
        return accountModel.getFeeds;
    }
  };
  getRequestParams = () => {
    var state = this.state,
      props = this.props,
      params = {
        type: state.type,
        page: state.pageUrl
      };

    switch (props.id) {
      case 'extended_search':
        params.text = props.text;
        break;
      case 'hashtag':
        params.hashtag = props.hashtag;
        break;
      case 'user':
        params.user = props.user;
        break;
    }

    return params;
  };
  updateManageButtons = (buttons) => {
    var rightButton = null;
    if (buttons.length) {
      rightButton = (
        <Manager
          userName={this.props.text}
          items={buttons}
          navigator={this.props.navigator}
          updateManageButtons={this.updateManageButtons}
        />
      );
    }
    this.props.navigator._navBar.update({rightButton});
  };
  request;
  getFeeds = () => {
    var curState = this.state;
    if (!curState.loading && !curState.update && ((curState.rawData.length && !curState.pageUrl) || curState.full || curState.empty)) {
      return;
    }

    var controller = this.getController();
    this.request = controller(this.getRequestParams(), (err, response) => {
      if (!this.request) {
        return;
      }
      var newState = {
        loading: false,
        error: false,
        update: false
      };
      if (err) {
        newState.error = err;
      } else {
        if (!curState.menuItems && response.menuItems) {
          response.menuItems.menuItemOnPress = this.menuItemOnPress;
          _.each(response.menuItems.items, (item) => {
            var itemId = navigatorHelpers.getMenuItemId(item);
            if (itemId === this.state.type) {
              item.current = true;
            }
          });
          // update navigator state for generate initial dropdown menu
          this.props.navigator._navBar.update({
            menuItems: response.menuItems
          });
          curState.menuItems = response.menuItems;
        }
        if (curState.manageButtons !== response.manageButtons) {
          this.updateManageButtons(response.manageButtons);
        }
        if (!response.rows.length) {
          if (curState.rawData.length) {
            newState.full = true;
          } else {
            newState.empty = true;
          }
        } else {
          let feeds = curState.rawData;
          if (curState.update) {
            _.each(response.rows, function(rowItem) {
              var isNew = true;
              feeds.every(function(feedItem) {
                if (rowItem.title === feedItem.title) {
                  isNew = false;
                  return false;
                } else {
                  return true;
                }
              });
              if (isNew) {
                feeds.unshift(rowItem);
              }
            });
          } else if (curState.loading) {
            feeds = response.rows;
          } else {
            feeds = feeds.concat(response.rows);
          }

          _.extend(newState, {
            rawData: feeds,
            dataSource: curState.dataSource.cloneWithRows(feeds),
            pageUrl: response.pager
          });
        }
      }
      this.setState(newState);
      setTimeout(() => {
        if (this.request) {
          this.setState({
            isLoadingTail: false
          });
        }
      }, 100);
    });
  };
  tryAgain = () => {
    this.setState({
      loading: true,
      error: false
    });
    this.getFeeds();
  };
  checkNewItems = () => {
    this.setState({
      update: true
    });
    this.getFeeds();
  };
  scrollHandler = (e) => {
    e = e.nativeEvent;
    var state = this.state,
      scrollTarget = e.contentSize.height - e.layoutMeasurement.height - 20,
      curScroll = e.contentOffset.y;

    if (scrollTarget > 0 && curScroll > scrollTarget && !state.isLoadingTail && !state.full && !state.empty && (state.rawData.length && state.pageUrl)) {
      this.setState({
        isLoadingTail: true
      });
      this.getFeeds();
    }
  };
  postItemViewOwnerHandler = (options) => {
    postsHelper.openPostOwnerFromList(options, this.props.navigator);
  };
  postItemViewHandler = (options) => {
    postsHelper.openPostFromList(options, this.props.navigator);
  };
  linkOpenHandler = (url, text) => {
    postsHelper.openLinkInText(url, text, this.props.navigator);
  };
  updateAfterAuthorize = () => {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        pageUrl: null,
        loading: true
      });
      this.getFeeds();
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.dataSource !== nextState.dataSource
      || this.state.loading !== nextState.loading
      || this.state.update !== nextState.update
      || this.state.isLoadingTail !== nextState.isLoadingTail
      || this.state.error !== nextState.error
      || this.state.full !== nextState.full;
  }
  async componentWillMount() {
    if (this.props.id === 'feeds') {
      var feeds = await settings.get('feeds');
      this.setState({
        type: feeds.id
      });
      this.getFeeds();
    } else {
      if (this.props.immediatelyDataLoading) {
        this.getFeeds();
      } else {
        InteractionManager.runAfterInteractions(() => {
          this.getFeeds();
        });
      }
    }
  }
  componentDidMount() {
    EventManager.on('accountAuthorized', this.updateAfterAuthorize);
    EventManager.on('accountUnauthorized', this.updateAfterAuthorize);
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
    EventManager.off('accountAuthorized', this.updateAfterAuthorize);
    EventManager.off('accountUnauthorized', this.updateAfterAuthorize);
  }
  renderScrollComponent = () => {
    var refreshControl = (
      <RefreshControl
        refreshing={this.state.update}
        onRefresh={this.checkNewItems}
      />
    );
    return (
      <ScrollView
        refreshControl={refreshControl}
        onScroll={this.scrollHandler}
        scrollEventThrottle={1}
        automaticallyAdjustContentInsets={true}
        directionalLockEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    );
  };
  renderRow = (item) => {
    return (
      <FeedsItemView
        {...item}
        openOwner={this.postItemViewOwnerHandler}
        openItem={this.postItemViewHandler}
        openLink={this.linkOpenHandler}
      />
    );
  };
  renderFooter = () => {
    return this.state.isLoadingTail ?
      <Loading style={pageStyles.footer_loader} />
      : null;
  };
  render() {
    var state = this.state;
    return (
      <View style={pageStyles.wrap}>
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
            renderFooter={this.renderFooter}
            renderScrollComponent={this.renderScrollComponent}
            initialListSize={state.rawData.length}
            pageSize={state.rawData.length}
            enableEmptySections={true}
          />
          : null
        }
        <View style={pageStyles.shadow_line} />
      </View>
    );
  }
}

export default Feeds;
