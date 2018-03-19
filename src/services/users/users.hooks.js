// const { authenticate } = require('@feathersjs/authentication').hooks;
//
// const {
//   hashPassword,
//   protect
// } = require('@feathersjs/authentication-local').hooks;
const omit = require('lodash.omit');

const protect = function(...fields) {
  return function protect(context) {
    const result = context.dispatch || context.result;
    const o = current => {
      const data =
        typeof current.toJSON === 'function' ? current.toJSON() : current;
      return omit(data.data.users, fields);
    };

    if (!result) {
      return context;
    }

    if (Array.isArray(result)) {
      context.dispatch = result.map(o);
    } else if (result.data && context.method === 'find') {
      context.dispatch = Object.assign({}, result, {
        data: result.data.map(o)
      });
    } else {
      context.dispatch = o(result);
    }

    if (context.params && context.params.provider) {
      context.result = context.dispatch;
    }

    return context;
  };
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
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
