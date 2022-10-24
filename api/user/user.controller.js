const User = require('./user.model');
const jwt = require('jsonwebtoken');
const log = require('../../utils/log.utils');
const { get } = require('../../utils/auth.utils'); 
const { generateToken } = require('../../utils/telegram.utils'); 

const register = async(req, res) => {
    log.post("register")

    if (req.body && req.body.email && req.body.name && req.body.password) {
        log.content(req.body, "null")
        let user = new User(req.body);
        user.password = await user.encryptPassword(user.password);
        user.telegramId = generateToken()

        log.debug("User", user)
        try {
            await user.save()
            log.debug("CREATED", user)

            const token = jwt.sign({id: user._id}, process.env.KEY, {
                expiresIn: 60 * 60 * 24
            })

            return res.status(201).json({
                message: `User created successfully`,
                data: user,
                token: token
            });

        } catch(err) {
            let message = (err.code == 11000) ? "Duplicate Key Error" : "Internal Server Error on Saving"
            log.error(err)

            return res.status(500).json({
                message,
                code: err.code,
                error: err
            });
        }
    } else return res.status(400).json({ message: "Fields required are null" });
}

const login = async(req, res) => {
    log.post("login")

    if (req.body && req.body.email) {
        log.content(req.body)
        try {
            let user = await User.findOne({'email': req.body.email})
            log.debug("FINDED", user)

            let valid = await user.validatePassword(req.body.password);
            if(valid) {
                const token = get(user._id)

                res.status(200).json({
                    message: `Users loged successfully`,
                    data: user,
                    token: token
                });
            } else {
                log.error({ code: 403, message: "Invalid credentials"})
                res.status(403).json({
                    message: `Invalid credentials`,
                    code: 403,
                    error: null
                });
            }
    
        } catch(err) {
            log.error(err)

            res.status(500).json({ 
                message: "Internal Server Error On Finding", 
                code: 500,
                error: err 
            })
        };
    } else return res.status(400).json({ message: "User not received" });
}

const refreshToken = async(req, res) => {
    log.post("refresh")
    log.content("null", req.params.id)
    
    try {   
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({
            message: `User ${req.params.id} not found`,
            code: 404
        })
        const token = get(user._id)
        
        res.status(201).json({
            message: "User Token updated successfully",
            data: user,
            token: token
        });
    } catch(err) { 
        log.error(err)

        res.status(500).json({ 
            message: "Internal Server Error On Finding", 
            code: err.code,
            error: err 
        })
    }    
}

module.exports = { register, login, refreshToken }