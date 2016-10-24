'use strict';

import * as _ from 'underscore';
import * as device from './device';
import * as browser from './browser';
import * as navigatorHelpers from './navigator';
import * as EventManager from './events';

function numbersCompensation(number) {
  if (number < 10) {
    number = '0' + number;
  }
  return number;
}

// ----------------
// public methods
// ----------------

function getRatioIndex() {
  var ratioIndex;
  switch (device.pixelRatio()) {
    case 1:
      ratioIndex = 0;
      break;
    case 1.5:
    case 2:
      ratioIndex = 1;
      break;
    case 3:
    case 3.5:
      ratioIndex = 2;
      break;
  }
  return ratioIndex;
}

function getImage(images, ratioIndex) {
  if (images[ratioIndex] && images[ratioIndex].url) {
    return images[ratioIndex];
  } else {
    if (ratioIndex > 0) {
      return getImage(images, --ratioIndex);
    } else {
      return null;
    }
  }
}

function getImageActualSize(options) {
  var opts = options,
    width = opts.width,
    height = opts.height,
    ratio = width / height,
    targetWidth = opts.targetWidth,
    targetHeight = opts.targetHeight,
    resultWidth,
    resultHeight;

  if (ratio >= 1) {
    resultWidth = targetWidth < width ? targetWidth : width;
    resultHeight = resultWidth / ratio;

    if (resultHeight > targetHeight) {
      resultHeight = targetHeight < height ? targetHeight : height;
      resultWidth = resultHeight * ratio;
    }
  } else {
    resultHeight = targetHeight < height ? targetHeight : height;
    resultWidth = resultHeight * ratio;

    if (resultWidth > targetWidth) {
      resultWidth = targetWidth < width ? targetWidth : width;
      resultHeight = resultWidth / ratio;
    }
  }

  return {
    width: Math.round(resultWidth),
    height: Math.round(resultHeight)
  };
}

function duration(seconds) {
  if (seconds < 0) {
    seconds = 0;
  }
  seconds = Number(seconds);
  var dMinutes = seconds / 60,
    h = Math.floor(dMinutes / 60),
    m = Math.floor(dMinutes > 60 ? dMinutes % 60 : dMinutes),
    s = Math.floor(seconds % 60);

  if (h) {
    h = numbersCompensation(h) + ':';
  } else {
    h = '';
  }

  return `${h}${numbersCompensation(m)}:${numbersCompensation(s)}`;
}

function openPostFromList(options, navigator) {
  var opts = options || {};
  if (opts.overlay) {
    EventManager.trigger('postPreviewOverlayOpen', opts);
  } else {
    var data = opts.data,
      title = opts.title
        || (data.parent && data.parent.title)
        || (data.texthtml && data.texthtml.text);

    title = navigatorHelpers.titlePrepare(title);

    navigator.push({
      title: title,
      id: 'post_view',
      backButton: true,
      data: _.extend({
        scrollToComments: opts.scrollToComments
      }, data)
    });
  }
}

function openPostOwnerFromList(options, navigator) {
  var opts = options || {},
    user = opts.data;

  navigator.push({
    title: user.text,
    id: 'user',
    backButton: true,
    data: {
      user: user.link.url.replace('/user/', ''),
      text: user.text
    }
  });
}

function openLinkInText(url, text, navigator) {
  var postsTypes = [
    '/media',
    '/video',
    '/photo',
    '/audio',
    '/text',
    '/article'
  ];

  text = navigatorHelpers.titlePrepare(text);

  if (_.some(postsTypes, (item) => { return url.indexOf(item) === 0; })) {
    navigator.push({
      title: text,
      id: 'post_view_blank',
      backButton: true,
      data: {
        url,
        text
      }
    });
  } else if (url.indexOf('/hashtag') === 0) {
    navigator.push({
      title: text,
      id: 'hashtag',
      backButton: true,
      data: {
        url,
        text,
        hashtag: url.replace('/hashtag/', '')
      }
    });
  } else if (url.indexOf('/user') === 0) {
    openPostOwnerFromList({
      data: {
        link: {
          url
        },
        text
      }
    }, navigator);
  } else if (url.indexOf('http') === 0 || url.indexOf('www') === 0) {
    browser.openURL(url);
  }
}

// ---------
// interface
// ---------

export {
  getRatioIndex,
  getImage,
  getImageActualSize,
  duration,
  openLinkInText,
  openPostFromList,
  openPostOwnerFromList
};
