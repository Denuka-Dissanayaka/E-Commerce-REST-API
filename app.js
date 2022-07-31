const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.options('*', cors());

// Routes
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const errorHandler = require('./helpers/error-handler');
const authJwt = require('./helpers/jwt');

const api = process.env.API_URL;

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {console.log('Database connected')})
    .catch((err) => {console.log(err.message)})

app.use(express.json());
app.use(authJwt);

app.get('/', (req, res) => {
    res.send('hello');
}) 

app.use(`${api}/products`, productRoutes);
app.use(`${api}/categories`, categoryRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/orders`, orderRoutes);

app.use(errorHandler);
 
app.listen(process.env.PORT, () => {
    console.log('server is running');
})
