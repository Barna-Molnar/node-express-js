const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./utils/database');

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController =  require('./controllers/error')

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs'); 
app.set('views', 'views'); // set the views directory

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

db.execute('SELECT * FROM products')
    .then(result => {
        console.log(result[0]);
    })
    .catch(err => {
        console.log('Error while fetching data from database : ', err);
    })

app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
app.use('/', errorController.pageNotFound);

app.listen(PORT, () => console.log('Server is runnint at port ', + PORT));