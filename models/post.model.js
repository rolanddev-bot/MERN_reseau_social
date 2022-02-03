const mongoose = require('mongoose');

const PostShema = new mongoose.Schema({
    posterID: {
        type: String,
        trim: true,
        maxlength: 500
    },
    message: {
        type: String,
        trim: true,
        maxlength: 500
    },

    picture: {
        type: String,
    },

    video: {
        type: String,
    },

    lickers: {
        type: [String],
        required: true
    },

    comments: {
        type: [
            {
                commenterId: String,
                commenterPseudo: String,
                text: String,
                timestamp: Number
            }
        ],
        required: true,
    },


},
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('post', PostShema);