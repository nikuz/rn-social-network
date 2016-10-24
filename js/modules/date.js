'use strict';

// ----------------
// public methods
// ----------------

function compensation(number) {
  if (number < 10) {
    number = '0'+number;
  }
  return number;
}

// ---------
// interface
// ---------

export {
  compensation
};
