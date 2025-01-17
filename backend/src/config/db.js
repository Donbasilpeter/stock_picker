import mongoose from 'mongoose';

// MongoDB connection initializer
const initializeDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err; // Propagate error to the calling code
  }
};

export default initializeDatabase;
