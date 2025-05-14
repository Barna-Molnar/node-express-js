const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const connectToMongo = require('./utils/database').mongoConnect;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const User = require('./models/user');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // set the views directory

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

app.use((req, res, next) => {
    User.findById('682422f1ba6533b6dfe778cc')
        .then(user => {
            console.log('user from request',JSON.stringify(user))
            req.user = new User({username: user.username, email: user.email, cart: user.cart, id: user._id }); // store user in all incoming request
            next(); // go on with the next step
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

app.use('/', errorController.pageNotFound);

connectToMongo(() => {
    console.log('Connected to client... ');
    app.listen(PORT, () => console.log('Server is runnint at port ', + PORT));
});
