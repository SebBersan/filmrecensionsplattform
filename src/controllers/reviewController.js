const Review = require('../models/Review');
const Movie = require('../models/Movie');

// lägg till en ny recension
exports.addReview = async (req, res) => {
    try {
        const { movieId, rating, comment } = req.body;
        const review = new Review({
            movieId,
            userId: req.user.id,
            rating,
            comment,
            createdAt: new Date()
        });
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error });
    }
};

// hämta alla recensioner
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
        .populate('movieId', 'title director releaseYear genre')
        .populate('userId', 'username role');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
};

// hämta en specifik recension med ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
        .populate('movieId', 'title director releaseYear genre')
        .populate('userId', 'username role');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching review', error });
    }
};

//uppdatera en specifik recension med ID
exports.updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findByIdAndUpdate(req.params.id, { rating, comment }, { new: true });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error });
    }
};

// radera en specifik recension med ID
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error });
    }
};

// hämta recensioner för en specifik film med ID
exports.getReviewsByMovieId = async (req, res) => {
    try {
        const reviews = await Review.find({ movieId: req.params.id })
        .populate('userId', 'username')
        .populate('movieId', 'title');
        if (!reviews) {
            return res.status(404).json({ message: 'No reviews found for this movie' });
        }
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
}