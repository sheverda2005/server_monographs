const jwt = require("jsonwebtoken")
const RefreshToken = require("../models/TokenModel")
class TokensService {
    generateTokens (user) {
        const accessToken = jwt.sign(user, process.env.SERTER_KEY_ACCESS_TOKEN, {expiresIn: "10s"})
        const refreshToken = jwt.sign(user, process.env.SERTER_KEY_REFRESH_TOKEN, {expiresIn: "30d"})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveRefreshToken (refreshToken, email) {
        const existToken = await RefreshToken.findOne({user: email})
        if (existToken) {
            existToken.refreshToken = refreshToken
            return  await existToken.save();
        }
        const refreshTokenForDB = new RefreshToken({refreshToken, user: email})
        console.log(refreshTokenForDB)
        const result = await refreshTokenForDB.save()
    }

    compareRefreshToken (refreshToken) {
        try {
           const data = jwt.verify(refreshToken, process.env.SERTER_KEY_REFRESH_TOKEN, null, null)
           return data;
        } catch (e) {
            console.log(e)
        }
    }

    compareAccessToken (accessToken) {
        try {
            const data = jwt.verify(accessToken, process.env.SERTER_KEY_ACCESS_TOKEN, null, null)
            return data;

        } catch (e) {
            console.log(e)
        }
    }

    async findToken (refreshToken) {
        try {
            const tokenRefreshFromDB = await RefreshToken.findOne({refreshToken})
            return tokenRefreshFromDB;
        } catch (e) {
        }
    }

    async removeToken (refreshToken) {
        const tokenData = await RefreshToken.deleteOne({refreshToken})
        return tokenData;
    }

}

module.exports = new TokensService()