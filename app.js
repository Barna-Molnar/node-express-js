const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
// const User = require('./models/user');
const mongoose = require('mongoose');
const User = require('./models/user');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // set the views directory

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

app.use((req, res, next) => {
    User.findById('682ad496608187c07bf3ca42')
        .then(user => {
            // console.log('user from request',JSON.stringify(user))
            req.user = user; // store user in all incoming request
            next(); // go on with the next step
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

app.use('/', errorController.pageNotFound);

mongoose
    .connect("mongodb+srv://hanta911:Bazdmeg@node-cluster.lsrn2ml.mongodb.net/shop?retryWrites=true&w=majority&appName=Node-Cluster")
    .then(result => {
        console.log('Connected to client... ');
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Barna M',
                        email: 'm.brown@mongoose.com',
                        cart: { items: [] }
                    });
                    user.save();
                }
            });

        app.listen(PORT, () => console.log('Server is runnint at port ', + PORT));

    })
    .catch(err => { console.log(err); });
