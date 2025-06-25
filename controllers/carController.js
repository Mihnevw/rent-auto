const carService = require('../services/carService');

exports.getAllCars = async (req, res) => {
    try {
        const cars = await carService.getAllCars();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const car = await carService.getCarById(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.json(car);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCar = async (req, res) => {
    try {
        let carData = req.body;
        if (req.file) {
            carData.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
        const car = await carService.createCar(carData);
        res.status(201).json(car);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const car = await carService.updateCar(req.params.id, req.body);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.json(car);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await carService.deleteCar(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.json({ message: 'Car deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCarLocation = async (req, res) => {
    try {
        const { locationId } = req.body;
        if (!locationId) {
            return res.status(400).json({ error: 'Location ID is required' });
        }
        
        const car = await carService.updateCarLocation(req.params.id, locationId);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.json(car);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};