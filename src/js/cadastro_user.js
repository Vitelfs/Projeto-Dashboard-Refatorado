import Firebase from "./firebase.js";

//Singleton

class CadastrarUser {

    constructor() {
        this.db = Firebase.getInstance().getDb();
        this.auth = Firebase.getInstance().getAuth();
    }

    async getDb () {
        return this.db
    }
    async getAuth () {
        return this.auth
    }
    async cadastrarUser() {

        const senhaInput = document.getElementById('senha');
       
        const user = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            senha: document.getElementById("senha").value,
            tipo: document.getElementById("tipoUsuario").value,
            valor: document.getElementById("valorUsuario").value
        }

        const confirmSenha = document.getElementById('confirmSenha').value;

        if (user.senha !== confirmSenha) {
            this.showMessage('As senhas não correspondem.', 'error');
            return;
        }

        if (!this.validatePassword(user.senha)) {
            this.showMessage('A senha é muito fraca. Use pelo menos 8 caracteres com letras maiúsculas, minúsculas, números e símbolos.', 'error');
            return;
        }

        senhaInput.addEventListener('input', function() {
            const senha = senhaInput.value;
            if (senha.length === 0) {
                senhaInfo.textContent = '';
            } else {
                if (validatePassword(senha)) {
                    senhaInfo.textContent = 'Senha forte.';
                    senhaInfo.classList.remove('weak');
                    senhaInfo.classList.add('strong');
                } else {
                    senhaInfo.textContent = 'Senha fraca. Use pelo menos 8 caracteres com letras maiúsculas, minúsculas, números e símbolos.';
                    senhaInfo.classList.remove('strong');
                    senhaInfo.classList.add('weak');
                }
            }
        });

        Firebase.getInstance().getAuth().createUserWithEmailAndPassword(user.email, user.senha);
        this.salvarUserDb(user);
        alert("Cadastrado com sucesso!");

        document.getElementById("nome").value = "";
        document.getElementById("email").value = "";
        document.getElementById("senha").value = "";
        document.getElementById("confirmSenha").value = "";
   }

   async salvarUserDb(user) {

        let userTipoFormatado;
        let valorAluguel;
        if(user.tipo === 'administrador') {
            userTipoFormatado = 'admin';
        }
        else{
            userTipoFormatado = "cliente";
            if(user.valor == "1"){
                valorAluguel = 50;
            } else if(user.valor == "2"){
                valorAluguel = 100;
            }
            else if(user.valor == "3"){
                valorAluguel = 150;
            }
        }
        
        if(userTipoFormatado === 'admin'){
            const admin = {
                nome: user.nome,
                email: user.email,
                tipo: userTipoFormatado,
            }

            await this.db.collection('usuarios').add(admin);
            console.log("Admin Cadastrado");
        }
        else{
            const userT = {
                nome: user.nome,
                email: user.email,
                tipo: userTipoFormatado,
                valorAluguel: valorAluguel
            }
            await this.db.collection('usuarios').add(userT);
            console.log("User Cadastrado");
        }
   }
   validatePassword(password) {
    return password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    }

    showMessage(message, type) {
        const mensagemDiv = document.getElementById('mensagem');
        mensagemDiv.textContent = message;
        mensagemDiv.className = type;
        setTimeout(function() {
            mensagemDiv.textContent = '';
            mensagemDiv.className = '';
        }, 5000);
    }
}

document.getElementById("tipoUsuario").addEventListener("change", (event) => {
    if(document.getElementById('tipoUsuario').value == "cliente"){
        document.getElementById('valorUsuario').style.display = "inline";
    }	
});

document.getElementById("btnCadastrar").addEventListener("click", (event) => {
    event.preventDefault();
    const cadastrarUser = new CadastrarUser();
    cadastrarUser.cadastrarUser();
})