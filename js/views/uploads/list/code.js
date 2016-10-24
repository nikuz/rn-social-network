'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  ListView,
  Image
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../../modules/ajax';
import Loading from '../../../components/loading/code';
import * as InteractionManager from '../../../modules/interactions';
import {
  ButtonBlue
} from '../../../components/buttons/code';
import * as uploadModel from '../../../models/upload';
import HTMLView from '../../../components/html-view/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import pageStyles from '../../../../styles/page';

class Uploads extends Component {
  state = {
    loading: true,
    isLoadingTail: false,
    error: false,
    full: null,
    empty: null,
    rawData: [],
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }),
    pageUrl: null
  };
  request;
  downloadData = () => {
    var curState = this.state;
    this.request = uploadModel.getUploads({
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
        let feeds = curState.rawData.slice(0);
        if (!response.rows.length) {
          if (feeds.length) {
            newState.full = true;
          } else {
            newState.empty = true;
          }
        } else {
          if (feeds.length) {
            feeds = feeds.concat(response.rows);
          } else {
            feeds = response.rows;
          }
        }
        _.extend(newState, {
          rawData: feeds,
          dataSource: curState.dataSource.cloneWithRows(feeds),
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
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.loading !== nextState.loading
      || state.error !== nextState.error
      || state.isLoadingTail !== nextState.isLoadingTail
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
    var progress = Number(item.progress),
      flexCompleted = progress * 100,
      flexRemaining = (1 - progress) * 100;

    return (
      <View style={styles.item}>
        <Icon name="cloud-upload" style={styles.item_icon} />
        <Text style={styles.item_title}>{item.title || ' '}</Text>
        {item.texthtml.text !== '' ?
          <HTMLView
            value={item.texthtml.text}
            inline={true}
          />
          : null
        }
        {item.filename ?
          <View style={styles.item_file}>
            <Text style={styles.item_file_text}>{item.filename}</Text>
          </View>
          : null
        }
        <View style={styles.progress}>
          <View style={[styles.progress_completed, {flex: flexCompleted}]} />
          <View style={[styles.progress_remaining, {flex: flexRemaining}]} />
        </View>
      </View>
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

export default Uploads;
