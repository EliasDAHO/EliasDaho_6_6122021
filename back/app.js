const express = require('express');

const app = express();
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

mongoose.connect('mongosh "mongodb+srv://elias:ocdev2021@cluster0.tjt2d.mongodb.net/sauce?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

app.use('/api/auth', userRoutes);

module.exports = app;