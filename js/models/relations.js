'use strict';

import * as _ from 'underscore';
import * as relationsController from '../controllers/relations';

// ----------------
// public methods
// ----------------

function get(options, callback) {
  var cb = callback || _.noop;
  return relationsController.get(options, function(err, response) {
    if (err) {
      cb(err);
    } else {
      var rows = _.filter(response.main, (item) => {
          return item.type !== 'pagination' && item.type !== 'heading';
        }),
        pager = _.findWhere(response.main, {type: 'pagination'});

      cb(null, {
        menuItems: response.combined[0],
        rows,
        pager: pager && pager.url
      });
    }
  });
}

function follow(options, callback) {
  var cb = callback || _.noop;
  return relationsController.follow(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      var manageButtons = response.combined[2].items[0].items;
      manageButtons.push({
        text: 'Info',
        type: 'info',
        items: response.aside[1].items
      });
      cb(null, {
        message: response.main[0],
        manageButtons
      });
    }
  });
}

function unfollow(options, callback) {
  var cb = callback || _.noop;
  return relationsController.unfollow(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      var manageButtons = response.combined[2].items[0].items;
      manageButtons.push({
        text: 'Info',
        type: 'info',
        items: response.aside[1].items
      });
      cb(null, {
        message: response.main[0],
        manageButtons
      });
    }
  });
}

function block(options, callback) {
  var cb = callback || _.noop;
  return relationsController.block(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      var manageButtons = response.combined[2].items[0].items;
      manageButtons.push({
        text: 'Info',
        type: 'info',
        items: response.aside[1].items
      });
      cb(null, {
        message: response.main[0],
        manageButtons
      });
    }
  });
}

function unblock(options, callback) {
  var cb = callback || _.noop;
  return relationsController.unblock(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      var manageButtons = response.combined[2].items[0].items;
      manageButtons.push({
        text: 'Info',
        type: 'info',
        items: response.aside[1].items
      });
      cb(null, {
        message: response.main[0],
        manageButtons
      });
    }
  });
}

// ---------
// interface
// ---------

export {
  get,
  follow,
  unfollow,
  block,
  unblock
};
