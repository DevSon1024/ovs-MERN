import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import electionRoutes from './routes/electionRoutes.js';
import partyRoutes from './routes/partyRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js'; // Import candidate routes
import path from 'path';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api/users', userRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/parties', partyRoutes);
app.use('/api/candidates', candidateRoutes); // Add candidate routes

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));