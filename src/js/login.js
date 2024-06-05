import Firebase from "./firebase.js";

//Factory Method


class usuario {
    constructor(user) {
        this.user = user;
    }
    redirecionar() {
        
    }
}
class admin extends usuario {
    redirecionar() {
        window.location.href = "./src/pages/mainadmin.html";
    }
}

class usuario_cliente extends usuario {
    redirecionar() {
        window.location.href = "./src/pages/mainuser.html";
    }
}

class usuario_fabrica {
    static criarUsuario(user) {
        if (user.tipo === 'admin') {
            return new admin(user);
        } else if (user.tipo === 'cliente') {
            return new usuario_cliente(user);
        } else {
            throw new Error("Erro, não existe esse usuário");
        }
    }
}

function redirecionar_usuario(user_email) {


    const db = Firebase.getInstance().getDb();

    db.collection('usuarios').where('email', '==', user_email).get()
        .then((colecao) => {
            if (!colecao.empty) {
                colecao.forEach(doc => {
                    const userData = doc.data();
                    const userInstance = usuario_fabrica.criarUsuario(userData);
                    userInstance.redirecionar();
                });
            } else {
                console.log("Nenhum documento encontrado para o usuário!");
            }
        })
        .catch((error) => {
            console.error("Erro ao obter o documento do usuário:", error);
        });
}

document.getElementById("btnLogin").addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    Firebase.getInstance().getAuth().signInWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Login bem-sucedido:", user.email);
            redirecionar_usuario(user.email);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Erro de login:", errorCode, errorMessage);
        });
});

Firebase.getInstance().getAuth().onAuthStateChanged((user) => {
    if (user) {
        redirecionar_usuario(user.email);
    }
});