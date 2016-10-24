'use strict';

import * as EventManager from './events';

var isReady = false,
  states = [
    'initial'
  ];

function setState(state) {
  if (state !== get()) {
    states.push(state);
  }
}

function backState(state) {
  states.splice(states.indexOf(state), 1);
}

// ----------------
// public methods
// ----------------

function init() {
  if (isReady) {
    return;
  }
  isReady = true;

  EventManager.on('videoOpen', setState.bind(null, 'video-full-screen'));
  EventManager.on('videoClose', backState.bind(null, 'video-full-screen'));
  EventManager.on('galleryOpen', setState.bind(null, 'photo-gallery-opened'));
  EventManager.on('galleryClose', backState.bind(null, 'photo-gallery-opened'));
  EventManager.on('overlayOpen', setState.bind(null, 'overlay-opened'));
  EventManager.on('overlayClose', backState.bind(null, 'overlay-opened'));
  EventManager.on('tooltipMenuOpen', setState.bind(null, 'tooltip-menu-opened'));
  EventManager.on('tooltipMenuClose', backState.bind(null, 'tooltip-menu-opened'));
}

function get() {
  return states[states.length - 1];
}

function is(state) {
  return get() === state;
}

// ---------
// interface
// ---------

export {
  init,
  get,
  is
};
