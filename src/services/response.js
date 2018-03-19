const response = (status, msg, data, included) => ({
  status,
  msg,
  data,
  included
});

module.exports = response;
