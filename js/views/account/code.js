'use strict';

import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../modules/ajax';
import Loading from '../../components/loading/code';
import {
  ButtonBlue
} from '../../components/buttons/code';
import KeyboardAwareScrollView from '../../components/keyboard-aware-scroll-view/code';
import * as forms from '../../modules/forms';
import * as EventManager from '../../modules/events';
import * as navigatorHelpers from '../../modules/navigator';
import * as InteractionManager from '../../modules/interactions';
import * as accountModel from '../../models/account';
import Form from '../../components/form/code';
import ovlStyles from '../../../styles/ovl';
import pageStyles from '../../../styles/page';

class RemoveImageOverlay extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    avatar: React.PropTypes.bool,
    title: React.PropTypes.string.isRequired
  };
  state = {
    loading: true,
    error: null,
    data: null
  };
  request;
  downloadData = () => {
    this.request = accountModel.getRemoveImageForm({
      url: this.props.url
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
        newState.data = response;
      }
      this.setState(newState);
    });
  };
  close = () => {
    EventManager.trigger('overlayClose');
  };
  componentDidMount() {
    this.downloadData();
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  render() {
    var state = this.state,
      method = 'removeAvatar';

    if (!this.props.avatar) {
      method = 'removePoster';
    }

    if (state.loading) {
      return (
        <View style={ovlStyles.loader}>
          <Loading />
        </View>
      );
    } else if (state.error) {
      return (
        <View>
          <View style={ovlStyles.error}>
            <Text style={ovlStyles.error_text}>{state.error}</Text>
          </View>
          <ButtonBlue
            text="Try again"
            onPress={this.tryAgain}
          />
        </View>
      );
    } else {
      return (
        <View>
          <View style={ovlStyles.title}>
            <Text style={ovlStyles.title_text}>{this.props.title}</Text>
          </View>
          <View style={ovlStyles.content}>
            <Form
              items={state.data.items}
              afterSuccessClose={this.close}
              controller={accountModel[method]}
            />
          </View>
        </View>
      );
    }
  }
}

class Account extends Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired,
    scrollToField: React.PropTypes.func.isRequired,
    scrollToTop: React.PropTypes.func.isRequired
  };
  imageRemoveHandler = (data) => {
    var url = data.link.url;
    EventManager.trigger('overlayOpen', {
      content: (
        <RemoveImageOverlay
          url={url}
          title={data.texthtml}
          avatar={url.includes('avatar')}
        />
      )
    });
  };
  render() {
    return (
      <Form
        items={this.props.data.items}
        scrollToField={this.props.scrollToField}
        scrollToTop={this.props.scrollToTop}
        controller={accountModel.save}
        suggestController={accountModel.suggestRequest}
        onParagraphPress={this.imageRemoveHandler}
      />
    );
  }
}

class Password extends Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired,
    scrollToField: React.PropTypes.func.isRequired,
    scrollToTop: React.PropTypes.func.isRequired
  };
  additionalValidation = (state, refs) => {
    if (state['user-password'] !== state['user-password-equal']) {
      forms.markAsError(refs['user-password-equal']);
      return false;
    }
    return true;
  };
  render() {
    return (
      <Form
        items={this.props.data.items}
        scrollToField={this.props.scrollToField}
        scrollToTop={this.props.scrollToTop}
        controller={accountModel.passwordSave}
        additionalValidation={this.additionalValidation}
        clearAfter={true}
      />
    );
  }
}

class RemoveEmailPhoneOverlay extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    updateFormData: React.PropTypes.func.isRequired
  };
  state = {
    loading: true,
    error: null,
    data: null
  };
  request;
  downloadData = () => {
    this.request = accountModel.getRemoveEmailPhoneForm({
      url: this.props.url
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
        newState.data = response;
      }
      this.setState(newState);
    });
  };
  submit = (err) => {
    if (!err) {
      this.props.updateFormData();
    }
  };
  close = () => {
    EventManager.trigger('overlayClose');
  };
  componentDidMount() {
    this.downloadData();
  }
  componentWillUnmount() {
    ajax.abort(this.request, () => {
      this.request = null;
    });
  }
  render() {
    var state = this.state;

    if (state.loading) {
      return (
        <View style={ovlStyles.loader}>
          <Loading />
        </View>
      );
    } else if (state.error) {
      return (
        <View>
          <View style={ovlStyles.error}>
            <Text style={ovlStyles.error_text}>{state.error}</Text>
          </View>
          <ButtonBlue
            text="Try again"
            onPress={this.tryAgain}
          />
        </View>
      );
    } else {
      return (
        <View>
          <View style={ovlStyles.title}>
            <Text style={ovlStyles.title_text}>{state.data.title || this.props.title}</Text>
          </View>
          <View style={ovlStyles.content}>
            <Form
              items={state.data.items}
              afterSuccessClose={this.close}
              controller={accountModel.removeEmailPhone}
              submit={this.submit}
            />
          </View>
        </View>
      );
    }
  }
}

class EmailAndPhone extends Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    scrollToField: React.PropTypes.func.isRequired,
    updateFormData: React.PropTypes.func.isRequired
  };
  onButtonPress = (item) => {
    EventManager.trigger('overlayOpen', {
      content: (
        <RemoveEmailPhoneOverlay
          url={item.link.url}
          title={item.text}
          updateFormData={this.props.updateFormData}
        />
      )
    });
  };
  scrollToTop = (key) => {
    this.props.scrollToField(this.refs[`form${key}`], true);
  };
  render() {
    var formsData = this.props.data;
    return (
      <View>
        {_.map(formsData, (item, key) => {
          var separatorStyle = {
              marginTop: 20,
              marginBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#CCC'
            },
            separatorLightStyle = {
              marginTop: 10
            },
            addEmail = _.findWhere(item.items, {name: 'user-email-add'}),
            notActivatedEmail = _.findWhere(item.items, {name: 'emailphone-resend'}),
            controller = addEmail ? 'addEmail' : (notActivatedEmail ? 'emailResendCode' : 'emailActivate');

          return (
            <View key={key} ref={`form${key}`}>
              <Form
                items={item.items}
                scrollToField={this.props.scrollToField}
                scrollToTop={this.scrollToTop.bind(null, key)}
                controller={accountModel[controller]}
                onButtonPress={this.onButtonPress}
                remoteValidationMap={{
                  'signin&check-phone': accountModel.checkPhone,
                  'signin&check-email': accountModel.checkEmail
                }}
                afterSuccessClose={this.props.updateFormData}
              />
              {formsData[key + 1] && !notActivatedEmail ?
                <View style={separatorStyle} />
                : null
              }
              {formsData[key + 1] && notActivatedEmail ?
                <View style={separatorLightStyle} />
                : null
              }
            </View>
          );
        })}
      </View>
    );
  }
}

class Details extends Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired,
    scrollToField: React.PropTypes.func.isRequired,
    scrollToTop: React.PropTypes.func.isRequired
  };
  render() {
    return (
      <Form
        items={this.props.data.items}
        scrollToField={this.props.scrollToField}
        scrollToTop={this.props.scrollToTop}
        controller={accountModel.personalSave}
      />
    );
  }
}

class AccountNavigator extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired
  };
  state = {
    loading: true,
    error: false,
    page: 'profile',
    data: null,
    menuItems: null
  };
  menuItemOnPress = (item) => {
    var itemId = navigatorHelpers.getMenuItemId(item);
    this.setState({
      page: itemId,
      loading: true
    });
    this.downloadData();
  };
  request;
  downloadData = () => {
    var curState = this.state,
      method;

    switch (curState.page) {
      case 'profile':
        method = 'getProfile';
        break;
      case 'access':
        method = 'getPasswordForm';
        break;
      case 'emailphone':
        method = 'getEmailPhoneForm';
        break;
      case 'personal':
        method = 'getPersonalForm';
        break;
    }
    this.request = accountModel[method]({}, (err, response) => {
      if (!this.request) {
        return;
      }
      var newState = {
        loading: false
      };
      if (err) {
        newState.error = err;
      } else {
        if (response.menuItems && !curState.menuItems) {
          response.menuItems.menuItemOnPress = this.menuItemOnPress;
          _.each(response.menuItems.items, (item) => {
            var itemId = navigatorHelpers.getMenuItemId(item);
            if (itemId === curState.page) {
              item.current = true;
            }
          });
          // update navigator state for generate initial dropdown menu
          this.props.navigator._navBar.update({
            menuItems: response.menuItems
          });
          newState.menuItems = response.menuItems;
        }
        newState.data = response.formData;
      }
      this.setState(newState);
    });
  };
  tryAgain = () => {
    this.setState({
      loading: true,
      error: false
    });
    this.downloadData();
  };
  scrollToField = (field, keepTop) => {
    this.refs.scrollContent.scrollTo(field, keepTop);
  };
  scrollToTop = () => {
    this.refs.scrollContent.scrollToTop();
  };
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.loading !== nextState.loading
      || state.error !== nextState.error
      || state.page !== nextState.page
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
    var state = this.state,
      content;

    if (!state.loading && !state.error) {
      switch (state.page) {
        case 'profile':
          content = (
            <Account
              data={state.data}
              scrollToField={this.scrollToField}
              scrollToTop={this.scrollToTop}
            />
          );
          break;
        case 'access':
          content = (
            <Password
              data={state.data}
              scrollToField={this.scrollToField}
              scrollToTop={this.scrollToTop}
            />
          );
          break;
        case 'emailphone':
          content = (
            <EmailAndPhone
              data={state.data}
              scrollToField={this.scrollToField}
              scrollToTop={this.scrollToTop}
              updateFormData={this.tryAgain}
            />
          );
          break;
        case 'personal':
          content = (
            <Details
              data={state.data}
              scrollToField={this.scrollToField}
              scrollToTop={this.scrollToTop}
            />
          );
          break;
      }
    }
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
              {content}
            </View>
          </KeyboardAwareScrollView>
          : null
        }
        <View style={pageStyles.shadow_line} />
      </View>
    );
  }
}

export default AccountNavigator;
