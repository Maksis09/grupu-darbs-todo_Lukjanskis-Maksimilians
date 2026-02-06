let task_list = document.getElementById("task-list");
let dropdown = document.getElementById('dropdown');
let selected_priority = "Zema";
let selected_badge_style = "bg-secondary";

function Create(){
  
    const lista = document.createElement("li");
    lista.classList.add("list-group-item","d-flex","justify-content-between", "align-items-center");
       
    let badge = document.createElement('span');
    badge.innerText = selected_priority;
    badge.classList.add('badge', selected_badge_style, 'py-2');
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

dropdown.onchange = function() {
    selected_priority = dropdown.value;
    console.log(selected_priority);
    dropdown.classList.remove('btn-secondary');
    dropdown.classList.remove('btn-warning');
    dropdown.classList.remove('btn-danger');
    
    if (selected_priority == "Zema") {
        selected_badge_style = "bg-secondary";
        dropdown.classList.add('btn-secondary');
    } else if (selected_priority == "Vidēja") {
        selected_badge_style = "bg-warning";
        dropdown.classList.add('btn-warning');
    } else {
        selected_badge_style = "bg-danger";
        dropdown.classList.add('btn-danger');
    }
    
}
