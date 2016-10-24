'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../modules/ajax';
import * as device from '../../modules/device';
import Loading from '../../components/loading/code';
import * as EventManager from '../../modules/events';
import * as account from '../../modules/account';
import * as forms from '../../modules/forms';
import * as InteractionManager from '../../modules/interactions';
import * as accountModel from '../../models/account';
import {
  ButtonBlue,
} from '../../components/buttons/code';
import KeyboardAwareScrollView from '../../components/keyboard-aware-scroll-view/code';
import Orientation from 'react-native-orientation';
import Form from '../../components/form/code';
import HTMLView from '../../components/html-view/code';
import pageStyles from '../../../styles/page';
import ovlStyles from '../../../styles/ovl';

class TermsOverlay extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired
  };
  state = {
    data: null,
    height: 0,
    error: null
  };
  downloadData = () => {
    this.request = accountModel.getTerms({
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
    this.downloadData();
  };
  orientationChangedHandler = () => {
    this.setState({
      height: device.dimensions().height * .6
    });
  };
  close = () => {
    EventManager.trigger('overlayClose');
  };
  componentWillMount() {
    this.setState({
      height: device.dimensions().height * .6
    });
  }
  componentDidMount() {
    this.downloadData();
    Orientation.addOrientationListener(this.orientationChangedHandler);
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.data !== nextState.data
      || state.height !== nextState.height
      || state.error !== nextState.error;
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
    Orientation.removeOrientationListener(this.orientationChangedHandler);
  }
  render() {
    var state = this.state,
      data = state.data,
      contentStyle = {
        height: state.height
      };

    return (
      <View>
        {state.data ?
          <View style={ovlStyles.title}>
            <Text style={ovlStyles.title_text}>{data.title}</Text>
          </View>
          : null
        }
        <ScrollView style={contentStyle}>
          <View style={ovlStyles.content}>
            {!state.data && !state.error ?
              <View style={ovlStyles.loader}>
                <Loading size="large" />
              </View>
              : null
            }
            {state.error ?
              <View>
                <View style={ovlStyles.error}>
                  <Text style={ovlStyles.error_text}>{state.error}</Text>
                </View>
                <ButtonBlue
                  text="Try again"
                  onPress={this.tryAgain}
                />
              </View>
              : null
            }
            {state.data && !state.error ?
              <HTMLView
                value={data.texthtml}
              />
              : null
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

class Registration extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    navigatorResetPagesStack: React.PropTypes.func.isRequired
  };
  state = {
    loading: true,
    error: null,
    data: null
  };
  request;
  downloadData = () => {
    this.setState({
      loading: true
    });
    this.request = accountModel.getLoginFormsData({}, (err, response) => {
      if (!this.request) {
        return;
      }
      var newState = {
        loading: false
      };
      if (err) {
        newState.error = err;
      } else {
        response = response.registration;
        this.props.navigator._navBar.update({
          title: response.title
        });
        _.extend(newState, {
          data: response
        });
      }
      this.setState(newState);
    });
  };
  tryAgain = () => {
    this.setState({
      error: null
    });
    this.downloadData();
  };
  additionalValidation = (state, refs) => {
    if (state['user-password'] !== state['user-password-equal']) {
      forms.markAsError(refs['user-password-equal']);
      this.scrollToField(refs['user-password-equal']);
      return false;
    }
    return true;
  };
  scrollToField = (field) => {
    this.refs.scrollContent.scrollTo(field);
  };
  scrollToTop = () => {
    this.refs.scrollContent.scrollToTop();
  };
  openTerms = (item) => {
    EventManager.trigger('overlayOpen', {
      content: (
        <TermsOverlay
          url={item.link.url}
        />
      )
    });
  };
  submit = (err, response) => {
    if (!err && response) {
      account.login(response.username);
      EventManager.trigger('accountRegistered', {
        username: response.username,
        menu: response.menu
      });
    }
  };
  afterSuccessClose = () => {
    this.props.navigatorResetPagesStack({
      page: 'feeds',
      title: ''
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.loading !== nextState.loading
      || state.error !== nextState.error
      || state.data !== nextState.data;
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
          <KeyboardAwareScrollView ref="scrollContent">
            <View style={[pageStyles.content, pageStyles.isTop]}>
              <Form
                items={state.data.items}
                submit={this.submit}
                scrollToField={this.scrollToField}
                scrollToTop={this.scrollToTop}
                controller={accountModel.registration}
                onParagraphPress={this.openTerms}
                remoteValidationMap={{
                  'signin&check-username': accountModel.checkUsername,
                  'signin&check-password': accountModel.checkPassword,
                  'signin&check-email': accountModel.checkEmail
                }}
                additionalValidation={this.additionalValidation}
                afterSuccessClose={this.afterSuccessClose}
              />
            </View>
          </KeyboardAwareScrollView>
          : null
        }
        <View style={pageStyles.shadow_line} />
      </View>
    );
  }
}

export default Registration;
