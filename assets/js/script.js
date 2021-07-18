// aciona a função load após todo o HTML estiver carregado
document.addEventListener("DOMContentLoaded", load);

/*a função load é a primeira a ser carregada. Vai receber o form do HTML através do evento submit
em seguida a função newTask é invocada e passa como parâmetro o próprio formulário*/
function load() {
    toRecoverStorage();
    setInterval(clock, 1000);
    today();
    // recebe o formulário do HTML
    var form_task = document.getElementById("form-task");
    /* função que está esperando um evento do tipo submit, que pode ser acionado via click do mouse no
    botão memorizar ou um enter do teclado*/
    form_task.addEventListener("submit", function(event){ 
        // invoca a função newTask enviado como parâmetro todo o formulário capturado
        newTask(form_task);
        // desabilita o submit do formulário, evitando erros e reload na página
        event.preventDefault();
    });
  }
  

/* função recebe o formulário, extrai o valor do input para a variável new_task
verifica se o input foi preenchido (new_task), chama a função createNewElements()) para criar os elementos que 
compõe a lista de tarefas, limpa o campo input, chama a função saveTasksInLocalStorage() para gravar os dados 
no logcalStorage e caso o input tenha vindo em branco, um alerta com aviso é enviao para a tela */
function newTask(form_task) {
    var new_task = form_task[0].value;  
    if (new_task){
        createNewElements(new_task);
        form_task[0].value = ""; 
        saveTasksInLocalStorage();
    }else{
        alert("Você precisa digitar alguma coiusa para que eu possa armazenar!");
    }
}
/* função que faz a persistência dos dados no localStorage. 1º busca todos os elementos da div list-tasks,
depois percorre estes elementos extraindo o texto e verificando se exite na div que engloba cada item da lista
as classes "row row-item strike-out-text". Se sim, então o status é marcado como True, se não o status é marcado como False.
O status é uma marcação para o sistema riscar a tarefa ou não no momento que os dados são lidos no localStorage */
function saveTasksInLocalStorage(){
    var list_tasks = window.document.getElementById("list-tasks");
    var contents_json = "";
    /* essa variável evita que o último elemento a ser cadastrado no localStorage vá com uma vírgula no final. 
    Evitando erros na persistência dos dados no localStorage */
    var last_item = (list_tasks.children.length) - 1;
    var status;
    
    for (i=0; i<list_tasks.children.length; i++){
        status = list_tasks.children[i].className;
        if (status == "row row-item strike-out-text"){
            status = 1;
        } else{
            status = 0;
        }

        if (i < last_item){
            contents_json = contents_json + `{ "task":"${list_tasks.children[i].innerText}", "status": ${status}},`;
        } else {
            contents_json = contents_json + `{ "task":"${list_tasks.children[i].innerText}", "status": ${status}}`;
        }
        
    }

    // prepara a string no formato JSON
    var tasks_for_storage = '{"tasks":['+ contents_json +']}';

    // persiste os dados no localStorage
    localStorage.setItem('myTasks', JSON.stringify(tasks_for_storage));
    
}

/* função que é invocada toda vez que a página é carregada. Verifica se tem dados gravados no localStorage, se sim
então busca estes dados, transforma os dados em objeto, percorre o objeto e envia os dados para a função createNewElements()
para que possa ser exibido na tela */
function toRecoverStorage(){
    if (localStorage.getItem('myTasks')){
        var get_tasks_storage = JSON.parse(localStorage.getItem('myTasks'));
        var obj_tasks = JSON.parse(get_tasks_storage);
        // esta vaiável só facilita um pouco a manipulação do objeto
        obj_tasks = obj_tasks.tasks;
        var new_task;
        var status;

        for (i=0; i<obj_tasks.length; i++){
            new_task = obj_tasks[i].task;
            status = obj_tasks[i].status;
            createNewElements(new_task, status);
        }
    }  
}

/* essa função é responsável por criar os elementos que serão exibidos na tela. Primeiro cria os elementos,
depois adiciona atributos, classes, IDs e funções aos elementos, verifica o status para tomar a decisão se o texto
da tarefa será riscado ou não, adiciona os elementos filhos nos elementos pais e no final busca a nova lista de tarefas
para reeditar de forma crescente os ids de cada tarefa. Isso foi necessário, pois ao deletar e posteriormente criar novas tarefas 
os ids acabavam sendo repetidos fazendo com que o sistema ficasse inconsistente*/
function createNewElements(new_task, status=0){
    // criando os elementos
    var list_tasks = window.document.getElementById("list-tasks");
    var text_span = window.document.createElement("span");
    var input_checkbox = window.document.createElement("input");
    var div_task = window.document.createElement("div");
    var div_input_span = window.document.createElement("div");
    var div_btn_del = window.document.createElement("div");
    var btn_del = window.document.createElement("img");
    
    // adicionando atributos, classes , e IDs nos novos componentes HTML
    text_span.classList.add("text_span");
    btn_del.setAttribute("onclick", "deleteItem("+list_tasks.children.length+")");
    btn_del.setAttribute("src", "assets/images/delete.png");
    btn_del.classList.add("btn-delete");
    input_checkbox.setAttribute("type", "checkbox");
    input_checkbox.setAttribute("onclick", "checkedItem("+list_tasks.children.length+")");
    div_input_span.classList.add("col-md-10");
    div_btn_del.classList.add("col-md-1");
    div_task.setAttribute("id", list_tasks.children.length);
    div_task.classList.add("row", "row-item");

    // verifica se o status é True para riscar o texto
    if (status){
        div_task.classList.add("row", "row-item", "strike-out-text");
        input_checkbox.setAttribute("checked", "checked");
    }
    // adiciona o texto da tarefa entre as tags <span></span>
    text_span.innerText = new_task;
    // adiciona os elementos filhos aos elementos pais
    div_input_span.appendChild(input_checkbox);
    div_input_span.appendChild(text_span);
    div_btn_del.appendChild(btn_del);
    div_task.appendChild(div_input_span);
    div_task.appendChild(div_btn_del);
    list_tasks.appendChild(div_task);

    // reorganiza os ids para cada novo item criado, iportante para não haver duplicidade de ids
    var list = window.document.getElementById("list-tasks");
    for(j=0; j < list.children.length; j++){
        list.children[j].setAttribute("id", j);
    }
}


/* função que deleta uma tarefa quando clicado no botão lixeira e posteriormente uma nova lista é salva no localStorage */
function deleteItem(id){
    var del_div = window.document.getElementById(id);
    del_div.parentNode.removeChild(del_div);
    saveTasksInLocalStorage();
}

/* risca o texto dentro das tags <span></span>, depois salva a nova lista agora com a tarefa riscada, ou seja status = True */
function checkedItem(id){
    var strike_out = window.document.getElementById(id);
    strike_out.classList.toggle("strike-out-text");
    saveTasksInLocalStorage();
}

/* função que exibe as horas na tela */
function clock(){
    var hours = new Date();
    var h = String(hours.getHours());
    var m = String(hours.getMinutes());
    var s = String(hours.getSeconds())

    // estes ifs são para acrescentar um zero antes dos números menores que 10
    if (h.length == 1){
        h = "0"+h;
    }
    if (m.length == 1){
        m = "0"+m;
    }
    if (s.length == 1){
        s = "0"+s;
    }

    window.document.querySelector(".clock").innerText = h+":"+m+":"+s;;
}


/* funão que exibe na tela a data */
function today(){
    var today = new Date();
    var day_week = today.getDay();
    var day_month = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    var day_of_week = ["domiingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    var month_year = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        
    window.document.querySelector(".day").innerText = day_of_week[day_week]+", "+day_month+" de "+month_year[month]+" de "+year;
    
}
