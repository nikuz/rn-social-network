'use strict';

import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import * as ajax from '../../modules/ajax';
import * as EventManager from '../../modules/events';
import * as feedsModel from '../../models/feeds';
import * as commentsModel from '../../models/comments';
import Loading from '../../components/loading/code';
import {
  ButtonBlue,
} from '../../components/buttons/code';
import Form from '../../components/form/code';
import styles from './style';

class Report extends Component {
  static propTypes = {
    type: React.PropTypes.string,
    url: React.PropTypes.string.isRequired
  };
  state = {
    data: null,
    loading: false,
    error: null
  };
  downloadInitialData = () => {
    var model;
    if (this.props.type === 'posting') {
      model = commentsModel;
    } else {
      model = feedsModel;
    }
    this.request = model.getReportAbuseForm({
      url: this.props.url
    }, (err, response) => {
      if (!this.request) {
        return;
      }
      var newState = {};
      if (err) {
        newState.error = err;
      } else {
        newState.data = response;
      }
      this.setState(newState);
    });
  };
  tryAgain = () => {
    this.setState({
      error: null
    });
    this.downloadInitialData();
  };
  close = () => {
    EventManager.trigger('overlayClose');
  };
  componentDidMount() {
    this.downloadInitialData();
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.data !== nextState.data
      || state.loading !== nextState.loading
      || state.error !== nextState.error;
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  render() {
    var state = this.state,
      data = state.data,
      model;

    if (this.props.type === 'posting') {
      model = commentsModel;
    } else {
      model = feedsModel;
    }

    return (
      <View>
        {data ?
          <View style={styles.title}>
            <Text style={styles.title_text}>{data.title}</Text>
          </View>
          : null
        }
        <View style={styles.content}>
          {!data && !state.error ?
            <View style={styles.loader_wrap}>
              <Loading />
            </View>
            : null
          }
          {state.error ?
            <View>
              <View style={styles.error}>
                <Text style={styles.error_text}>{state.error}</Text>
              </View>
              <ButtonBlue
                text="Try again"
                onPress={this.tryAgain}
              />
            </View>
            : null
          }
          {data && !state.error ?
            <View>
              <Form
                items={data.items}
                afterSuccessClose={this.close}
                controller={model.reportAbuse}
              />
            </View>
            : null
          }
        </View>
      </View>
    );
  }
}

export default Report;
