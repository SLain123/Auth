const express = require('express');
const { Router } = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();
const PORT = config.get('port') || 5000;
const MONGOURI = config.get('mongoURI');

app.use(express.json({ extended: true }));
app.use('/api/auth', require('./routes/auth.routes'));

async function start() {
    try {
        await mongoose.connect(MONGOURI, {
            useUnifiedTopology: true,
        });
        app.listen(PORT, () => console.log(`Node works on port: ${PORT}`));
    } catch (e) {
        console.log(`Error: ${e.message}`);
        process.exit(1);
    }
}

start();
