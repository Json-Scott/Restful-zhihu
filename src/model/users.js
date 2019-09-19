const mongoose = require('mongoose')
const {
    Schema,
    model
} = mongoose
const userSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    avatar_url: {
        type: String
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male',
        required: true
    },
    headline: {
        type: String
    },
    location: {
        type: [{
            type: String
        }]
    },
    business: {
        type: String
    },
    employment: {
        type: [{
            company: {
                type: String
            },
            job: {
                type: String
            }
        }]
    },
    education: {
        type: [{
            school: {
                type: String
            },
            major: {
                type: String
            },
            diploma: {
                type: Number,
                enum: [1, 2, 3, 4, 5]
            },
            graduation_year: {
                type: Number
            }
        }]
    },
    following: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'users'
        }],
        select: false
    }
})

module.exports = model('users', userSchema)