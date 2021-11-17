const { Schema, model } = require('mongoose');

const schema = new Schema({
    label: { type: String, required: true },
    total: { type: Number, required: true },
    startTime: { type: Date, required: true },
    ownerId: { type: String, required: true },
    ownerNick: { type: String, required: true },
});

module.exports = model('Timer', schema);
