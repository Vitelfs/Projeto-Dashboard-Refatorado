import Firebase from "./firebase.js";


//Singleton


class CadastrarCliente {
    constructor() {
        this.db = Firebase.getInstance().getDb();
        this.auth = Firebase.getInstance().getAuth();
    }

    adicionarCliente(cliente) {
        this.db.collection("clientes").add(cliente);

        alert("Cliente Cadastrado com Sucesso!");
        window.location.reload();
    }

    criarNovoCliente(userDono) {
        const cliente = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            ramo: document.getElementById("ramo").value,
            cpf: document.getElementById("cpf").value,
            telefone: document.getElementById("tel").value,
            estado: document.getElementById("select-estado").value,
            endereco: document.getElementById("endereco").value,
            userDono: userDono
        };
        this.adicionarCliente(cliente);
    }
    vincularClienteAoUser() {
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.criarNovoCliente(user.email);
            }
        })
    }
}

document.getElementById("btnCadastrar").addEventListener("click", (event) => {
    event.preventDefault();
    const cadastrarCliente = new CadastrarCliente();
    cadastrarCliente.vincularClienteAoUser();
})
