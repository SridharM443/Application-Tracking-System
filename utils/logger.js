const getTimestamp = () => {
  return new Date().toISOString();
};

const info = (message) => {
  console.log(`[INFO] ${getTimestamp()} - ${message}`);
};

const error = (message) => {
  console.error(`[ERROR] ${getTimestamp()} - ${message}`);
};

const warn = (message) => {
  console.warn(`[WARN] ${getTimestamp()} - ${message}`);
};

const debug = (message) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${getTimestamp()} - ${message}`);
  }
};

module.exports = {
  info,
  error,
  warn,
  debug
};
