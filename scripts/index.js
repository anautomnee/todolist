document.addEventListener('DOMContentLoaded', () => {

    // Get all tasks
    const tasksContainer = document.querySelector('.tasks');
    const all_tasks = JSON.parse(localStorage.getItem('all_tasks')) || [];
    all_tasks.forEach((el) => createTaskCard(el, tasksContainer));
    checkboxReload();

    // Fill date container
    const dayOfWeek = document.querySelector('#day_of_week');
    const date = document.querySelector('#date');
    let currentDate = new Date();
    let currentDayOfWeek = currentDate.getDay();
    let currentDay = currentDate.getDate();
    let currentMonth = currentDate.getMonth();
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    dayOfWeek.textContent = dayNames[currentDayOfWeek];
    date.textContent = `${currentDay} ${monthNames[currentMonth]}`;

    // New task 
    const newTaskDescription = document.querySelector('#new_task_description');
    const newTaskDatetime = document.querySelector('#new_task_datetime');
    const newTaskForm = document.querySelector('.new_task_form');

    // Change text input to datetime
    newTaskDatetime.addEventListener('focus', ev => {
        ev.target.setAttribute('type', 'datetime-local');
    });
    newTaskDatetime.addEventListener('focusout', ev => {
        ev.target.setAttribute('type', 'text');
    });

    newTaskForm.addEventListener('submit', event => {
        event.preventDefault();
        let new_task = {
            id: `${Math.round(Math.random()*100)}`,
            description: newTaskDescription.value,
            datetime: newTaskDatetime.value,
            checked: false
        };

        all_tasks.push(new_task);
        localStorage.setItem('all_tasks', JSON.stringify(all_tasks));
        location.reload();

    })


    // Switch views
    const all_tab = document.querySelector('.all');
    const active_tab = document.querySelector('.active');
    const completed_tab = document.querySelector('.completed');

    all_tab.addEventListener('click', () => {
        switchTab(all_tab, active_tab, completed_tab, all_tasks);
    });

    active_tab.addEventListener('click', () => {
        const active_tasks = all_tasks.filter(obj => obj.checked === false);
        switchTab(active_tab, all_tab, completed_tab, active_tasks);
    });

    completed_tab.addEventListener('click', () => {
        let completed_tasks = all_tasks.filter(obj => obj.checked === true);
        switchTab(completed_tab, all_tab, active_tab, completed_tasks);
    });



    // Search
    const searchInput = document.querySelector('#search');
    const searchList = document.querySelector('#search_results');
    const searchIcon = document.querySelector('#search_icon');
    let searchArray = all_tasks.map(el => el.description).slice(0, 5);
    
    searchInput.addEventListener('focus', () => {
        searchList.hidden = false;
        searchIcon.setAttribute('visibility', 'hidden');
        searchList.innerHTML = '';
        createSearchResults(searchArray, searchList);
        // focus on search result
        let listItems = document.querySelectorAll('li');
        listItems.forEach(el => {
            el.addEventListener('mouseover', (event) => {
                let clickedEl = document.querySelector(`#${event.target.textContent.replace(/\s/g, "")}`)
                clickedEl.focus()
            });
        });
        
    });
    searchInput.addEventListener('focusout', () => {
        searchList.hidden = true;
        searchIcon.setAttribute('visibility', 'visible');
    });
    searchInput.addEventListener('keyup', () => {
        
        let query = searchInput.value;
        let updatedSearchArray = [];
        let re = new RegExp(query, "i");
        all_tasks.filter(el => {
            if (el.description.match(re)) {
                updatedSearchArray.push(el.description)
            };
        });
        searchList.innerHTML = '';
        if (updatedSearchArray.length !== 0) {
            createSearchResults(updatedSearchArray, searchList);
        } else {
            createSearchResults(['No matching results'], searchList);
        }
        // focus on search result
        let listItems = document.querySelectorAll('li');
        listItems.forEach(el => {
            el.addEventListener('mouseover', (event) => {
                let clickedEl = document.querySelector(`#${event.target.textContent.replace(/\s/g, "")}`)
                console.log(clickedEl.parentNode)
                clickedEl.focus()
                clickedEl.parentNode.style.backgroundColor = "#E8DEF8";
            });
        });
    });



    // Delete task
    const deleteIcons = document.querySelectorAll('span');
    if (deleteIcons) {
        deleteIcons.forEach(icon => {
            icon.addEventListener('click', (event) => {
                let parent = event.currentTarget.parentNode;
                let foundElId;
                all_tasks.forEach((el, ind) => {
                    if (el.id === parent.getAttribute('id').slice(5)) {
                        foundElId = ind;
                    }
                });
                console.log(foundElId)
                all_tasks.splice(foundElId, foundElId);
                localStorage.setItem('all_tasks', JSON.stringify(all_tasks));
                location.reload();
            });
        });
    }; 
    




    // Functions
    function createTaskCard(object, container) {
       
        // Create container
        const card_div = document.createElement('div');
        card_div.style.marginBottom = '16px';
        card_div.classList.add('task');
        card_div.setAttribute('id', `task_${object.id}`);
        container.append(card_div);
        
        // Create checkbox
        const card_checkbox = document.createElement('input');
        card_checkbox.setAttribute('type', 'checkbox');
        card_checkbox.setAttribute('name', 'taskCheckbox');
        descriptionShort = object.description.replace(/\s/g, "");
        card_checkbox.setAttribute('id', descriptionShort);
        card_div.append(card_checkbox);

        // Create div with task info
        const task_info_div = document.createElement('div');
        const card_datetime = document.createElement('p');
        card_datetime.setAttribute('id', 'task_datetime');
        const date = new Date(object.datetime)
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        card_datetime.textContent = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getHours()}:${date.getMinutes()}`;
        const card_description = document.createElement('p');
        card_description.textContent = object.description;
        task_info_div.append(card_datetime, card_description);

        //Create delete icon
        const card_delete = document.createElement('span');
        card_delete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
        card_div.append(task_info_div, card_delete);



        //If checked
        if (object.checked === true) {
            card_datetime.style.opacity = '.33';
            card_description.style.opacity = '.33';
            card_description.style.textDecoration = 'line-through';
            card_checkbox.checked = true;
        }
    };
    

    function switchTab(active, inactive1, inactive2, tasks) {
        tasksContainer.innerHTML = '';
        
        active.classList.add('tab_active');
        inactive1.classList.remove('tab_active');
        inactive2.classList.remove('tab_active');
        
        tasks.forEach(task => createTaskCard(task, tasksContainer));
        checkboxReload();
    };
    
    
    
    function checkboxReload () {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(el => {
            el.addEventListener('click', event => {
                const date = event.target.nextSibling.firstChild;
                const description = event.target.nextSibling.lastChild;
                // Find task in all tasks
                const task_id = event.target.getAttribute('id');
                let foundItemArr = all_tasks.filter(el => el.description.replace(/\s/g, "") === task_id)

                if (event.target.checked) {
                    date.style.opacity = '.33';
                    description.style.opacity = '.33';
                    description.style.textDecoration = 'line-through';
                    foundItemArr[0].checked = true;
                    localStorage.setItem('all_tasks', JSON.stringify(all_tasks));
                } else {
                    date.style.opacity = '1';
                    description.style.opacity = '1';
                    description.style.textDecoration = 'none';
                    foundItemArr[0].checked = false;
                    localStorage.setItem('all_tasks', JSON.stringify(all_tasks));
                }
            })
        });
    };


    function createSearchResults(array, container) {
        arraySliced = array.slice(0, 5);
        arraySliced.forEach(el => {
            const result = document.createElement('li');
            result.textContent = el;
            container.append(result);
        });
    };


});