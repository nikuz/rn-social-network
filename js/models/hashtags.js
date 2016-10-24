'use strict';

import * as _ from 'underscore';
import * as hashtagsController from '../controllers/hashtags';

// ----------------
// public methods
// ----------------

function getFeeds(options, callback) {
  var cb = callback || _.noop;
  return hashtagsController.get(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      let rows = _.filter(response.main, (item) => {
          return item.type !== 'pagination' && item.type !== 'heading';
        }),
        pager = _.findWhere(response.main, {type: 'pagination'});

      cb(null, {
        default: response.default || {},
        head: response.head || {},
        combined: response.combined || [],
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
  getFeeds
};
