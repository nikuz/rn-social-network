'use strict';

import React, { Component } from 'react';
import * as EventManager from '../../modules/events';
import TooltipMenu from '../../components/tooltip-menu/code';
import PostPreviewOverlay from '../feeds/preview-overlay/code';
import VideoPlayerFullScreen from '../../components/video-player/code-fullscreen';
import PhotoGallery from '../../components/photo-gallery/code';
import Overlay from '../../components/overlay/code';
import {SuggestTooltip} from '../../components/suggest/code';

class OverlaysManager extends Component {
  state = {
    tooltipmenu: false,
    postpreview: false,
    videoplayer: false,
    photogallery: false,
    overlay: false,
    suggest: false,
    data: null
  };
  openHandler = (type, options) => {
    var newState = {
      data: options,
      [type]: true
    };
    this.setState(newState);
  };
  closeHandler = (type) => {
    this.setState({
      [type]: 'close'
    });
  };
  removeHandler = (type) => {
    this.setState({
      [type]: false
    });
  };
  //
  tooltipMenuOpenHandler = (options) => {
    this.openHandler('tooltipmenu', options);
  };
  tooltipMenuCloseHandler = () => {
    this.closeHandler('tooltipmenu');
  };
  videoPlayerOpenHandler = (options) => {
    this.openHandler('videoplayer', options);
  };
  videoPlayerCloseHandler = () => {
    this.closeHandler('videoplayer');
  };
  photoGalleryOpenHandler = (options) => {
    this.openHandler('photogallery', options);
  };
  photoGalleryCloseHandler = () => {
    this.closeHandler('photogallery');
  };
  postPreviewOpenHandler = (options) => {
    this.openHandler('postpreview', options);
  };
  postPreviewCloseHandler = () => {
    this.closeHandler('postpreview');
  };
  overlayOpenHandler = (options) => {
    if (this.state.tooltipmenu) {
      EventManager.trigger('tooltipMenuClose');
    }
    this.openHandler('overlay', options);
  };
  overlayCloseHandler = () => {
    this.closeHandler('overlay');
  };
  suggestOpenHandler = (options) => {
    this.openHandler('suggest', options);
  };
  suggestCloseHandler = () => {
    this.closeHandler('suggest');
  };
  //
  shouldComponentUpdate(nextProps, nextState) {
    var state = this.state;
    return state.data !== nextState.data
      || state.tooltipmenu !== nextState.tooltipmenu
      || state.postpreview !== nextState.postpreview
      || state.videoplayer !== nextState.videoplayer
      || state.photogallery !== nextState.photogallery
      || state.overlay !== nextState.overlay
      || state.suggest !== nextState.suggest;
  }
  componentDidMount() {
    EventManager.on('tooltipMenuOpen', this.tooltipMenuOpenHandler);
    EventManager.on('tooltipMenuClose', this.tooltipMenuCloseHandler);
    //
    EventManager.on('videoOpen', this.videoPlayerOpenHandler);
    EventManager.on('videoClose', this.videoPlayerCloseHandler);
    //
    EventManager.on('galleryOpen', this.photoGalleryOpenHandler);
    EventManager.on('galleryClose', this.photoGalleryCloseHandler);
    //
    EventManager.on('postPreviewOverlayOpen', this.postPreviewOpenHandler);
    EventManager.on('postPreviewOverlayClose', this.postPreviewCloseHandler);
    //
    EventManager.on('overlayOpen', this.overlayOpenHandler);
    EventManager.on('overlayClose', this.overlayCloseHandler);
    //
    EventManager.on('suggestOpen', this.suggestOpenHandler);
    EventManager.on('suggestClose', this.suggestCloseHandler);
  }
  componentWillUnmount() {
    EventManager.off('tooltipMenuOpen', this.tooltipMenuOpenHandler);
    EventManager.off('tooltipMenuClose', this.tooltipMenuCloseHandler);
    //
    EventManager.off('videoOpen', this.videoPlayerOpenHandler);
    EventManager.off('videoClose', this.videoPlayerCloseHandler);
    //
    EventManager.off('galleryOpen', this.photoGalleryOpenHandler);
    EventManager.off('galleryClose', this.photoGalleryCloseHandler);
    //
    EventManager.off('postPreviewOverlayOpen', this.postPreviewOpenHandler);
    EventManager.off('postPreviewOverlayClose', this.postPreviewCloseHandler);
    //
    EventManager.off('overlayOpen', this.overlayOpenHandler);
    EventManager.off('overlayClose', this.overlayCloseHandler);
    //
    EventManager.off('suggestOpen', this.suggestOpenHandler);
    EventManager.off('suggestClose', this.suggestCloseHandler);
  }
  render() {
    var state = this.state;
    if (state.tooltipmenu) {
      return (
        <TooltipMenu
          {...state.data}
          close={state.tooltipmenu === 'close'}
          afterClose={this.removeHandler.bind(null, 'tooltipmenu')}
        />
      );
    }
    if (state.postpreview) {
      return (
        <PostPreviewOverlay
          {...state.data}
          close={state.postpreview === 'close'}
          afterClose={this.removeHandler.bind(null, 'postpreview')}
        />
      );
    }
    if (state.videoplayer) {
      return (
        <VideoPlayerFullScreen
          {...state.data}
          close={state.videoplayer === 'close'}
          afterClose={this.removeHandler.bind(null, 'videoplayer')}
        />
      );
    }
    if (state.photogallery) {
      return (
        <PhotoGallery
          {...state.data}
          close={state.photogallery === 'close'}
          afterClose={this.removeHandler.bind(null, 'photogallery')}
        />
      );
    }
    if (state.overlay) {
      return (
        <Overlay
          {...state.data}
          close={state.overlay === 'close'}
          afterClose={this.removeHandler.bind(null, 'overlay')}
        />
      );
    }
    if (state.suggest) {
      return (
        <SuggestTooltip
          {...state.data}
          close={state.suggest === 'close'}
          afterClose={this.removeHandler.bind(null, 'suggest')}
        />
      );
    }
    return null;
  }
}

export default OverlaysManager;
