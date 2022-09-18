const jwt = require('jsonwebtoken');
require('dotenv').config();

const verify = (req, res, next) => {
    const token = req.headers['x-access-token']
    if(!token) {
        return res.status(403).json({ message: "No token provider" })
    }

    const decoded = jwt.verify(token, process.env.KEY)
    req.id = decoded.id
    next()
}

const get = (id) => {
    return jwt.sign({id: id}, process.env.KEY, {
        expiresIn: 60 * 60 * 24
    })
}

module.exports = { verify, get }