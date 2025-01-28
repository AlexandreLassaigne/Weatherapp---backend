const mongoose = require('mongoose');


const connectionString = process.env.CONNEXION_STRING; 

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
 .then(() => console.log('Database connected'))
 .catch(error => console.error(error));