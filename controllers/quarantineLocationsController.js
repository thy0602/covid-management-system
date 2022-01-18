const express = require("express");
const router = express.Router();
const quarantineLocationModel = require('../models/quarantineLocationModel');

// Store new location
router.post('/new', async (req, res) => {
    const location = req.body;
    console.log('get /quarantine-location/new location: ', location);

    try {
        const result = await quarantineLocationModel.add(location);
        console.log('get /quarantine-locations/new result: ', result);
        res.redirect('/quarantine-locations');
    } catch (error) {
        console.log('Error post /quarantine-locations/new: ', error);
        res.status(400).send(error);
    }
});

// Update location
router.post('/:locationId/edit', async (req, res) => {
    const locationId = req.params.locationId;
    const location = req.body;

    console.log('post /quarantine-location/:locationId/edit locationId: ', locationId);
    console.log('post /quarantine-location/:locationId/edit location: ', location);

    try {
        const result = await quarantineLocationModel.updateByLocationId(locationId, location);
        console.log('post /quarantine-location/:locationId/edit result: ', result);
        res.redirect('/quarantine-locations');
    } catch (error) {
        console.log('Error post /quarantine-location/:locationId/edit: ', error);
        res.status(400).send(error);
    }
});

// Delete location
router.post('/:locationId/delete', async (req, res) => {
    const locationId = req.params.locationId;
    const data = req.body;
    console.log('post /quarantine-location/:locationId/delete locationId: ', locationId);
    console.log('post /quarantine-location/:locationId/delete data: ', data);

    try {
        const result = quarantineLocationModel.updateByLocationId(locationId, data);
        res.json(result);
    } catch (error) {
        console.log('Error post /quarantine-location/:locationId/delete: ', error);
        res.status(400).send(error);
    }
})


// Get a location info by locationId (json)
router.get('/:locationId', async (req, res) => {
    const locationId = req.params.locationId;
    console.log('get /quarantine-locations/:locationId locationId: ', locationId);

    try {
        const location = await quarantineLocationModel.getByLocationId(locationId);
        res.json(location);
    } catch (error) {
        console.log('Error post /quarantine-locations/:locationId: ', error);
        res.status(404).send(error);
    }
});

// Get list of all locations
router.get('/', async (req, res) => {
    try {
        const locationList = await quarantineLocationModel.getAll();
        res.render('location/location', {
            locationList
        });
    } catch (error) {
        console.log('Error get /quarantine-locations: ', error);
        res.status(404).send(error);
    }
    
});

module.exports = router;
