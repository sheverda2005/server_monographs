const {Schema, model} = require("mongoose");


const user = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    surName: {
        type: String,
        require: true,
    },
    activationLink: {
        type: String
    },
    isActivated: {
        type: Boolean,
        default: false
    }
})

module.exports = model("User", user)