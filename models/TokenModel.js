const {Schema, model} = require("mongoose");


const refreshToken = new Schema({
    refreshToken: {
        type: String,
        require: true
    },
    user: {
        type: String
    }
})

module.exports = model("RefreshToken", refreshToken)