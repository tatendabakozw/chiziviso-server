const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    full_name:{
        type: String,
        required: [true, 'Full name is required']
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)