const express = require('express');
const router = express.Router();
const {uploadCertificates, getCertificatebyID} = require('../controllers/certificateController');

//Route to upload certificates from Excel
router.post('/upload', uploadCertificates);

//Route to get certificate by ID
router.get('/:certificateID', getCertificatebyID);

// Backend - routes/certificates.js
router.post('/validate', async (req, res) => {
    const { certificateID } = req.body;
    if (!certificateID) {
        return res.status(400).json({ message: 'Certificate ID is required.' });
    }

    try {
        const certificate = await Certificate.findOne({ certificateID });
        if (!certificate) {
            return res.status(404).json({ message: 'Invalid Certificate ID.' });
        }
        res.status(200).json({ valid: true, certificate });
    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ message: 'Server error during validation.' });
    }
});


module.exports = router;