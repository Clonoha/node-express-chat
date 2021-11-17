const mongoose = require('mongoose');

const utilisateurSchema = mongoose.Schema({
    user_pseudo: {type: String, required: true},
    socket_id: {type: String, required: true}  
});

module.exports = mongoose.model('Utilisateur', utilisateurSchema);