const Movie = require('../models/Movie');
const Review = require('../models/Review');

// lägg till en ny film
exports.addMovie = async (req, res) => {
    try {
        const { title, director, releaseYear, genre } = req.body;
        const newMovie = new Movie({ title, director, releaseYear, genre });
        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// hämta alla filmer
exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// hämta en specifik film med ID
exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// uppdatera en specifik film med ID
exports.updateMovie = async (req, res) => {
    try {
        const { title, director, releaseYear, genre } = req.body;
        const movie = await Movie.findByIdAndUpdate(req.params.id, { title, director, releaseYear, genre }, { new: true });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// radera en specifik film med ID
exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// hämta genomsnittliga betyg och antal recensioner per film
exports.getMovieRatings = async (req, res) => {
    try {
        const ratings = await Review.aggregate([
            { 
                $addFields: { 
                movieObjectId: { $toObjectId:'$movieId' }
            }
        },
            {
                $group: {
                    _id: '$movieObjectId',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'movies',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'movie'
                }
            },
            {
                $unwind: '$movie'
            },
            {
                $project: {
                    movieId: '$movie._id',
                    title: '$movie.title',
                    director: '$movie.director',
                    genre: '$movie.genre',
                    releaseYear: '$movie.releaseYear',
                    averageRating: { $round: ['$averageRating', 1] },
                    totalReviews: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};