const mongoose = require('mongoose');

function connectDB() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error(
            "MongoDB connection string (MONGODB_URI) is not set in the .env file. " +
            "The backend will start, but any database operations will fail until this is configured."
        );
        return;
    }

    mongoose
        .connect(uri)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.log("MongoDB connection error:", err);
        });
}

module.exports = connectDB;