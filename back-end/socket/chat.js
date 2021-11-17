const sUtilisateur = require('../models/utilisateur')
const sMessage = require('../models/message')
const cors = require('cors')



module.exports = function (io) {
  

  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    io.emit('notification', { type: 'new_user', data: socket.id });

    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });

  

socket.on("login", (user)=>{  
  const utilisateur = new sUtilisateur({
    user_pseudo: user.pseudo,
    socket_id: socket.id    
  })
  console.log(utilisateur)

  // Création de l'objet "utilisateur" de Mongoose (schéma)
  utilisateur
          .save()         
          .catch((error) => {
            console.log(error)
          });
});

    // On écoute les messages envoyés dans le canal "général"
socket.on('canal-gen', (msg) => { 
  
  // Création de l'objet "message" de Mongoose (schéma)
  const message = new sMessage({
      user_pseudo: msg.pseudo,
      text: msg.message
  });
  console.log(message)
  message
          .save()        
          .catch((error) => {
            console.log(error)
          });
  io.emit("canal-gen", message)
});
  })
}