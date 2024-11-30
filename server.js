const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const certificateRoutes = require('./routes/certificateRoutes');
require('dotenv').config();

const app = express();
//middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload());

//MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch(error => {
    console.error('MongoDB connection failed', error);
});

//Routes
app.use('/api/certificates', certificateRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);  
})