// localStorage.clear();

let task_list = document.getElementById("task-list");
let dropdown = document.getElementById('dropdown');
let text_input = document.getElementById("teksts");

let selected_priority = "Zema";
let selected_badge_style = "bg-secondary";

let todo_index = 0;
let todo_items = {}

// SAVING
/*
    Pārliek visus elementus no todo_items uz compact_items, bet ignorējot null elementus.
*/
function SaveData() {
    let compact_items = {}
    let new_index = 0;
    for (let i=0; i < todo_index; i++) {
        let todo_item = todo_items[i];
        if (todo_item) {
            compact_items[new_index] = todo_item;
            new_index += 1;  
        }
    }
    localStorage.setItem("data", JSON.stringify(compact_items));
}
// LOADING
/*
    Parāda visus list_itemus no localStorage
*/
function LoadData() {
    let local_storage_items = JSON.parse(localStorage.getItem("data"));
    for (let key in local_storage_items) {
        Create(local_storage_items[key]);
    }
}
//
LoadData();
//
function Create(todo_item) {
    let local_priority = selected_priority;
    let local_badge_bg =selected_badge_style;
    let local_done = false;
    let local_text = text_input.value;
    
    if (todo_item) {
        local_priority = todo_item.priority;
        local_badge_bg = todo_item.bg;
        local_done = todo_item.done;
        local_text = todo_item.text;
    }
    
    if (local_text.trim() == "") { return } // Return if text is empty
    
    let local_index = todo_index;
    todo_index += 1;
    
    todo_items[local_index] = {
        text : local_text,
        priority : local_priority,
        bg : local_badge_bg,
        done : local_done,
    }
    
    SaveData();
    // CREATING LIST ITEM
    const lista = document.createElement("li");
    lista.classList.add("list-group-item","d-flex","justify-content-between", "align-items-center");
      
    let badge = document.createElement('span');
    badge.innerText = local_priority;
    badge.classList.add('badge', local_badge_bg, 'py-2');
    lista.appendChild(badge);
    
    let teksts = document.createElement('p');
    teksts.innerHTML = local_text;
    teksts.classList.add("mb-0", 'ps-2', 'flex-grow-1');
    lista.appendChild(teksts);

    const dzest = document.createElement("button")
    dzest.innerText = "Dzēst";
    dzest.classList.add("btn", "btn-outline-danger");
    lista.appendChild(dzest);
    
    // EVENT HANDLERS
    console.log(local_done)
    if (local_done) {
        teksts.classList.toggle('text-decoration-line-through');
    }
    teksts.onclick = function() {
        teksts.classList.toggle('text-decoration-line-through');
        todo_items[local_index].done = !todo_items[local_index].done;
        SaveData();
    }

    dzest.onclick = function() {
        lista.remove();
        todo_items[local_index] = null;
        SaveData();
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
