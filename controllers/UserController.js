const {validationResult} = require("express-validator");
const UserService = require('../services/UserService')

class UserController {
     async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.json({
                    message: 'Ви ввелли некоректі данні',
                    errors: errors.array()
                })
            }
            const {email, name, password, lastName, surName} = req.body
            const data = await UserService.registrationService(email, name, password, lastName, surName, res)
            res.cookie("refreshToken", data.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    
    async login (req, res, next) {
         try {
             const errors = validationResult(req)
             if (!errors.isEmpty()) {
                 return res.json({
                     message: "Ви ввели некоктні данні"
                 })
             }
             const {email, password} = req.body
             const data = await UserService.loginService(email, password, res)
             res.cookie("refreshToken", data.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
             res.setHeader("Set-Cookie", cookie.serialize("refreshToken", data.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true}))
             res.json(data)
             
         } catch (e) {
             next(e)
         }
    }
    
    async refresh (req, res, next) {
         try {
             const {refreshToken} = req.cookies
             const userData = await UserService.refresh(refreshToken, res)
             res.cookie("refreshToken", data.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
             return res.json(userData)
             
         } catch (e) {
             next(e)
         }
    }

    async checkTokens (req, res, next) {
        try {
           const accessToken = req.headers.authorization.split(" ")[1]
           const userData = await UserService.checkToken(accessToken, res)
           return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout (req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await UserService.logout(refreshToken)
            res.clearCookie("refreshToken");
            res.json(token)
        } catch (e) {
            next(e)
        }
    } 
}


module.exports = new UserController();