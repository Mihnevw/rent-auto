const locationService = require('../services/locationService');

exports.getAllLocations = async (req, res) => {
    try {
        const locations = await locationService.getAllLocations();
        res.json(locations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createLocation = async (req, res) => {
    try {
        const location = await locationService.createLocation(req.body);
        res.status(201).json(location);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getLocationById = async (req, res) => {
    try {
        const location = await locationService.getLocationById(req.params.id);
        if (!location) return res.status(404).json({ error: 'Location not found' });
        res.json(location);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const location = await locationService.updateLocation(req.params.id, req.body);
        if (!location) return res.status(404).json({ error: 'Location not found' });
        res.json(location);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteLocation = async (req, res) => {
    try {
        const location = await locationService.deleteLocation(req.params.id);
        if (!location) return res.status(404).json({ error: 'Location not found' });
        res.json({ message: 'Location deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 