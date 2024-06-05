import Firebase from "./firebase.js";

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChartPizza);
google.charts.setOnLoadCallback(drawChartColumn);


async function drawChartColumn(){

    const userRef = Firebase.getInstance().getDb().collection('usuarios');
    const userBasic = await userRef.where('valorAluguel', '==', 50).get();
    const userIntermedium = await userRef.where('valorAluguel', '==', 100).get();
    const userAdvanced = await userRef.where('valorAluguel', '==', 150).get();  

    const basic = userBasic.size;
    const intermedium = userIntermedium.size;
    const advanced = userAdvanced.size;

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', '');
    data.addColumn({type: 'string', role: 'annotation'});
    data.addColumn({type: 'string', role: 'style'});
    data.addRows([
        ['Basico', basic,'Basico', '#00BCD4'], 
        ['Intermediário', intermedium,'Intermediário', '#E91E63'], 
        ['Avançado', advanced,'Avançado', '#FFEB3B'], 
    ]);

    var options = {'title':'Usuários por plano',
                    'width':700,
                    'height':500};

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div_column'));
    chart.draw(data, options);
    

    
}
async function drawChartPizza() {

    
    const userRef = Firebase.getInstance().getDb().collection('usuarios');
    const clientesRef = Firebase.getInstance().getDb().collection('clientes');

    const adminNumber = await userRef.where('tipo', '==', 'admin').get();
    const userNumber = await userRef.where('tipo', '==', 'cliente').get();
    const clientesNumber = await clientesRef.get();

    const admins = adminNumber.size;
    const users = userNumber.size;
    const clients = clientesNumber.size;

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
        ['Administradores', admins],
        ['Usuários', users],
        ['Clientes dos usuários', clients],
    ]);

    var options = {'title':'Usuários/Clientes Cadastrados',
                    'width': 600,
                    'height':500};

    var chart = new google.visualization.PieChart(document.getElementById('chart_div_pizza'));
    chart.draw(data, options);
}