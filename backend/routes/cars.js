const express = require('express');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const Car = require('../models/Car');

const router = express.Router();

const upload = multer({ dest: path.join(__dirname, '../uploads/') });

router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
    const { brand, model, year, price, mileage, fuelType, description } = req.body;

    if (!brand || !model || !year || !price || !mileage || !fuelType || !description) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
    }

    try {
        const newCar = new Car({
            brand,
            model,
            year: parseInt(year, 10),
            price: parseFloat(price),
            mileage: parseInt(mileage, 10),
            fuelType,
            description,
            images: req.files.map(file => file.filename), 
            user: req.user.id,
        });

        await newCar.save();
        res.status(201).json(newCar);
    } catch (err) {
        console.error('Błąd dodawania auta:', err.message);
        res.status(500).json({ message: 'Błąd dodawania auta', error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        const updatedCars = cars.map(car => ({
            ...car._doc,
            images: car.images.map(image => `/${image}`), 
        }));

        res.status(200).json(updatedCars);
    } catch (err) {
        console.error('Błąd pobierania samochodów:', err.message);
        res.status(500).json({ message: 'Błąd pobierania samochodów', error: err.message });
    }
});


router.post('/filter', async (req, res) => {
    try {
        const filters = {};

        if (req.body.brand) filters.brand = new RegExp(req.body.brand, 'i');
        if (req.body.model) filters.model = new RegExp(req.body.model, 'i');
        if (req.body.yearFrom) filters.year = { $gte: parseInt(req.body.yearFrom, 10) };
        if (req.body.yearTo) filters.year = { ...filters.year, $lte: parseInt(req.body.yearTo, 10) };
        if (req.body.priceFrom) filters.price = { $gte: parseFloat(req.body.priceFrom) };
        if (req.body.priceTo) filters.price = { ...filters.price, $lte: parseFloat(req.body.priceTo) };
        if (req.body.fuelType) filters.fuelType = req.body.fuelType;

        const cars = await Car.find(filters);
        const updatedCars = cars.map(car => ({
            ...car._doc,
            images: car.images.map(image => `/uploads/${image}`), 
        }));

        res.status(200).json(updatedCars);
    } catch (error) {
        console.error('Błąd filtrowania samochodów:', error.message);
        res.status(500).json({ message: 'Błąd filtrowania samochodów', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Samochód nie znaleziony' });
        }

        car.images = car.images.map(image => `/uploads/${image}`);

        res.status(200).json(car);
    } catch (err) {
        console.error('Błąd podczas pobierania szczegółów samochodu:', err.message);
        res.status(500).json({ message: 'Błąd podczas pobierania szczegółów samochodu', error: err.message });
    }
});


module.exports = router;
