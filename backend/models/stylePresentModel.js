const mongoose = require('mongoose');

const StylePresetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    promptTemplate: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    icon: { 
        type: String,
        required: true
    },
    // thumbPreview: {
    //     type: String,
    //     required: true
    // }
});

module.exports = mongoose.model('StylePreset', StylePresetSchema);
