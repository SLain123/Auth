const express = require('express');
const mongoose = require('mongoose');
const formData = require('express-form-data');
const dotenv = require('dotenv');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGOURI =
    process.env.MONGO_URI ||
    'mongodb+srv://Admin:12345s@cluster0.nwqfl.mongodb.net/multiTimer?retryWrites=true&w=majority';

app.use(express.json({ limit: '1mb', extended: true }));
app.use(
    express.urlencoded({
        extended: true,
        limit: '1mb',
        parameterLimit: 1000,
    }),
);
app.use(formData.parse());
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/timer', require('./routes/timers.routes'));
app.use('/api/search', require('./routes/search.routes'));

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
