const {Schema, model} = require("mongoose");


const refreshToken = new Schema({
    refreshToken: {
        type: String,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = model("RefreshToken", refreshToken)