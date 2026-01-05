const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    orientation: {
        type: String,
        enum: ['portrait', 'landscape'],
        required: true
    },
    inputPrompt: {
        type: String,
        required: true
    },
    logo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
    },
    logoPosition: {
        type: String,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
    },
    subjectPosition: {
        type: String,
    },
    reference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
    },
    // enhancedPrompt: {
    //     type: String,
    //     required: true
    // },
    styleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StylePreset',
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'complete', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', ProjectSchema);
