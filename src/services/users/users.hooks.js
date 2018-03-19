// const { authenticate } = require('@feathersjs/authentication').hooks;
//
// const {
//   hashPassword,
//   protect
// } = require('@feathersjs/authentication-local').hooks;

const validate = function(...fields) {
  return function validate(context) {
    fields.map(field => {
      if (
        context.data.data[field] === '' ||
        typeof context.data.data[field] === 'undefined'
      ) {
        throw new Error(`${field} is required!`);
      }
    });

    return context;
  };
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [validate('hash', 'phone', 'consent')],
    patch: [validate('hash', 'phone', 'consent')],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
