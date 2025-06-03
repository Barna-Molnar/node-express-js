const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs/promises');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);

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

async function start() {
    try {
        const configPath = path.join(__dirname, 'config.json');
        const fileContent = await fs.readFile(configPath, 'utf-8');
        const mongoDb_uri = JSON.parse(fileContent).mongoDb_uri;
        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoDb_uri);

        const store = new MongoDbStore({
            uri: mongoDb_uri,
            collection: 'sessions'
        });
        // Catch errors during store connection
        store.on('error', function (error) {
            console.error('Session Store Error:', error);
        });

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(express.static(path.join(__dirname, 'public'))); // serve static files
        app.use(session({
            secret: 'my secret',
            resave: false,
            saveUninitialized: false,
            store: store
        }));

        // Fetch user once and attach to request
        app.use(async (req, res, next) => {
            try {
                // Ensure a user exists, if not create one for development
                let user = await User.findById('682ad496608187c07bf3ca42');
                console.log(`Found the user: ${user.name}`);
                if (!user) {
                    console.warn("User '682ad496608187c07bf3ca42' not found. Creating a new one.");
                    user = new User({
                        _id: '682ad496608187c07bf3ca42',
                        name: 'Barna M',
                        email: 'm.brown@mongoose.com',
                        cart: { items: [] }
                    });
                    await user.save(); // Await saving the new user
                    console.log(`Created the user: ${user.name}`);
                }
                req.user = user;
                console.log(`Connected to MongoDB with user: ${user.name}`);
                next();
            } catch (err) {
                console.error("Error fetching or creating user:", err);
                next(err); // Pass error to Express error handler
            }
        });

        app.use('/admin', adminRoutes);
        app.use('/', shopRoutes);
        app.use('/', authRoutes);
        app.use('/', errorController.pageNotFound);

        app.listen(PORT, () => console.log('Server is runnint at port ', + PORT));

    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
}

start();