require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb+srv://bhargavkalambhe64:fswdca@fswdca2.j0d3h.mongodb.net/";

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Movie Schema & Model
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: { type: String, required: true },
    releaseYear: { type: Number },
    availableCopies: { type: Number, required: true },
});

const Movie = mongoose.model('Movie', movieSchema);

// Routes

// Create a new movie
app.post('/movies', async (req, res) => {
    try {
        const { title, director, genre, releaseYear, availableCopies } = req.body;
        if (!title || !director || !genre || availableCopies === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const movie = new Movie({ title, director, genre, releaseYear, availableCopies });
        await movie.save();
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

// Get all movies or a specific movie by ID
app.get('/movies/:id?', async (req, res) => {
    try {
        if (req.params.id) {
            const movie = await Movie.findById(req.params.id);
            if (!movie) return res.status(404).json({ message: 'Movie not found' });
            return res.json(movie);
        }
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

// Update movie details
app.put('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

// Delete a movie
app.delete('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
