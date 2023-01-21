const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const TokenService = require('../services/TokensService')
class UserService {
    async registrationService(email, name, password, lastName, surName, res) {
        const candidate = await User.findOne({email})
        if (candidate) {
            return res.status(400).json({message: 'Такий користувач уже існує'})
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const activationLink = uuid.v4()
        const user = new User({email, password: hashPassword, activationLink, name, surName, lastName})
        await user.save()
        const userData = {
            email: user.email,
            ActivationLink: user.activationLink,
            name: user.name,
            surName: user.surName,
            lastName: user.lastName,
            id: user.id,
            isActivated: user.isActivated
        }
        const tokens = TokenService.generateTokens(userData)
        await TokenService.saveRefreshToken(tokens.refreshToken, userData.email)
        return {
            ...tokens,
            userData
        }
    }

    async loginService (email, password, res) {
        try {
            const existUser = await User.findOne({email})
            if (!existUser) {
            return res.status(400).json({
                message: "Такого користувача не існує"
            })
            }
            const comparePassword = await bcrypt.compare(password, existUser.password)
            if (!comparePassword) {
                return res.status(400).json({message: "Паролі не співпадають"})
            }
            const userData = {
                email: existUser.email,
                ActivationLink: existUser.activationLink,
                name: existUser.name,
                surName: existUser.surName,
                lastName: existUser.lastName,
                id: existUser.id,
                isActivated: existUser.isActivated
         }
            const tokens = TokenService.generateTokens(userData)
            await TokenService.saveRefreshToken(tokens.refreshToken, userData.email)
            return {
                ...tokens,
                 userData
            }

        } catch (e) {
            console.log(e)
        }
    }
    async refresh (refreshToken, res) {
        try {
            if (!refreshToken) {
                return res.status(400).json({message: "Рефреш не знайдений" + refreshToken})
            }
            const compareToken = TokenService.compareRefreshToken(refreshToken)
            const user = await User.findOne({email: compareToken.email})
            const tokenFromDB = TokenService.findToken(refreshToken)
            if (!compareToken || !tokenFromDB) {
                return res.status(400).json({message: "Токени не співпадають"})
            }
            const userData = {
                email: user.email,
                ActivationLink: user.activationLink,
                name: user.name,
                surName: user.surName,
                lastName: user.lastName,
                id: user.id,
                isActivated: user.isActivated
            }
            const tokens = TokenService.generateTokens(userData)
            await TokenService.saveRefreshToken(tokens.refreshToken, userData.email)
            return {
                ...tokens,
                userData
            }

        } catch (e) {

        }
    }

    async checkToken (accessToken, res) {
        try {
            if (!accessToken) {
                res.status(400).json({message: "Немає токена"})
            }
            const compareToken = TokenService.compareAccessToken(accessToken)
            if (!compareToken) {
                res.status(401).json({message: "Токен не співпадає"})
            }
            const user = await User.findOne({email: compareToken.email})
            const userData = {
                email: user.email,
                ActivationLink: user.activationLink,
                name: user.name,
                surName: user.surName,
                lastName: user.lastName,
                id: user.id,
                isActivated: user.isActivated
            }
            const tokens = TokenService.generateTokens(userData)
            return {
                ...tokens,
                userData
            }


        } catch (e) {
        }
    }

    async logout (refreshToken) {
        try {
            const token = await TokenService.removeToken(refreshToken)
            return token

        } catch (e) {

        }
    }

}

module.exports = new UserService()

