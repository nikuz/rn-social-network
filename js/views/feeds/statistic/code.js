'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import * as _ from 'underscore';
import * as ajax from '../../../modules/ajax';
import * as account from '../../../modules/account';
import * as EventManager from '../../../modules/events';
import * as feedsModel from '../../../models/feeds';
import Login from '../../login/code';
import Share from '../../../modules/share';
import Loading from '../../../components/loading/code';
import {
  ButtonBlue
} from '../../../components/buttons/code';
import Form from '../../../components/form/code';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import ovlStyles from '../../../../styles/ovl';

class SharingOverlay extends Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    addNewSharing: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired
  };
  state = {
    data: null,
    loading: true,
    error: null
  };
  downloadInitialData = () => {
    this.request = feedsModel.getSharingForm({
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
  tryAgain = () => {
    this.setState({
      error: null
    });
    this.downloadInitialData();
  };
  submit = (err, response) => {
    if (!err && response) {
      this.props.addNewSharing(response);
    }
  };
  close = () => {
    EventManager.trigger('overlayClose');
  };
  componentDidMount() {
    this.downloadInitialData();
  }
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.loading !== nextState.loading
      || state.data !== nextState.data
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
      title = data ? data.title : this.props.title;

    return (
      <View>
        {title ?
          <View style={ovlStyles.title}>
            <Text style={ovlStyles.title_text}>{title}</Text>
          </View>
          : null
        }
        <View style={ovlStyles.content}>
          {state.loading ?
            <View style={ovlStyles.loader}>
              <Loading size="large" />
            </View>
            : null
          }
          {!state.loading && state.error ?
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
          {!state.loading && !state.error && data ?
            <Form
              items={data.items}
              controller={feedsModel.share}
              submit={this.submit}
              afterSuccessClose={this.close}
            />
            : null
          }
        </View>
      </View>
    );
  }
}

class Statistic extends Component {
  static propTypes = {
    postOpenHandler: React.PropTypes.func,
    addNewLike: React.PropTypes.func,
    addNewSharing: React.PropTypes.func,
    data: React.PropTypes.object,
    sharing: React.PropTypes.object,
    like: React.PropTypes.object,
    comments: React.PropTypes.object,
    views: React.PropTypes.object
  };
  state = {
    likesCounter: 0,
    alreadyLiked: false,
    alreadyShared: false
  };
  onPressComments = async () => {
    var props = this.props;
    props.postOpenHandler && props.postOpenHandler();
  };
  onPressSharingSocial = async () => {
    var props = this.props;
    Share({
      url: props.data.url,
      message: props.data.title,
      subject: props.data.title
    });
  };
  updateSharingStatus = (response) => {
    this.setState({
      alreadyShared: true
    });
    this.props.addNewSharing && this.props.addNewSharing();
    // EventManager.trigger('sharingAdded', response);
  };
  onPressSharing = async () => {
    if (!await account.isAuthorized()) {
      return EventManager.trigger('sideMenuOpen', {
        content: <Login afterLogin={this.onPressSharing} />
      });
    } else if (this.state.alreadyShared) {
      return;
    }

    var props = this.props;
    EventManager.trigger('overlayOpen', {
      content: (
        <SharingOverlay
          url={props.sharing.url}
          title={props.sharing.title}
          type={props.data.type}
          id={props.data.id}
          addNewSharing={this.updateSharingStatus}
        />
      )
    });
  };
  likeRequest = null;
  onPressLike = async () => {
    if (!await account.isAuthorized()) {
      return EventManager.trigger('sideMenuOpen', {
        content: <Login afterLogin={this.onPressLike} />
      });
    } else if (this.state.alreadyLiked) {
      return;
    }

    var props = this.props;
    this.likeRequest = feedsModel.likeItem({
      type: props.data.type,
      id: props.data.id
    }, (err, response) => {
      if (!this.likeRequest) {
        return;
      }
      if (!err && response) {
        this.setState({
          likesCounter: this.state.likesCounter + 1,
          alreadyLiked: true
        });
        props.addNewLike && props.addNewLike(response);
        EventManager.trigger('likeAdded', response);
      }
    });
  };
  componentWillMount() {
    var props = this.props,
      newState = {};

    if (props.like) {
      _.extend(newState, {
        likesCounter: Number(props.like.text),
        alreadyLiked: props.like.alreadyLiked
      });
    }
    if (props.sharing && props.sharing.alreadyShared) {
      newState.alreadyShared = true;
    }
    if (_.size(newState)) {
      this.setState(newState);
    }
  }
  componentWillReceiveProps(nextProps) {
    var newState = {};
    if (nextProps.like && nextProps.like.thirdPartyUpdate) {
      _.extend(newState, {
        likesCounter: Number(nextProps.like.text),
        alreadyLiked: nextProps.like.alreadyLiked
      });
    }
    if (nextProps.sharing && nextProps.sharing.thirdPartyUpdate) {
      newState.alreadyShared = nextProps.sharing.alreadyShared;
    }
    if (_.size(newState)) {
      this.setState(newState);
    }
  }
  componentWillUnmount() {
    this.likeRequest = null;
  }
  render() {
    var props = this.props,
      state = this.state,
      likeColorStyle = null,
      sharingColorStyle = null,
      space = '\u00a0\u00a0';

    if (state.alreadyLiked) {
      likeColorStyle = styles.icon_active_color;
    }
    if (state.alreadyShared) {
      sharingColorStyle = styles.icon_active_color;
    }

    return (
      <View>
        <View style={styles.border} />
        <View style={styles.content}>
          {props.comments ?
            <TouchableOpacity
              style={[styles.item, styles.comments]}
              onPress={this.onPressComments}
            >
              <Text>
                <Icon name="comment" style={styles.icon} />
                <Text style={styles.text}>
                  {space + props.comments.text}
                </Text>
              </Text>
            </TouchableOpacity>
            :
            <View style={styles.item} />
          }
          {props.views ?
            <View style={styles.item}>
              <Text>
                <Icon name="eye" style={styles.icon} />
                <Text style={styles.text}>
                  {space + props.views.text}
                </Text>
              </Text>
            </View>
            :
            <View style={styles.item} />
          }
          <View style={styles.separator} />
          <TouchableOpacity
            style={[styles.item, styles.sharing_social]}
            onPress={this.onPressSharingSocial}
          >
            <Icon name="share-alt" style={styles.icon} />
          </TouchableOpacity>
          {props.sharing ?
            <TouchableOpacity
              style={[styles.item, styles.sharing]}
              onPress={this.onPressSharing}
            >
              <Icon name="share" style={[styles.icon, sharingColorStyle]} />
            </TouchableOpacity>
            :
            <View style={styles.item} />
          }
          {props.like ?
            <TouchableOpacity
              style={[styles.item, styles.like]}
              onPress={this.onPressLike}
            >
              <Text>
                <Icon name="thumbs-up" style={[styles.icon, likeColorStyle]} />
                <Text style={[styles.text, likeColorStyle]}>
                  {space + state.likesCounter}
                </Text>
              </Text>
            </TouchableOpacity>
            :
            <View style={styles.item} />
          }
        </View>
      </View>
    );
  }
}

export default Statistic;
