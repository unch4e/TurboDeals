const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    images: {
        type: [String],
        set: (images) => images.map(image => image.startsWith('/uploads') ? image : `/uploads/${image}`),
    },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    mileage: { type: Number, required: true },
    fuelType: { type: String, required: true },
    description: { type: String, default: '' },
    images: { type: [String], default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Car', CarSchema);
