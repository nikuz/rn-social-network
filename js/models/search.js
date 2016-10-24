'use strict';

import * as _ from 'underscore';
import * as searchController from '../controllers/search';

// ----------------
// public methods
// ----------------

function search(options, callback) {
  var cb = callback || _.noop;
  return searchController.search(options, function(err, response) {
    if (err) {
      cb(err);
    } else {
      var empty = response.main[0] && response.main[0].color === 'warning' ? response.main[0] : null;
      cb(null, {
        users: !empty ? _.where(response.aside, {type: 'user'}) : [],
        posts: !empty ? response.main : [],
        empty,
        more: response.combined[0]
      });
    }
  });
}

function extendedSearch(options, callback) {
  var cb = callback || _.noop;
  return searchController.extendedSearch(options, function(err, response) {
    if (err) {
      cb(err);
    } else {
      let rows = _.filter(response.main, (item) => {
          return item.type !== 'pagination'
            && item.type !== 'heading'
            && item.user !== undefined;
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

// ---------
// interface
// ---------

export {
  search,
  extendedSearch
};
