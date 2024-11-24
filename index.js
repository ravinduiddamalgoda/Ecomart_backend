const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(express.json());
//app.use(cookieParser());
dotenv.config({ path: './.env' });


dotenv.config();

// Set up Multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, path.join(__dirname, '../uploads')); // Upload directory
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

const port = process.env.PORT || 3400;
const url = process.env.MONGODB_URL;
app.use(express.static('./public'));

async function connectDB(url, connectionParams) {
    await mongoose.connect(url, connectionParams);
    console.log('Database Connected');
}

app.use(cors());

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

connectDB(url, {})
    .then(() => {
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Connection Error', err);
});

app.use('/api/user', require('./src/routes/user.route'));
app.use('/api/auth' , require('./src/routes/auth.route'));
app.use('/api/item', require('./src/routes/item.route'));
app.use('/api/bid', require('./src/routes/bid.route'));
