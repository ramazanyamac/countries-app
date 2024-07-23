import express from 'express';
import dotenv from 'dotenv';
import pageRoute from './router/pageRoute.js';
import countryRoute from './router/countryRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

// routes
app.use('/', pageRoute);
app.use('/countries', countryRoute);

// 404 page
app.use((req, res, next) => {
  res.status(404).render('404');
});

app.listen(port, () => {
  console.log('listening on port', port)
})