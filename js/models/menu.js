'use strict';

import * as menuController from '../controllers/menu';

// ----------------
// public methods
// ----------------

function get(options, callback = () => {}) {
  return menuController.get(options, (err, response) => {
    if (err) {
      callback(err);
    } else {
      callback(null, response.head.menu.items);
    }
  });
}

// ---------
// interface
// ---------

export {
  get
};
