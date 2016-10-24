'use strict';

var interactions = new Set();

// ----------------
// public methods
// ----------------

function runAfterInteractions(handler) {
  interactions.add(handler);
}

function clearInteractionHandle() {
  interactions.forEach(function(handler) {
    handler();
  });
  interactions.clear();
}

// ---------
// interface
// ---------

export {
  clearInteractionHandle,
  runAfterInteractions
};
