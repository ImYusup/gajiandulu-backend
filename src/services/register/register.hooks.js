const validate = function(...fields) {
  return function validate(context) {
    fields.map(field => {
      if (context.data[field] === '' || typeof field === 'undefined') {
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
    create: [validate('full_name', 'password', 'date_of_birth', 'email')],
    update: [validate('full_name', 'date_of_birth', 'email')],
    patch: [],
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
