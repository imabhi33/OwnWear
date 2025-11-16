const jwt = require('jsonwebtoken');

const generateToken = (user, jwtSecret, expiresIn='30d')=>{
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn });
}

module.exports = generateToken;

