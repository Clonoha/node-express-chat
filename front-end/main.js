

(function () {
    const server = 'http://127.0.0.1:3000'
    const socket = io(server);

    socket.on('notification', (data) => {
        console.log('Message depuis le serveur:', data);
    })

    fetch(`${server}/test`).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data, "ici");
    })

    //Récupération de l'historique des messages
    fetch(`${server}/historique`).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data, "coucou");
        const liste = document.getElementById("list")
        data.forEach(element => {
            const li = document.createElement("li")
        li.innerText = `${element.user_pseudo} : ${element.text}`
        liste.appendChild(li)
        })
        
    })

    //Récupération du nombre de messages
    fetch(`${server}/countMessages`).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data, "nombre");
        const chat = document.getElementById("chat")
        const chatTitle = document.getElementById("chat-title")
        const countMessage = document.createElement("h2")
        countMessage.innerText = "Nombre de messages : " + data;
        chat.insertBefore(countMessage, chatTitle )
    })

    //Récupération du nombre de messages par utilisateur
    fetch(`${server}/countMessages/byUser`).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data, "countUser");
        const tab = document.getElementById("tab")
        const members = document.getElementById("member")
        data.forEach(element => {
            const messagesByUser = document.createElement("li")
        messagesByUser.innerText = `Nombre de messages de ${element._id} : ${element.count}`;
        members.appendChild(messagesByUser)
        })
    })

    let loginBtn = document.getElementById("login_btn")
    loginBtn.addEventListener("click", handleClickLoginBtn)

    function handleClickLoginBtn(e){
        e.preventDefault();
        let pseudo = document.getElementById("pseudo")       
        socket.emit("login", {
            pseudo:pseudo.value
        })

        
    }

    let sendBtn = document.getElementById("send_btn");
    sendBtn.addEventListener("click", handleClickSendBtn)

    //Récupération de l'élément liste (ul) des messages
    let liste = document.getElementById("list")    
    
    function handleClickSendBtn(e){
        e.preventDefault()
        console.log(e)
        let pseudo = document.getElementById("pseudo")
        
        let message = document.getElementById("message")
        
        console.log(message, "message")
        socket.emit("canal-gen", {
            message: message.value,
            pseudo: pseudo.value
        }) 
        //Création de tous les éléments nécessaires pour l'affichage dans le canal général

        //Div pour le pseudo
        let divName = document.createElement("div")
        divName.className = "name";
        let spanName = document.createElement("span")
        spanName.innerHTML = `${pseudo.value}`
        divName.innerHTML = `${spanName.innerText}`
        

        //Div pour le message
        let divMessage = document.createElement("div");
        divMessage.className = "message";
        divMessage.innerHTML = `<p>${message.value}</p>`
        //J'ai essayé de créer tous ces éléments pour que l'affichage soit beau, mais c'est raté :-|
        

        //Récupération de la liste des messages pour l'affichage
        let liste = document.getElementById("list")
        socket.on("canal-gen", (message)=> {
            console.log(message)
            console.log(divName.innerText)
            let user = document.createElement("li")
            user.innerHTML = `${divName.innerText}
            ${divMessage.innerText}`;
            liste.appendChild(user)
            
        })
        
    }
    
})()