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
  ButtonBlue,
} from '../../components/buttons/code';
import KeyboardAwareScrollView from '../../components/keyboard-aware-scroll-view/code';
import * as InteractionManager from '../../modules/interactions';
import * as navigatorHelpers from '../../modules/navigator';
import * as contactsModel from '../../models/contacts';
import Form from '../../components/form/code';
import HTMLView from '../../components/html-view/code';
import pageStyles from '../../../styles/page';

class Feedback extends Component {
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
        submit={this.submit}
        controller={contactsModel.feedback}
        clearAfter={true}
      />
    );
  }
}

class Imprint extends Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired
  };
  render() {
    return (
      <HTMLView
        value={this.props.data.texthtml}
      />
    );
  }
}

class Terms extends Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired
  };
  render() {
    return (
      <HTMLView
        value={this.props.data.texthtml}
      />
    );
  }
}

class ContactsNavigator extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    immediatelyDataLoading: React.PropTypes.bool
  };
  state = {
    loading: true,
    error: false,
    page: 'feedback',
    menuItems: null,
    data: null,
    title: ''
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
      case 'feedback':
        method = 'getFeedbackForm';
        break;
      case 'imprint':
        method = 'getImprint';
        break;
      case 'termsofservice':
        method = 'getTerms';
        break;
    }
    this.request = contactsModel[method]({}, (err, response) => {
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
        newState.data = response.data;
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
  scrollToField = (field) => {
    this.refs.scrollContent.scrollTo(field);
  };
  scrollToTop = () => {
    this.refs.scrollContent.scrollToTop();
  };
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.loading !== nextState.loading
      || state.error !== nextState.error
      || state.data !== nextState.data;
  }
  componentDidMount() {
    if (this.props.immediatelyDataLoading) {
      this.downloadData();
    } else {
      InteractionManager.runAfterInteractions(() => {
        this.downloadData();
      });
    }
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
        case 'feedback':
          content = (
            <Feedback
              data={state.data}
              scrollToField={this.scrollToField}
              scrollToTop={this.scrollToTop}
            />
          );
          break;
        case 'imprint':
          content = (
            <Imprint
              data={state.data}
            />
          );
          break;
        case 'termsofservice':
          content = (
            <Terms
              data={state.data}
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

export default ContactsNavigator;
