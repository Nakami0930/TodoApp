document.getElementById('add-task-btn').addEventListener('click', addTask);

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    
    if (taskText !== '') {
        const taskList = document.getElementById('task-list');
        
        const li = document.createElement('li');
        li.className = 'task';
        
        const span = document.createElement('span');
        span.textContent = taskText;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '削除';
        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(li);
        });
        
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
        
        taskInput.value = '';
    }
}
