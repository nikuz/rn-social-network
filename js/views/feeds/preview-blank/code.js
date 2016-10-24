'use strict';

import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import * as ajax from '../../../modules/ajax';
import * as InteractionManager from '../../../modules/interactions';
import * as navigatorHelpers from '../../../modules/navigator';
import * as feedsModel from '../../../models/feeds';
import Loading from '../../../components/loading/code';
import {ButtonBlue} from '../../../components/buttons/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';

class PostBlank extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    navigator: React.PropTypes.object.isRequired
  };
  state = {
    error: false,
    loading: true,
    loaded: false
  };
  request;
  getData = () => {
    this.request = feedsModel.getItem({
      url: this.props.url
    }, (err, response) => {
      if (!this.request) {
        return;
      }
      if (err) {
        this.setState({
          error: err
        });
      } else {
        this.props.navigator.replace({
          title: navigatorHelpers.titlePrepare(response.title),
          id: 'post_view',
          backButton: true,
          data: response
        });
      }
    });
  };
  tryAgain = () => {
    this.setState({
      loading: true,
      error: false
    });
    this.getData();
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getData();
    });
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  render() {
    var state = this.state;
    return (
      <View style={styles.container}>
        {state.loading ?
          <Loading size="large" />
          : null
        }
        {state.error ?
          <View style={styles.error_content}>
            <Icon name="exclamation-triangle" style={styles.icon} />
            <Text style={styles.error_text}>{state.error}</Text>
            <ButtonBlue
              text="Try again"
              onPress={this.tryAgain}
            />
          </View>
          : null
        }
      </View>
    );
  }
}

export default PostBlank;
