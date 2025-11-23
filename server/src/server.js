require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDatabase = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

const allowedOrigins = process.env.CLIENT_URL
	? process.env.CLIENT_URL.split(',').map((origin) => origin.trim())
	: [];

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
			return callback(null, true);
		}
		return callback(new Error('Not allowed by CORS'));
	},
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		await connectDatabase();
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error('Failed to start server', error);
		process.exit(1);
	}
};

startServer();

module.exports = app;
