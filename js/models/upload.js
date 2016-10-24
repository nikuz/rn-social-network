'use strict';

import * as _ from 'underscore';
import * as uploadController from '../controllers/upload';

// ----------------
// public methods
// ----------------

function getUploads(options, callback) {
  var cb = callback || _.noop;
  return uploadController.getUploads(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      var rows = _.filter(response.main, (item) => {
          return item.type !== 'pagination' && item.type !== 'heading';
        }),
        pager = _.findWhere(response.main, {type: 'pagination'});

      cb(null, {
        rows,
        pager: pager && pager.url
      });
    }
  });
}

function getUploadsForms(options, callback) {
  var cb = callback || _.noop;
  return uploadController.getUploadsForms(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      var forms = response.main,
        menuItems = [];

      _.each(forms, function(form) {
        var id;
        if (_.findWhere(form.items, {name: 'upload-file'})) {
          id = 'file';
        } else if (_.findWhere(form.items, {name: 'upload-link0'})) {
          id = 'video';
        } else {
          id = 'article';
        }
        menuItems.push({
          text: form.title,
          id
        });
      });

      cb(null, {
        menuItems: {
          items: menuItems
        },
        forms
      });
    }
  });
}

function uploadFiles(options, callback) {
  var cb = callback || _.noop;
  return uploadController.uploadFiles(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      response = response.main[0];
      if (response.color === 'danger') {
        cb(response.texthtml);
      } else {
        cb(null, response);
      }
    }
  });
}

function uploadLinks(options, callback) {
  var cb = callback || _.noop;
  return uploadController.uploadLinks(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      response = response.main[0];
      if (response.color === 'danger') {
        cb(response.texthtml);
      } else {
        cb(null, response);
      }
    }
  });
}

function uploadArticle(options, callback) {
  var cb = callback || _.noop;
  return uploadController.uploadArticle(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      response = response.main[0];
      if (response.color === 'danger') {
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
  getUploads,
  getUploadsForms,
  uploadFiles,
  uploadLinks,
  uploadArticle
};
