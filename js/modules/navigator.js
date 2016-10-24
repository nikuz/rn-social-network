'use strict';

import * as device from './device';

// ----------------
// public methods
// ----------------

function getCurRoute(navigator) {
  var routes = navigator.getCurrentRoutes();
  return routes[routes.length - 1];
}

function isInboxPage(navigator) {
  var curRoute = getCurRoute(navigator);
  return curRoute.type === 'tab' && curRoute.id === 'inbox';
}

function titlePrepare(title, length) {
  length = length || [40, 20];
  var maxLength = device.isTablet() ? length[0] : length[1];
  if (title.length > maxLength) {
    title = title.substring(0, maxLength) + '...';
  }
  return title;
}

function getMenuItemId(item) {
  var url = (item.link && item.link.url) || '';
  if (url.includes('user')) {
    url = url.replace(/^\/user\/[^/]+\/([^/]+)\//, '$1');
  } else if (url.includes('search') || url.includes('account')) {
    url = url.replace(/^.+\/([^/]+)$/, '$1');
  } else {
    url = url.replace(/\//g, '');
  }
  return url;
}

// ---------
// interface
// ---------

export {
  getCurRoute,
  isInboxPage,
  titlePrepare,
  getMenuItemId
};
