let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let successScore = parseInt(localStorage.getItem('successScore')) || 0;
let failedScore = 0;

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    const currentDate = new Date();
    failedScore = 0;

    tasks.forEach((task, index) => {
        const taskDateTime = new Date(`${task.date}T${task.time || '23:59'}`);
        const isFailed = !task.completed && currentDate > taskDateTime;
        if (isFailed) {
            failedScore++;
        }

        if (!task.completed && !isFailed) {
            const tr = document.createElement('tr');
            const taskText = document.createElement('td');
            const dayName = getDayName(task.date);
            taskText.textContent = `${task.name}`;
            const taskDate = document.createElement('td');
            taskDate.textContent = `${dayName}, ${task.date}`;
            const taskTime = document.createElement('td');
            taskTime.textContent = task.time ? task.time : '23:59';
            const actionTd = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.className = 'button delete';
            deleteButton.onclick = () => deleteTask(index);
            const successButton = document.createElement('button');
            successButton.textContent = '√';
            successButton.className = 'button';
            successButton.onclick = () => markSuccess(index);
            actionTd.appendChild(deleteButton);
            actionTd.appendChild(successButton);
            tr.appendChild(taskText);
            tr.appendChild(taskDate);
            tr.appendChild(taskTime);
            tr.appendChild(actionTd);
            taskList.appendChild(tr);
        }
    });

    updateScores();
    localStorage.setItem('failedScore', failedScore);
}

function addTask() {
    const taskName = document.getElementById('task-name').value;
    const taskDate = document.getElementById('task-date').value;
    let taskTime = document.getElementById('task-time').value;
    if (!taskTime) taskTime = '23:59';
    if (taskName && taskDate) {
        tasks.push({ name: taskName, date: taskDate, time: taskTime, completed: false, deleted: false });
        saveTasks();
        renderTasks();
        document.getElementById('task-name').value = '';
        document.getElementById('task-date').value = '';
        document.getElementById('task-time').value = '';
    } else {
        alert('Harap masukkan nama dan tanggal kegiatan.');
    }
}

function markSuccess(index) {
    tasks[index].completed = true;
    successScore++;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('successScore', successScore);
}

function updateScores() {
    document.getElementById('success-score').textContent = successScore;
    document.getElementById('failed-score').textContent = failedScore;
    const description = document.getElementById('description');
    if (successScore >= failedScore) {
        description.textContent = 'Terima Kasih Atas Kerja Keras nya';
    } else {
        description.textContent = 'Semangat, jangan malas';
    }
}

function getDayName(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { weekday: 'long' });
}

window.onload = renderTasks;
