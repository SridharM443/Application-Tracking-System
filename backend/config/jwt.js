const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

const verifyToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
