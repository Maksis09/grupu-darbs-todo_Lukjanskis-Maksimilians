// localStorage.clear();

// Pievienošanas elementi
let task_list = document.getElementById("task-list");
let dropdown = document.getElementById('dropdown');
let text_input = document.getElementById("teksts");

// Filtru elementi
let visi_filtrs = document.getElementById("visi_filtrs");
let aktivie_filtrs = document.getElementById("aktivie_filtrs");
let pabeigtie_filtrs = document.getElementById("pabeigtie_filtrs");
let selected_filter = "Visi";

// Nepabeigto darbu skaitītājs
let unfinished = document.getElementById('unfinished');
let unfinished_tasks = 0;

// Meklēšana
let search = document.getElementById('search');

// Prioritāte
let selected_priority = "Zema";
let selected_badge_style = "bg-secondary";

let todo_index = 0;
/* TODO ITEMS struktūra 
    todo_items[index] = {
        text : string,
        priority : string,
        bg : string,
        done : boolean,
        list_obj : object,
    };
*/
let todo_items = {};

// SAVING
/*
    Pārliek visus elementus no todo_items uz compact_items, bet ignorējot null elementus.
*/
function SaveData() {
    let compact_items = {};
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
    
    // CREATING LIST ITEM
    const lista = document.createElement("li");
    lista.classList.add("list-group-item","d-flex","justify-content-between", "align-items-center", "shadow-sm");
    lista.setAttribute('Aktivs', true);
    lista.setAttribute('Pabeigts', false);
    
    let badge = document.createElement('span');
    badge.innerText = local_priority;
    badge.classList.add('badge', local_badge_bg, 'py-2', 'shadow');
    lista.appendChild(badge);
    
    let labots_teksts = document.createElement('input');
    labots_teksts.innerHTML = local_text;
    labots_teksts.classList.add("mb-0", 'ps-2', 'flex-grow-1', 'form-control','d-none');
    lista.appendChild(labots_teksts);
    
    let teksts = document.createElement('p');
    teksts.innerHTML = local_text;
    teksts.classList.add("mb-0", 'ps-2', 'flex-grow-1');
    lista.appendChild(teksts);

    const labot = document.createElement("button");
    labot.innerText = "Labot";
    labot.classList.add("btn", "btn-outline-info", "me-2", "shadow-sm");
    lista.appendChild(labot);
    
    const saglabat = document.createElement("button");
    saglabat.innerText = "Saglabāt";
    saglabat.classList.add("btn", "btn-success", "shadow-sm", 'ms-1', "d-none");
    lista.appendChild(saglabat);

    const dzest = document.createElement("button");
    dzest.innerText = "Dzēst";
    dzest.classList.add("btn", "btn-outline-danger", "shadow-sm");
    lista.appendChild(dzest);
    
    todo_items[local_index] = {
        text : local_text,
        priority : local_priority,
        bg : local_badge_bg,
        done : local_done,
        list_obj : lista,
    };
    SaveData();
    
    // EVENT HANDLERS
    
    // Pievienot meklēšanas atribūtus
    lista.setAttribute('Aktivs', true);
    lista.setAttribute('Pabeigts', false);
    lista.setAttribute('ir', true);
        
    // Pievieno svītru ja ielādē datus no localstorage
    if (local_done) {
        teksts.classList.toggle('text-decoration-line-through');
        lista.setAttribute('Aktivs', false);
        lista.setAttribute('Pabeigts', true);
    } else {
        IncrementUnfinishedTasks();
    }
    
    labot.onclick = function() {
        saglabat.classList.remove('d-none');
        labots_teksts.classList.remove('d-none');    
        
        badge.classList.add('d-none');
        labot.classList.add('d-none');
        teksts.classList.add('d-none');
        dzest.classList.add('d-none');
        
        labots_teksts.value = todo_items[local_index].text;
    }
    
    saglabat.onclick = function() {
        // Dzēst ja laiks ir tukšs
        if (labots_teksts.value == "") {
            Remove(lista, local_index);
            return;
        }
        todo_items[local_index].text = labots_teksts.value;
        SaveData();
        
        teksts.innerHTML = labots_teksts.value;
        
        saglabat.classList.add('d-none');
        labots_teksts.classList.add('d-none');    
        
        badge.classList.remove('d-none');
        labot.classList.remove('d-none');
        teksts.classList.remove('d-none');
        dzest.classList.remove('d-none');
    }
    
    teksts.onclick = function() {
        teksts.classList.toggle('text-decoration-line-through');
        if (teksts.classList.contains('text-decoration-line-through')) {
            DecrementUnfinishedTasks();
            lista.setAttribute('Aktivs', false);
            lista.setAttribute('Pabeigts', true);
        } else {
            IncrementUnfinishedTasks();
            lista.setAttribute('Aktivs', true);
            lista.setAttribute('Pabeigts', false);
        }
        
        todo_items[local_index].done = !todo_items[local_index].done;
        SaveData();
    };

    dzest.onclick = function() {
        Remove(lista, local_index);
    };
 
    task_list.appendChild(lista);
}

// Izņem TODO lieto no saraksta un localstorage
function Remove(list, index) {
    list.remove();
       
    if (todo_items[index].done == false) {
        DecrementUnfinishedTasks();
    }
        
    todo_items[index] = null;
    SaveData();
}

// ITEM FILTER
/*
    TODO IZLASI ŠO TEKSTU!!!!!!!!!!!!
    
    Filtrs pievieno <li> elementam atribūtu Pabeigts=true/false un Aktivs=true/false
    Ja filtrē pabeigtos, tad programma iziet cauri visiem elementiem un paslēpj tos, kuriem ir atribūts Pabeigts=true
    Tas pats notiek Aktīviem.
*/



SetFilter("Visi");
function ShowAll() {
    let AktiviListi = document.querySelectorAll('[Aktivs="true"]');
        
    for (let i=0; i < AktiviListi.length; i++) {
        let list_elements = AktiviListi[i]
        Show(AktiviListi[i]); 
    }
        
    let PabeigtiListi = document.querySelectorAll('[Pabeigts="true"]');
        
    for (let i=0; i < PabeigtiListi.length; i++) {
        let list_elements = PabeigtiListi[i]
        Show(PabeigtiListi[i]); 
        console.log('log')
    }
}

function Hide(list) {
    list.classList.add('d-none');
}

function Show(list) {
    list.classList.remove('d-none');
}

//
function OutlineAll() {
    visi_filtrs.classList.remove('btn-secondary');
    visi_filtrs.classList.add('btn-outline-secondary');
    //
    aktivie_filtrs.classList.remove('btn-secondary');
    aktivie_filtrs.classList.add('btn-outline-secondary');
    //
    pabeigtie_filtrs.classList.remove('btn-secondary');
    pabeigtie_filtrs.classList.add('btn-outline-secondary');
}

// Izceļ pārmaina pogas stilu no 'outline' uz 'solid'
function Highlight(button) {
    button.classList.remove('btn-outline-secondary');
    button.classList.add('btn-secondary');
}

function SetFilter(filter) {
    OutlineAll();
    ShowAll();
    selected_filter = filter;
    if (filter == "Visi") {
        Highlight(visi_filtrs);
    } else if (filter == "Aktivie") { // Paslēpt pabeigtos
        Highlight(aktivie_filtrs);
                
        let PabeigtiListi = document.querySelectorAll('[Pabeigts="true"]');
        for (let i=0; i < PabeigtiListi.length; i++) {
            let list_elements = PabeigtiListi[i];
            Hide(list_elements);
        }
    } else { // Paslēpt aktīvos
        Highlight(pabeigtie_filtrs);
        let AktiviListi = document.querySelectorAll('[Aktivs="true"]');
        
        for (let i=0; i < AktiviListi.length; i++) {
            let list_elements = AktiviListi[i]
            Hide(list_elements);
        }
    }
}

// Reāla laika filtrs

function LiveFilter(text) {
    SetFilter(selected_filter);
    for (let i=0; i < todo_index; i++) {
        if (todo_items[i] == null) { continue; }
        
        let list = todo_items[i].list_obj;
        let paragraph = list.querySelector('p');
        let innerText = paragraph.innerText;

        if (text.length > 0) {
            if (innerText.includes(text)) {
                // Show if matches
                if (selected_filter == "Visi") {
                    list.setAttribute('ir', true)
                    Show(list);
                } else {
                    let FiltretiListi = document.querySelectorAll('[' + selected_filter + '="true"]');
                    for (let i=0; i < FiltretiListi.length; i++) {
                        let list_elements = FiltretiListi[i]
                        list.setAttribute('ir', true)
                        Show(FiltretiListi[i]);  
                    }
                } 
            } else {
                list.setAttribute('ir', false)
                Hide(list);
            }
        } else {
            list.setAttribute('ir', false)
            SetFilter(selected_filter);
            return;
        }
    }
}

search.addEventListener('input', function(e) {
    LiveFilter(this.value);
})

// TASKS
// Inkrementē un dekrementē atlikušos uzdevumus un parāda to mājas lapā

function DecrementUnfinishedTasks() {
    unfinished_tasks -= 1;
    if (unfinished_tasks == 1) {
        unfinished.innerText = "Atlicis " + unfinished_tasks + " darbs"
    } else {
        unfinished.innerText = "Atlikuši " + unfinished_tasks + " darbi"
    }
}

function IncrementUnfinishedTasks() {
    unfinished_tasks += 1;
    if (unfinished_tasks == 1) {
        unfinished.innerText = "Atlicis " + unfinished_tasks + " darbs"
    } else {
        unfinished.innerText = "Atlikuši " + unfinished_tasks + " darbi"
    }
  
}

function RemoveFinished() {
    console.log("a")
    for (let i=0; i < todo_index; i++) {
        let todo_item = todo_items[i];
        if (todo_item) {
            console.log("a")
            if (todo_item.done == true) {
                Remove(
                    todo_item.list_obj,
                    i
                );
            }
        }
    }
    SaveData();
}

// DROPDOWN COLOR
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

