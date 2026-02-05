let task_list = document.getElementById("task-list");

function Create(){
  
    const lista = document.createElement("li");
    lista.classList.add("list-group-item","d-flex","justify-content-between", "align-items-center");
       
    let badge = document.createElement('span');
    badge.innerText = "Zema";
    badge.classList.add('badge', 'bg-secondary', 'py-2');
    lista.appendChild(badge);
    
    let teksts = document.createElement('p');
    teksts.innerHTML = document.getElementById("teksts").value;
    teksts.classList.add("mb-0", 'ps-2', 'flex-grow-1');
    lista.appendChild(teksts);

    const dzest = document.createElement("button")
    dzest.innerText = "Dzēst";
    dzest.classList.add("btn", "btn-danger");
    lista.appendChild(dzest);
    
    teksts.onclick = function() {
        teksts.classList.toggle('text-decoration-line-through');
    }

    dzest.onclick = function() {
        lista.remove();
    }
 
    task_list.appendChild(lista);
}