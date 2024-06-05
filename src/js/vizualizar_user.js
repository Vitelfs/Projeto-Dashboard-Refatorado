import Firebase from "./firebase.js";


//Singleton



class VizualizarUser {
    constructor() {
        this.db = Firebase.getInstance().getDb();
    }

    static getInstance() {
        if (!VizualizarUser.instance) {
            VizualizarUser.instance = new VizualizarUser();
        }
        return VizualizarUser.instance;
    }

    async VizualizarUser() {
        const userRef = this.db.collection('usuarios');
        const userTipo = await userRef.where('tipo', '==', 'cliente').get();
        return userTipo.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async preencherTabela() {
        const vizualizarUser = await this.VizualizarUser();
        const ul = document.getElementById('users');

        vizualizarUser.forEach(user => {
            const li = document.createElement('li');
            li.setAttribute('class', 'item-list');

            const userNome = document.createElement('p');
            userNome.setAttribute('class', 'item');
            userNome.textContent = user.nome;
            li.appendChild(userNome);

            const userEmail = document.createElement('p');
            userEmail.setAttribute('class', 'item');
            userEmail.textContent = user.email;
            li.appendChild(userEmail);

            const userPlano = document.createElement('p');
            userPlano.setAttribute('class', 'item');
            if (user.valorAluguel === 50) {
                userPlano.textContent = 'Basico';
            } else if (user.valorAluguel === 100) {
                userPlano.textContent = 'Intermediário';
            } else if (user.valorAluguel === 150) {
                userPlano.textContent = 'Avançado';
            }
            li.appendChild(userPlano);

            const imgDiv = document.createElement('div');
            imgDiv.setAttribute('class', 'img-div');

            const imgEdit = document.createElement('img');
            imgEdit.setAttribute('class', 'icon');
            imgEdit.setAttribute('src', '../css/main/img/edit.png');
            imgEdit.addEventListener('click', () => {
                
            })

            const imgDelete = document.createElement('img');
            imgDelete.setAttribute('class', 'icon');
            imgDelete.setAttribute('src', '../css/main/img/remove.png');
            imgDelete.addEventListener('click', () => {
                this.deleteUser(user.id);
            })

            imgDiv.appendChild(imgEdit);
            imgDiv.appendChild(imgDelete);

            li.appendChild(imgDiv);

            ul.appendChild(li);
        });
    }

    async deleteUser(id) {
        const userRef = this.db.collection('usuarios');

        if(confirm("Tem certeza que deseja excluir?")){
            await userRef.doc(id).delete();
            window.location.reload();
        }
    }
}

VizualizarUser.getInstance().preencherTabela();
