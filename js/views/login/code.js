'use strict';

import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../modules/ajax';
import * as EventManager from '../../modules/events';
import * as InteractionManager from '../../modules/interactions';
import * as accountModel from '../../models/account';
import * as account from '../../modules/account';
import {
  ButtonBlue
} from '../../components/buttons/code';
import Loading from '../../components/loading/code';
import Form from '../../components/form/code';
import KeyboardAwareScrollView from '../../components/keyboard-aware-scroll-view/code';
import sideStyles from '../../../styles/side';
import pageStyles from '../../../styles/page';
import styles from './style';

class LoginForm extends Component {
  static propTypes = {
    afterLoginAction: React.PropTypes.func,
    title: React.PropTypes.string.isRequired,
    items: React.PropTypes.array.isRequired,
    scrollToField: React.PropTypes.func.isRequired,
    scrollToTop: React.PropTypes.func.isRequired
  };
  submit = (err, response) => {
    if (!err && response) {
      account.login(response.username);
      EventManager.trigger('accountAuthorized', {
        username: response.username,
        menu: response.menu
      });
      if (_.isFunction(this.props.afterLoginAction)) {
        this.props.afterLoginAction();
      }
    }
  };
  render() {
    var props = this.props;
    return (
      <View>
        <View style={sideStyles.title}>
          <Text style={sideStyles.title_text}>{props.title.toUpperCase()}</Text>
        </View>
        <View style={styles.form}>
          <Form
            items={props.items}
            scrollToField={this.props.scrollToField}
            scrollToTop={this.props.scrollToTop}
            submit={this.submit}
            controller={accountModel.login}
            loadingColor="#FFF"
          />
        </View>
      </View>
    );
  }
}

class PasswordRestoreForm extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    items: React.PropTypes.array.isRequired,
    scrollToField: React.PropTypes.func.isRequired,
    scrollToTop: React.PropTypes.func.isRequired
  };
  render() {
    var props = this.props;
    return (
      <View>
        <View style={sideStyles.title_h2}>
          <Text style={sideStyles.title_text}>{props.title.toUpperCase()}</Text>
        </View>
        <View style={styles.form}>
          <Form
            items={props.items}
            scrollToField={this.props.scrollToField}
            scrollToTop={this.props.scrollToTop}
            controller={accountModel.restorePassword}
            clearAfter={true}
            loadingColor="#FFF"
          />
        </View>
      </View>
    );
  }
}

class RegistrationButton extends Component {
  static propTypes = {
    texthtml: React.PropTypes.string.isRequired
  };
  registrationHandler = () => {
    EventManager.trigger('registrationTriggered', {
      title: this.props.texthtml
    });
  };
  render() {
    var props = this.props;
    return (
      <View style={styles.form}>
        <ButtonBlue
          text={props.texthtml}
          onPress={this.registrationHandler}
          stretched={true}
          icon="sign-in"
        />
      </View>
    );
  }
}

class Login extends Component {
  static propTypes = {
    afterLogin: React.PropTypes.func
  };
  state = {
    loading: true,
    error: false,
    data: {}
  };
  request = null;
  downloadInitialData = () => {
    this.request = accountModel.getLoginFormsData({}, (err, response) => {
      if (!this.request) {
        return;
      }
      var state = {
        loading: false
      };
      if (err) {
        state.error = err;
      } else {
        let loginForm = response.login;
        state.data = {
          login: loginForm[0],
          resetPassword: loginForm[1],
          registrationButton: loginForm[2]
        };
      }
      this.setState(state);
    });
  };
  tryAgain = () => {
    this.setState({
      loading: true,
      error: false
    });
    this.downloadInitialData();
  };
  scrollToField = (field) => {
    this.refs.scrollContent.scrollTo(field);
  };
  scrollToTop = () => {
    this.refs.scrollContent.scrollToTop();
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
  render() {
    var state = this.state,
      data = state.data;

    return (
      <View style={sideStyles.wrap}>
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
            <LoginForm
              {...data.login}
              scrollToField={this.scrollToField}
              scrollToTop={this.scrollToTop}
              afterLoginAction={this.props.afterLogin}
            />
            <PasswordRestoreForm
              {...data.resetPassword}
              scrollToField={this.scrollToField}
              scrollToTop={this.scrollToTop}
            />
            <RegistrationButton {...data.registrationButton} />
          </KeyboardAwareScrollView>
          : null
        }
      </View>
    );
  }
}

export default Login;
