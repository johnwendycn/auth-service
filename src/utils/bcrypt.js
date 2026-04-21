const bcrypt = require('bcrypt');
const ROUNDS = 12;

module.exports = {
  hash: (plain) => bcrypt.hash(plain, ROUNDS),
  compare: (plain, hash) => bcrypt.compare(plain, hash),
};
