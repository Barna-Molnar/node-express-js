const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const rootDir  = require('./utils/path')
const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs'); 
// app.engine('hbs', hbs.engine)
app.set('views', 'views'); // set the views directory

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

app.use('/admin', adminData.routes);
app.use('/', shopRoutes);

app.use('/', (req, res, next) => {
    console.log('Page not found middleware');
    // chaining fns => send has to be the last one
    // res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
    res.status(404).render('404', { pageTitle: 'Page not found Template'});
});

app.listen(PORT, () => console.log('Server is runnint at port ', + PORT));