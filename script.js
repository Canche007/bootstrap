document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('task-form').addEventListener('submit', addTask);

function addTask(e) {
    e.preventDefault();

    const taskName = document.getElementById('task-name').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const responsible = document.getElementById('responsible').value;

    if (new Date(startDate) > new Date(endDate)) {
        alert('La fecha limite no puede ser menor a la fecha de inicio');
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        startDate: startDate,
        endDate: endDate,
        responsible: responsible,
        completed: false
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById('task-form').reset();

    loadTasks();
}

function loadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        const taskDate = new Date(task.endDate);
        const today = new Date();
        if (task.completed) {
            li.classList.add('list-group-item-success');
        } else if (taskDate < today) {
            li.classList.add('list-group-item-danger');
        }

        li.innerHTML = `
            <span>
                <strong>${task.name}</strong> (Responsable de la tarea: ${task.responsible})
                <br>
                Fecha de inicio: ${task.startDate}
                <br>
                // Fecha Límite: ${task.endDate}
            </span>
            <span>
                ${!task.completed && taskDate >= today ? `<button class="btn btn-success btn-sm mr-2" onclick="completeTask(${task.id})">Completar</button>` : ''}
                ${task.completed ? `<button class="btn btn-warning btn-sm mr-2" onclick="uncompleteTask(${task.id})">Desmarcar</button>` : ''}
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Eliminar</button>
            </span>
        `;
        taskList.appendChild(li);
    });
}

function completeTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => task.id === id ? { ...task, completed: true } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function uncompleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => task.id === id ? { ...task, completed: false } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

