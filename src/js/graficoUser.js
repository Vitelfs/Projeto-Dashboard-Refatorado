import Firebase from "./firebase.js";

google.charts.load('current', {'packages':['corechart']});

google.charts.setOnLoadCallback(drawChartPizza);
google.charts.setOnLoadCallback(drawChartColumn);
//google.charts.setOnLoadCallback(drawChartPie);


function getEmail(){

    return new Promise((resolve, reject) => {
        Firebase.getInstance().getAuth().onAuthStateChanged(function(user) {
            if (user) {
                const userEmail = user.email;
                console.log("Email do usuário autenticado:", userEmail);
                resolve(userEmail);
            } else {
                console.log("Nenhum usuário autenticado");
                reject("Nenhum usuário autenticado");
            }
        });
    });
}

async function getUserName(){
    const userEmail = await getEmail();
    const userDb = await Firebase.getInstance().getDb().collection('usuarios');
    const userLogado = await userDb.where('email', '==', userEmail).get();
    const userData = userLogado.docs[0].data();
    const userDono = userData.nome;

    return userDono;
}
async function drawChartPizza() {


    const clientesRef = Firebase.getInstance().getDb().collection('clientes');
    const clienteUser = await clientesRef.where('userDono', '==', await getUserName()).get();
 
    const clienteUserDoc = clienteUser.docs;

    const clienteCpf = clienteUserDoc.filter(doc => doc.data().cpf !== '');
    const clienteCnpj = clienteUserDoc.filter(doc => doc.data().cnpj !== '');

    const cpfNum = clienteCpf.length;
    const cnpjNum = clienteCnpj.length;

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
        ['Com CPF', cpfNum],
        ['Com CNPJ', cnpjNum],
    ]);

    var options = {'title':'Clientes CPF/CNPJ Cadastrados',
                    'width': 600,
                    'height':500};

    var chart = new google.visualization.PieChart(document.getElementById('chart_div_pizza'));
    chart.draw(data, options);
}

async function drawChartColumn() {
    
    const clientesRef = await Firebase.getInstance().getDb().collection('clientes');
    const clienteUser = await clientesRef.where('userDono', '==', await getUserName()).get();


    const estados = clienteUser.docs.map(doc => doc.data().estado);

    const clientesPorEstado = estados.reduce((acc, estado) => {
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
    }, {});

    const dadosGrafico = Object.entries(clientesPorEstado);

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Estado');
    data.addColumn('number', 'Quantidade');
    data.addRows(dadosGrafico);

    var options = {
        'title': 'Clientes por Estado',
        'width': 600,
        'height': 500
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div_column'));
    chart.draw(data, options);
}