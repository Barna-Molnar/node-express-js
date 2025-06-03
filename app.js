const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs/promises');
const session = require('express-session');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
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
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false }));

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
app.use('/', authRoutes);

app.use('/', errorController.pageNotFound);

async function start() {
    try {
        const configPath = path.join(__dirname, 'config.json');
        const fileContent = await fs.readFile(configPath, 'utf-8');
        const mongoDb_uri = JSON.parse(fileContent).mongoDb_uri;

        console.log("Connecting to MongoDB...");

        await mongoose.connect(mongoDb_uri);

        const user = await User.findOne();
        if (!user) {
            const user = new User({
                name: 'Barna M',
                email: 'm.brown@mongoose.com',
                cart: { items: [] }
            });
            user.save();
        }
        console.log(`Connected to MongoDB with user: ${user.name}`);
        app.listen(PORT, () => console.log('Server is runnint at port ', + PORT));
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    }
}

start();