'use strict';

import * as _ from 'underscore';
import * as config from '../config';
import * as feedsController from '../controllers/feeds';

// ----------------
// public methods
// ----------------

function get(options, callback) {
  var cb = callback || _.noop;
  return feedsController.get(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      let rows = _.filter(response.main, (item) => {
          return item.type !== 'pagination' && item.type !== 'heading';
        }),
        pager = _.findWhere(response.main, {type: 'pagination'}),
        menuItems = response.combined[0];

      cb(null, {
        menuItems,
        rows,
        pager: pager && pager.url
      });
    }
  });
}

function getItem(options, callback) {
  var cb = callback || _.noop;
  return feedsController.getItem(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      let combined = _.isArray(response.combined) && response.combined[0],
        main = response.main[0],
        media,
        comments = _.filter(response.main, function(item) {
          return item.type === 'posting' || item.type === 'like' || item.type === 'mention';
        }),
        commentsRefresh = _.findWhere(response.main, {type: 'refresh'}),
        commentsForm = _.findWhere(response.main, {type: 'form'})
            || _.findWhere(response.main, {type: 'form-login'}),
        commentsPager = _.findWhere(response.main, {type: 'pagination'}),
        albumData = _.findWhere(response.combined, {type: 'album'}),
        textExtended;

      if (main.layout === 'media') {
        media = main;
        main = response.main[1];
      } else {
        media = combined || main;
      }

      if (main.type === 'video' || main.type === 'audio' || main.type === 'text') {
        media = media.media && media.media.src;
      } else {
        media = media.image && media.image.src;
      }

      textExtended = main.texthtml && (main.texthtml.extended || main.texthtml.text);

      cb(null, {
        type: main.type,
        title: main.title,
        user: main.user,
        image: main.image && main.image.src,
        link: main.link,
        parent: main.parent,
        duration: main.duration,
        pagesCounter: main.pages,
        statistic: main.statistic,
        tools: main.tools,
        comments,
        commentsForm,
        commentsPager: commentsPager && commentsPager.url,
        commentsRefresh,
        textExtended,
        media,
        albumData,
        datetime: main.datetime,
        created: main.datetime && main.datetime.text
      });
    }
  });
}

function likeItem(options, callback) {
  var cb = callback || _.noop;
  return feedsController.likeItem(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function getAddToAlbumForm(options, callback) {
  var cb = callback || _.noop;
  return feedsController.getAddToAlbumForm(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, {
        saveToAlbum: response.main[0],
        createNewAlbum: response.main[1]
      });
    }
  });
}

function createAlbum(options, callback) {
  var cb = callback || _.noop;
  return feedsController.createAlbum(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function saveToAlbum(options, callback) {
  var cb = callback || _.noop;
  return feedsController.saveToAlbum(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function getReportAbuseForm(options, callback) {
  var cb = callback || _.noop;
  return feedsController.getReportAbuseForm(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, {
        title: response.main[0].title,
        items: response.main[0].items
      });
    }
  });
}

function reportAbuse(options, callback) {
  var cb = callback || _.noop;
  return feedsController.reportAbuse(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      response = response.main[0];
      if (response.color === 'warning') {
        cb(response.texthtml);
      } else {
        cb(null, response);
      }
    }
  });
}

function getDownloadLinks(options, callback) {
  var cb = callback || _.noop;
  return feedsController.getDownloadLinks(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      response = response.main[0];
      cb(null, {
        title: response.text,
        links: response.items
      });
    }
  });
}

function getEmbeddedLinks(options, callback) {
  var cb = callback || _.noop;
  return feedsController.getDownloadLinks(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      response = response.main[0];
      var srcReg = /src="([^"]+)"/,
        width = response.items[0],
        height = response.items[1],
        playAuto = response.items[2],
        embed = response.items[3],
        lastMedia = response.items[4];

      if (embed) {
        embed.value = embed.value.match(srcReg)[1];
      }
      if (lastMedia) {
        lastMedia.value = lastMedia.value.match(srcReg)[1];
      }

      cb(null, {
        title: response.title,
        items: {
          width,
          height,
          playAuto,
          embed,
          lastMedia
        }
      });
    }
  });
}

function getSharingForm(options, callback) {
  var cb = callback || _.noop;
  return feedsController.getSharingForm(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function share(options, callback) {
  var cb = callback || _.noop;
  return feedsController.share(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      response = response.main[0];
      if (response.color === 'warning') {
        cb(response.texthtml);
      } else {
        cb(null, response);
      }
    }
  });
}

// ---------
// interface
// ---------

export {
  get,
  getItem,
  likeItem,
  getAddToAlbumForm,
  createAlbum,
  saveToAlbum,
  getReportAbuseForm,
  reportAbuse,
  getDownloadLinks,
  getEmbeddedLinks,
  getSharingForm,
  share
};
