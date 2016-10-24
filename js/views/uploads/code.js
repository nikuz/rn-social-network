'use strict';

import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../modules/ajax';
import Loading from '../../components/loading/code';
import KeyboardAwareScrollView from '../../components/keyboard-aware-scroll-view/code';
import * as InteractionManager from '../../modules/interactions';
import {
  ButtonBlue
} from '../../components/buttons/code';
import * as uploadModel from '../../models/upload';
import Form from '../../components/form/code';
import pageStyles from '../../../styles/page';

class UploadFile extends Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    scrollToField: React.PropTypes.func.isRequired,
    scrollToTop: React.PropTypes.func.isRequired
  };
  render() {
    var props = this.props;
    return (
      <Form
        items={props.items}
        scrollToField={props.scrollToField}
        scrollToTop={props.scrollToTop}
        controller={uploadModel.uploadFiles}
        clearAfter={true}
      />
    );
  }
}

class UploadLink extends Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    scrollToField: React.PropTypes.func.isRequired,
    scrollToTop: React.PropTypes.func.isRequired
  };
  render() {
    var props = this.props;
    return (
      <Form
        items={props.items}
        scrollToField={props.scrollToField}
        scrollToTop={props.scrollToTop}
        controller={uploadModel.uploadLinks}
        clearAfter={true}
      />
    );
  }
}

class CreateArticle extends Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    scrollToField: React.PropTypes.func.isRequired,
    scrollToTop: React.PropTypes.func.isRequired
  };
  render() {
    var props = this.props;
    return (
      <Form
        items={props.items}
        scrollToField={props.scrollToField}
        scrollToTop={props.scrollToTop}
        controller={uploadModel.uploadArticle}
        clearAfter={true}
      />
    );
  }
}

class UploadNavigator extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired
  };
  state = {
    loading: true,
    error: false,
    page: 'file',
    forms: null,
    menuItems: null,
    title: ''
  };
  menuItemOnPress = (item) => {
    this.setState({
      page: item.id
    });
  };
  request;
  downloadData = () => {
    var curState = this.state;
    this.request = uploadModel.getUploadsForms({}, (err, response) => {
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
            if (item.id === curState.page) {
              item.current = true;
            }
          });
          // update navigator state for generate initial dropdown menu
          this.props.navigator._navBar.update({
            menuItems: response.menuItems
          });
          curState.menuItems = response.menuItems;
        }
        newState.forms = response.forms;
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
      || state.page !== nextState.page
      || state.forms !== nextState.forms;
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
        case 'file':
          content = (
            <UploadFile
              {...state.forms[0]}
              scrollToField={this.scrollToField}
              scrollToTop={this.scrollToTop}
            />
          );
          break;
        case 'video':
          content = (
            <UploadLink
              {...state.forms[1]}
              scrollToField={this.scrollToField}
              scrollToTop={this.scrollToTop}
            />
          );
          break;
        case 'article':
          content = (
            <CreateArticle
              {...state.forms[2]}
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

export default UploadNavigator;
