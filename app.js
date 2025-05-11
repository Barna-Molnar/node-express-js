const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // set the views directory

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user; // store user in all incoming request
        next(); // go on with the next step
    })
    .catch(err =>  console.log(err))
})

app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
app.use('/', errorController.pageNotFound);


Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
    // .sync({ force: true })
    .sync()
    .then((result) => {
        console.log('Database synced successfully');
        return User.findByPk(1)
        
    })
    .then(user => {
        if(!user) {
            console.log('user not found')
            return User.create({name: 'Admin-Barni', email: 'barni.admin@nodeApp.com'})
        }
        return  user
    })
    .then(user => {
        console.log(`Database synced successfully and logged in with User ${user.name}`);
        return user.createCart();
    })
    .then(cart => {
        console.log('Cart created successfully');
        app.listen(PORT, () => console.log('Server is runnint at port ', + PORT));
    })
    .catch((err) => {
        console.log('Error while syncing database : ', err);
    });