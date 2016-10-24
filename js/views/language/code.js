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
import * as InteractionManager from '../../modules/interactions';
import * as accountModel from '../../models/account';
import * as settings from '../../modules/settings';
import Loading from '../../components/loading/code';
import {ButtonBlue} from '../../components/buttons/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import sideStyles from '../../../styles/side';
import pageStyles from '../../../styles/page';
import styles from './style';

class Language extends Component {
  static propTypes = {
    onSelect: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired
  };
  state = {
    loading: true,
    error: false,
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }),
    current: null
  };
  downloadHandler = () => {
    this.request = accountModel.getLanguages({
      language: this.state.current
    }, (err, response) => {
      if (!this.request) {
        return;
      }
      this.request = false;
      var state = {
        loading: false
      };
      if (err) {
        state.error = err;
      } else {
        _.each(response.items, (item) => {
          if (item.text === this.state.current) {
            item.current = true;
          }
        });
        state.dataSource = this.state.dataSource.cloneWithRows(response.items);
      }
      this.setState(state);
    });
  };
  tryAgain = () => {
    this.setState({
      loading: true,
      error: false
    });
    this.downloadHandler();
  };
  selectHandler = async (language) => {
    var languageOpts = {
      id: language.link.params.language,
      value: language.text,
      icon: language.image.src[0].url
    };
    await settings.set('language', languageOpts);
    this.props.onSelect();
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(async () => {
      this.setState({
        current: (await settings.get('language')).value
      });
      this.downloadHandler();
    });
  };
  componentWillUnmount() {
    this.request = false;
  }
  renderRow = (item) => {
    var iconURL, icon;
    if (item.image) {
      iconURL = item.image.src[0].url;
      icon = (
        <Image
          source={{uri: iconURL}}
          style={styles.icon}
        />
      );
    }
    return (
      <TouchableHighlight
        style={styles.item}
        onPress={this.selectHandler.bind(null, item)}
        underlayColor="#3d3d3d"
      >
        <View style={styles.item_cont}>
          {icon}
          <Text style={styles.item_text}>{item.text}</Text>
          {item.current ?
            <Icon style={styles.current_icon} name="check" />
            : null
          }
        </View>
      </TouchableHighlight>
    );
  };
  renderSeparator(sectionID, rowID) {
    return <View style={styles.separator} key={rowID} />;
  }
  render() {
    var state = this.state;
    return (
      <View style={sideStyles.wrap}>
        <View style={sideStyles.title}>
          <Text style={sideStyles.title_text}>{this.props.title.toUpperCase()}</Text>
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

export default Language;
