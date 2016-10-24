'use strict';

import * as mainController from '../controllers/main';

// ----------------
// public methods
// ----------------

function getInitialData(options, callback = () => {}) {
  return mainController.getInitialData(options, (err, response) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        default: response.default || {},
        head: response.head || {},
        combined: response.combined || [],
        languages: response.main[0].items
      });
    }
  });
}

// ---------
// interface
// ---------

export {
  getInitialData
};
