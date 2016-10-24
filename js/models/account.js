'use strict';

import * as _ from 'underscore';
import * as accountController from '../controllers/account';

// ----------------
// public methods
// ----------------

function getLanguages(options, callback) {
  var cb = callback || _.noop;
  return accountController.getLanguages(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function getLoginFormsData(options, callback) {
  var cb = callback || _.noop;
  return accountController.getLoginFormsData(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, {
        login: response.default.login,
        registration: response.main[0]
      });
    }
  });
}

function login(options, callback) {
  var cb = callback || _.noop;
  return accountController.login(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      if (response.main[0].color === 'danger') {
        cb(response.main[0].texthtml);
      } else {
        cb(null, {
          username: response.head.username
        });
      }
    }
  });
}

function restorePassword(options, callback) {
  var cb = callback || _.noop;
  return accountController.restorePassword(options, (err, response) => {
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

function getFeeds(options, callback) {
  var cb = callback || _.noop;
  return accountController.getFeeds(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      let rows = _.filter(response.main, (item) => {
          return item.type !== 'pagination' && item.type !== 'heading';
        }),
        pager = _.findWhere(response.main, {type: 'pagination'}),
        menuItems = response.combined[0],
        manageButtons = response.combined[3]
          && response.combined[3].items[0]
          && response.combined[3].items[0].items;

      manageButtons = manageButtons || [];
      if (response.aside[1].items) {
        manageButtons.push({
          text: 'Info',
          type: 'info',
          items: response.aside[1].items
        });
      }

      cb(null, {
        menuItems,
        rows,
        pager: pager && pager.url,
        manageButtons
      });
    }
  });
}

function getProfile(options, callback) {
  var cb = callback || _.noop;
  return accountController.getProfile(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, {
        menuItems: response.combined[0],
        formData: response.main[0]
      });
    }
  });
}

function getRemoveImageForm(options, callback) {
  var cb = callback || _.noop;
  return accountController.getRemoveImageForm(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function removeAvatar(options, callback) {
  var cb = callback || _.noop;
  return accountController.removeAvatar(options, (err, response) => {
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

function removePoster(options, callback) {
  var cb = callback || _.noop;
  return accountController.removePoster(options, (err, response) => {
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

function suggestRequest(options, callback) {
  var cb = callback || _.noop;
  return accountController.suggestRequest(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function save(options, callback) {
  var cb = callback || _.noop;
  return accountController.save(options, (err, response) => {
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

function getPasswordForm(options, callback) {
  var cb = callback || _.noop;
  return accountController.getPasswordForm(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, {
        menuItems: response.combined[0],
        formData: response.main[0]
      });
    }
  });
}

function passwordSave(options, callback) {
  var cb = callback || _.noop;
  return accountController.passwordSave(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function getEmailPhoneForm(options, callback) {
  var cb = callback || _.noop;
  return accountController.getEmailPhoneForm(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, {
        menuItems: response.combined[0],
        formData: _.where(response.main, {type: 'form'})
      });
    }
  });
}

function getPersonalForm(options, callback) {
  var cb = callback || _.noop;
  return accountController.getPersonalForm(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, {
        menuItems: response.combined[0],
        formData: response.main[0]
      });
    }
  });
}

function personalSave(options, callback) {
  var cb = callback || _.noop;
  return accountController.personalSave(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function history(options, callback) {
  var cb = callback || _.noop;
  return accountController.history(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      let rows = _.filter(response.main, (item) => {
          return item.type !== 'pagination' && item.type !== 'heading';
        }),
        pager = _.findWhere(response.main, {type: 'pagination'});

      cb(null, {
        rows,
        pager: pager && pager.url
      });
    }
  });
}

function checkUsername(options, callback) {
  var cb = callback || _.noop;
  return accountController.checkUsername(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      if (response.error) {
        cb(response.error);
      } else {
        cb(null, null);
      }
    }
  });
}

function checkPassword(options, callback) {
  var cb = callback || _.noop;
  return accountController.checkPassword(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      if (response.error) {
        cb(response.error);
      } else if (response.warning) {
        cb(null, response);
      } else {
        cb(null, null);
      }
    }
  });
}

function checkEmail(options, callback) {
  var cb = callback || _.noop;
  return accountController.checkEmail(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      if (response.error) {
        cb(response.error);
      } else {
        cb(null, null);
      }
    }
  });
}

function checkPhone(options, callback) {
  var cb = callback || _.noop;
  return accountController.checkPhone(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      if (response.error) {
        cb(response.error);
      } else {
        cb(null, null);
      }
    }
  });
}

function getTerms(options, callback) {
  var cb = callback || _.noop;
  return accountController.getTerms(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function registration(options, callback) {
  var cb = callback || _.noop;
  return accountController.registration(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      var main = response.main[0];
      if (main.color === 'danger') {
        cb(main.texthtml);
      } else {
        cb(null, {
          username: response.head.username,
          menu: response.head.menu,
          texthtml: main.texthtml
        });
      }
    }
  });
}

function addEmail(options, callback) {
  var cb = callback || _.noop;
  return accountController.addEmail(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function emailResendCode(options, callback) {
  var cb = callback || _.noop;
  return accountController.emailResendCode(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function emailActivate(options, callback) {
  var cb = callback || _.noop;
  return accountController.emailActivate(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function getRemoveEmailPhoneForm(options, callback) {
  var cb = callback || _.noop;
  return accountController.getRemoveEmailPhoneForm(options, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response.main[0]);
    }
  });
}

function removeEmailPhone(options, callback) {
  var cb = callback || _.noop;
  return accountController.removeEmailPhone(options, (err, response) => {
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

// ---------
// interface
// ---------

export {
  getLanguages,
  getLoginFormsData,
  login,
  restorePassword,
  getFeeds,
  getProfile,
  getRemoveImageForm,
  removeAvatar,
  removePoster,
  suggestRequest,
  save,
  getPasswordForm,
  passwordSave,
  getEmailPhoneForm,
  getPersonalForm,
  personalSave,
  history,
  checkUsername,
  checkPassword,
  checkEmail,
  checkPhone,
  getTerms,
  registration,
  addEmail,
  emailResendCode,
  emailActivate,
  getRemoveEmailPhoneForm,
  removeEmailPhone
};
