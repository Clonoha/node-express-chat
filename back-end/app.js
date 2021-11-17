require('dotenv').config();
const express = require('express');
const sMessage = require('./models/message');
const sUtilisateur = require('./models/utilisateur');

// export one function that gets called once as the server is being initialized
module.exports = function (app, server) {

    const mongoose = require("mongoose");
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("DB is OK"))
    .catch(() => console.log("DB failed"));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', '*');
        next();
    });

    app.use(express.json());

    const io = require('socket.io')(server, {
        cors: {
            origin: "http://127.0.0.1:5500",
            methods: ["GET", "POST"]
        }
    })

    require('./socket/chat')(io);

    app.use(function (req, res, next) { req.io = io; next(); });

    app.get('/test', (req, res, next) => {
        res.status(200).json({ hello: 'world' })
    })

    //Récupération du nombre de messages
    app.get('/countMessages', (req, res, next)=>{
        sMessage.count()
        .then((sMessage) => res.status(200).json(sMessage))
        .catch((error) => res.status(400).json({ error }));
    })

    //Récupération du nombre de messages par utilisateur
    app.get('/countMessages/byUser', (req, res, next) => {
        res.status(200);
        sMessage.aggregate([
            { "$group": { _id: "$user_pseudo", count: { $sum: 1 } } }
        ]).then(data => {
            data.name = "nbMessagesUtilisateur";
            res.status(200).json(data);
        });
    })

    //Récupération de l'historique
    app.get('/historique', (req, res, next)=>{
    sMessage
      .find()
      .then((sMessage) => res.status(200).json(sMessage))
      .catch((error) => res.status(400).json({ error }));
    })
}