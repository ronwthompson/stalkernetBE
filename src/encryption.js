const bcrypt = require('bcrypt-as-promised')


module.exports = {
    promiseHash (password) {
        return bcrypt.genSalt(10, 8).then(salt => {
            return bcrypt.hash(password, salt)
        })
    },
    promiseCompare (plainPass,hashedPass) {
        return bcrypt.compare(plainPass, hashedPass)
    }
}

