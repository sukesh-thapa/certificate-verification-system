const Certificate = require('../models/Certificate');
const XLSX = require('xlsx');


const uploadCertificates = async (req, res) => {
    try {
        // Check if the file is received
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send({ message: 'No files were uploaded.' });
        }

        const file = req.files.excelfile;

        // Check if the file is present
        if (!file || !file.data) {
            return res.status(400).send({ message: 'File data is not available.' });
        }

        // Read the file using xlsx
        const workbook = XLSX.read(file.data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const data = XLSX.utils.sheet_to_json(sheet);
        console.log('Excel Data:', data);

        // Save to the database or process the data here
        await Certificate.insertMany(data);
        res.send({ message: 'File uploaded successfully.', data });
        console.log(data);
        
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send({ message: 'Error uploading file.' });
    }
};

const getCertificatebyID = async (req, res) => {
    try {
        const { certificateID } = req.params; // Get the ID from params
        console.log('Requested certificate ID:', certificateID); // Log the params for debugging

        // Case-insensitive search for certificate
        const certificate = await Certificate.findOne({
            certificateID: { $regex: new RegExp(certificateID, "i") }
        });

        console.log('Certificate query result:', certificate);

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found!' });
        }

        res.status(200).json(certificate);
    } catch (error) {
        console.error('Error retrieving certificate:', error);
        res.status(500).json({ message: 'Server error while retrieving certificate' });
    }
};


module.exports = {uploadCertificates, getCertificatebyID};