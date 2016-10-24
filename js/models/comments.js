'use strict';

import * as _ from 'underscore';
import * as config from '../config';
import * as commentsController from '../controllers/comments';

// ----------------
// public methods
// ----------------

function add(options, callback) {
  var cb = callback || _.noop;
  return commentsController.add(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function like(options, callback) {
  var cb = callback || _.noop;
  return commentsController.like(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response);
    }
  });
}

function getReportAbuseForm(options, callback) {
  var cb = callback || _.noop;
  return commentsController.getReportAbuseForm(options, (err, response) => {
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
  return commentsController.reportAbuse(options, (err, response) => {
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

function getEditForm(options, callback) {
  var cb = callback || _.noop;
  return commentsController.getEditForm(options, (err, response) => {
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

function save(options, callback) {
  var cb = callback || _.noop;
  return commentsController.save(options, (err, response) => {
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

function getRemoveForm(options, callback) {
  var cb = callback || _.noop;
  return commentsController.getRemoveForm(options, (err, response) => {
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

function remove(options, callback) {
  var cb = callback || _.noop;
  return commentsController.remove(options, (err, response) => {
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

function refresh(options, callback) {
  var cb = callback || _.noop;
  return commentsController.refresh(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

// ---------
// interface
// ---------

export {
  add,
  like,
  getReportAbuseForm,
  reportAbuse,
  getEditForm,
  save,
  getRemoveForm,
  remove,
  refresh
};
