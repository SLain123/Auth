const { Schema, model } = require('mongoose');

const schema = new Schema({
    label: { type: String, required: true },
    total: { type: Number, required: true },
    activateDate: { type: Date, required: true },
    timeToEnd: { type: Schema.Types.Mixed },
    restTime: { type: Number, required: true },
    ownerId: { type: String, required: true },
    ownerNick: { type: String, required: true },
});

module.exports = model('Timer', schema);
