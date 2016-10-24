'use strict';

import * as _ from 'underscore';
import * as logs from './logs';

var events = {
  // status bar
  statusBarShow: {},
  statusBarHide: {},
  //
  languageSelected: {},
  // account
  accountAuthorized: {},
  accountUnauthorized: {},
  registrationTriggered: {},
  accountRegistered: {},
  // sideMenu
  sideMenuOpen: {},
  sideMenuClose: {},
  // tooltipMenu
  tooltipMenuOpen: {},
  tooltipMenuClose: {},
  // feeds
  postPreviewOverlayOpen: {},
  postPreviewOverlayClose: {},
  // video player
  videoOpen: {},
  videoClose: {},
  // gallery
  galleryOpen: {},
  galleryClose: {},
  // overlay
  overlayOpen: {},
  overlayClose: {},
  // suggest
  suggestOpen: {},
  suggestClose: {},
  // likes
  likeAdded: {}
};

_.each(events, function(item, key) {
  events[key] = {
    handlers: new Map()
  };
});

function checkEventExists(eventName) {
  if (process.env.CURRENT_ENV === 'PROD') {
    return true;
  }
  if (_.contains(_.keys(events), eventName)) {
    return true;
  } else {
    logs.captureError(`EventManager event ${eventName} not found`);
  }
}

// ----------------
// public methods
// ----------------

function on(eventName, handler) {
  eventName = eventName.split(' ');
  _.each(eventName, function(item) {
    if (checkEventExists(item)) {
      events[item].handlers.set(handler, handler);
    }
  });
}

function off(eventName, handler) {
  eventName = eventName.split(' ');
  _.each(eventName, function(item) {
    if (checkEventExists(item)) {
      events[item].handlers.delete(handler);
    }
  });
}

function trigger(eventName, values) {
  if (checkEventExists(eventName)) {
    let env = process.env.CURRENT_ENV;
    if (env !== 'PROD' && env !== 'TEST') {
      console.log(`'${eventName}' event is triggered`);
    }
    events[eventName].handlers.forEach(function(handler) {
      if (!values) {
        values = {
          name: eventName
        };
      }
      handler(values);
    });
  }
}

function flushEvents() {
  _.each(events, function(eventName, key) {
    events[key].handlers = new Map();
  });
}

// ---------
// interface
// ---------

export {
  on,
  off,
  trigger,
  flushEvents
};
