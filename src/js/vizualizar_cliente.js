import Firebase from "./firebase.js";

//Singleton

class VizualizarCliente {

    constructor() {
        this.db = Firebase.getInstance().getDb();
    }

    static getInstance() {
        if (!VizualizarCliente.instance) {
            VizualizarCliente.instance = new VizualizarCliente();
        }
        return VizualizarCliente.instance;
    }

    async getDonoNome(){

        return new Promise((resolve, reject) => {
            Firebase.getInstance().getAuth().onAuthStateChanged(async (user) => {
                if (user) {
                    const userEmail = user.email;
                    const userDb = this.db.collection('usuarios');
                    try {
                        const querySnapshot = await userDb.where('email', '==', userEmail).get();
                        querySnapshot.forEach((doc) => {
                            const userData = doc.data();
                            resolve(userData.nome);
                        });
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error("Nenhum usuario autenticado."));
                }
            });
        });
    }
    async FvizualizarCliente() {
        try {
            const donoNome = await this.getDonoNome();
            console.log(donoNome);
    
            const clientesDb = this.db.collection('clientes');
            const clientes = await clientesDb.where('userDono', '==', donoNome).get();
    
            const clienteMap = clientes.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return clienteMap;
        } catch (error) {
            console.error("Não foi possivel obter os dados: ", error);
        }
    }

    async preencherTabela(){

        const vizualizarCliente = await this.FvizualizarCliente();
        const ul = document.getElementById('clientes');	

        vizualizarCliente.forEach(cliente => {

            const clienteLi = document.createElement('li');
            clienteLi.setAttribute('class', 'item-list');

            const clienteNomeP = document.createElement('p');
            clienteNomeP.setAttribute('class', 'item');
            clienteNomeP.textContent = `${cliente.nome}`;
            console.log(clienteNomeP);

            const clienteRamoP = document.createElement('p');
            clienteRamoP.setAttribute('class', 'item');
            clienteRamoP.textContent = `${cliente.ramo}`;

            const clienteEmailP = document.createElement('p');
            clienteEmailP.setAttribute('class', 'item');
            clienteEmailP.textContent = `${cliente.email}`;

            const clienteEnderecoP = document.createElement('p');
            clienteEnderecoP.setAttribute('class', 'item');
            clienteEnderecoP.textContent = `${cliente.endereco}`;

            const clienteEstadoP = document.createElement('p');
            clienteEstadoP.setAttribute('class', 'item');
            clienteEstadoP.textContent = `${cliente.estado}`;


            const clienteTelP = document.createElement('p');
            clienteTelP.setAttribute('class', 'item');
            clienteTelP.textContent = `${cliente.telefone}`;

            const clienteCpfCnpjP = document.createElement('p');
            clienteCpfCnpjP.setAttribute('class', 'item');

            if(cliente.cpf == ""){
                clienteCpfCnpjP.textContent = `${cliente.cnpj}`;
            }else if(cliente.cnpj == ""){
                clienteCpfCnpjP.textContent = `${cliente.cpf}`;
            }else{
                clienteCpfCnpjP.textContent = `${cliente.cpf}`;
            }

            const imgDiv = document.createElement('div');
            imgDiv.setAttribute('class', 'img-div');

            const imgEdit = document.createElement('img');
            imgEdit.setAttribute('class','icon');
            imgEdit.setAttribute('src','../css/main/img/edit.png');
            

            const imgDelete = document.createElement('img');
            imgDelete.setAttribute('class','icon');
            imgDelete.setAttribute('src','../css/main/img/remove.png');
    

            imgDiv.appendChild(imgEdit);
            imgDiv.appendChild(imgDelete);

            clienteLi.appendChild(clienteNomeP);
            clienteLi.appendChild(clienteEmailP);
            clienteLi.appendChild(clienteCpfCnpjP);
            clienteLi.appendChild(clienteEnderecoP);
            clienteLi.appendChild(clienteRamoP);
            clienteLi.appendChild(clienteEstadoP);
            clienteLi.appendChild(clienteTelP);
            clienteLi.appendChild(imgDiv);

            ul.appendChild(clienteLi); 
            
        })
    }
}

VizualizarCliente.getInstance().preencherTabela();
