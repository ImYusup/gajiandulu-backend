const response = (msg, data, included, link) => ({
  message: `${msg} successfully!`,
  data,
  included,
  link
});

module.exports = response;
