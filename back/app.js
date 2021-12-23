const express = require('express');
const bodyParser = require('body-parser');  
const app = express();
const mongoose = require('mongoose');
const path = require('path');  

const userRoutes = require('./routes/user');
const routesSauce = require('./routes/sauce'); 

mongoose.connect('mongodb+srv://elias:ocdev2021@cluster0.zycwu.mongodb.net/sauce?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' }); 
 });
 
  app.use(bodyParser.json()) 

  app.use('/api/sauces', routesSauce);   
  app.use('/api/auth', routesUsers); 

  app.use('/api/auth', userRoutes);

module.exports = app;