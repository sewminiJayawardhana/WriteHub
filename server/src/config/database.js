const mongoose = require('mongoose');

const connectDatabase = async () => {
	const { MONGO_URI } = process.env;

	if (!MONGO_URI) {
		throw new Error('MONGO_URI environment variable is not defined');
	}

	try {
		const connection = await mongoose.connect(MONGO_URI, {
			bufferCommands: false,
			autoIndex: true,
		});
		console.log(`MongoDB connected ✅: ${connection.connection.host}`);
		return connection;
	} catch (error) {
		console.error('Failed to connect to MongoDB', error);
		throw error;
	}
};

module.exports = connectDatabase;
