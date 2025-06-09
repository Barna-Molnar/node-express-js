const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs/promises');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
// const User = require('./models/user');
const mongoose = require('mongoose');
const User = require('./models/user');

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

        app.use(async (req, res, next) => {
            if (!req.session.user) {
              return next();
            }
            try {
                const user = await User.findById(req.session.user._id);
                req.user = user;
                next();
            } catch (err) {
                console.log(err);
            }
          });
          
          app.use((req, res, next) => {
            res.locals.isLoggedIn = req.session.isLoggedIn;
            res.locals.csrfToken = req.csrfToken();
            next();
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