'use strict';

import * as _ from 'underscore';
import * as messagesController from '../controllers/messages';

// ----------------
// public methods
// ----------------

function getList(options, callback) {
  var cb = callback || _.noop;
  return messagesController.getList(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      var rows = _.where(response.main, {type: 'letters'}),
        pager = _.findWhere(response.main, {type: 'pagination'});

      if (!rows.length) {
        rows = _.where(response.aside, {type: 'letters'});
      }
      if (!pager) {
        pager = _.findWhere(response.aside, {type: 'pagination'});
      }

      cb(null, {
        rows,
        pager: pager && pager.url
      });
    }
  });
}

function getListByUser(options, callback) {
  var cb = callback || _.noop;
  return messagesController.getListByUser(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      var rows = _.where(response.main, {type: 'letter'}),
        form = _.findWhere(response.main, {type: 'form'}),
        refresh = _.findWhere(response.main, {type: 'refresh'}),
        pager = _.findWhere(response.main, {type: 'pagination'});

      cb(null, {
        rows,
        form,
        refresh,
        pager: pager && pager.url
      });
    }
  });
}

function getRemoveForm(options, callback) {
  var cb = callback || _.noop;
  return messagesController.getRemoveForm(options, (err, response) => {
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
  return messagesController.remove(options, (err, response) => {
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

function add(options, callback) {
  var cb = callback || _.noop;
  return messagesController.add(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      var rows = _.where(response.main, {type: 'letter'}),
        refresh = _.findWhere(response.main, {type: 'refresh'}),
        pager = _.findWhere(response.main, {type: 'pagination'});

      cb(null, {
        rows,
        refresh,
        pager: pager && pager.url
      });
    }
  });
}

function refresh(options, callback) {
  var cb = callback || _.noop;
  return messagesController.refresh(options, (err, response) => {
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
  getList,
  getListByUser,
  getRemoveForm,
  remove,
  add,
  refresh
};
