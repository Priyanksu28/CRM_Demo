const mongoose = require('mongoose');

const connectDB = async () => {
   await mongoose.connect(process.env.MONGODB_URL)
   .then(() => {console.log('DB Connected Successfully')})
   .catch((error) => {
   console.error(' Error connecting to DB:', error.message);
   process.exit(1);
});
}

module.exports = connectDB;