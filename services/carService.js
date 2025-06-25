const Car = require('../models/carModel');

async function getAllCars() {
    return await Car.find().populate('currentLocation');
}

async function getCarById(id) {
    return await Car.findById(id).populate('currentLocation');
}

async function createCar(carData) {
    const car = new Car(carData);
    return await car.save();
}

async function updateCar(id, carData) {
    return await Car.findByIdAndUpdate(id, carData, { new: true }).populate('currentLocation');
}

async function deleteCar(id) {
    return await Car.findByIdAndDelete(id);
}

async function updateCarLocation(carId, locationId) {
    return await Car.findByIdAndUpdate(
        carId,
        { currentLocation: locationId },
        { new: true }
    ).populate('currentLocation');
}

module.exports = {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    updateCarLocation
};