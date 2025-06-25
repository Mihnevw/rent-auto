const Location = require('../models/locationModel');

async function getAllLocations() {
    return await Location.find({ isActive: true });
}

async function createLocation(locationData) {
    const location = new Location(locationData);
    return await location.save();
}

async function getLocationById(id) {
    return await Location.findById(id);
}

async function updateLocation(id, locationData) {
    return await Location.findByIdAndUpdate(id, locationData, { new: true });
}

async function deleteLocation(id) {
    // Soft delete by setting isActive to false
    return await Location.findByIdAndUpdate(id, { isActive: false }, { new: true });
}

module.exports = {
    getAllLocations,
    createLocation,
    getLocationById,
    updateLocation,
    deleteLocation
}; 