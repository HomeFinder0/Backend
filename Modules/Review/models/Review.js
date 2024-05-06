const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    residenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Residence' },
    userId     : { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    rating     : { type: Number, required: true },
    comment    : { type: String },
    likes      : { type: Number, default: 0 },
    likedUsers  : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }]
},{
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
