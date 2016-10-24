'use strict';

import * as _ from 'underscore';
import * as contactsController from '../controllers/contacts';

// ----------------
// public methods
// ----------------

function getFeedbackForm(options, callback) {
  var cb = callback || _.noop;
  return contactsController.getFeedbackForm(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, {
        menuItems: response.combined[0],
        data: response.main[0]
      });
    }
  });
}

function feedback(options, callback) {
  var cb = callback || _.noop;
  return contactsController.feedback(options, (err, response) => {
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

function getImprint(options, callback) {
  var cb = callback || _.noop;
  return contactsController.getImprint(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, {
        menuItems: response.combined[0],
        data: response.main[0]
      });
    }
  });
}

function getTerms(options, callback) {
  var cb = callback || _.noop;
  return contactsController.getTerms(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, {
        menuItems: response.combined[0],
        data: response.main[0]
      });
    }
  });
}

// ---------
// interface
// ---------

export {
  getFeedbackForm,
  feedback,
  getImprint,
  getTerms
};
