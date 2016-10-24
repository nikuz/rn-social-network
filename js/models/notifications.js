'use strict';

import * as _ from 'underscore';
import * as notificationsController from '../controllers/notifications';

// ----------------
// public methods
// ----------------

function getNotifications(options, callback) {
  var cb = callback || _.noop;
  return notificationsController.getNotifications(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      var rows = _.where(response.main, {type: 'notification'}),
        pager = _.findWhere(response.main, {type: 'pagination'});

      cb(null, {
        rows,
        pager: pager && pager.url
      });
    }
  });
}

// ---------
// interface
// ---------

export {
  getNotifications
};
