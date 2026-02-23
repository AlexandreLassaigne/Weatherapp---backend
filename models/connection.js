const mongoose = require("mongoose");

const connectionString = process.env.CONNEXION_STRING;

mongoose
  .connect(connectionString, {
    connectTimeoutMS: 2000,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Erreur MongoDb:", error));
