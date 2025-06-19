const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs/promises');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');

global.__rootdir = __dirname; // A common convention is `__basedir` or `__rootdir`
const PORT = process.env.PORT || 8080;
const app = express();
const csrfProtection = csrf();

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

        app.use(csrfProtection);
        app.use(flash());

        app.use((req, res, next) => {
            res.locals.isLoggedIn = req.session.isLoggedIn;
            res.locals.csrfToken = req.csrfToken();
            next();
        });

        app.use(async (req, res, next) => {
            if (!req.session.user) { return next(); }

            try {
                const user = await User.findById(req.session.user._id);

                if (!user) { return next(); }

                req.user = user;
                next();

            } catch (err) {
                // inside callbacks or catch blocks you have to use next to throw through the errors
                next(new Error(err));
            }
        });

        app.use('/admin', adminRoutes);
        app.use('/', shopRoutes);
        app.use('/', authRoutes);

        app.use('/500', errorController.error500);
        app.use('/', errorController.pageNotFound);

        app.use((error, req, res, next) => {
            console.log('Special error middleware in app.js', { error });
            // res.redirect('/500');
            res.status(500).render('500', {
                pageTitle: 'Error!',
                path: '/500',
                isLoggedIn: req.session.isLoggedIn
            });
        });

        app.listen(PORT, () => console.log('Server is runnint at port ', + PORT));

    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
}

start();