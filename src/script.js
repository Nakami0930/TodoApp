document.getElementById('add-task-btn').addEventListener('click', addTask);
document.getElementById('show-completed').addEventListener('change', toggleCompletedTasks);

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    
    if (taskText !== '') {
        const taskList = document.getElementById('task-list');
        
        const li = document.createElement('li');
        li.className = 'task';
        
        const span = document.createElement('span');
        span.textContent = taskText;
        span.addEventListener('click', () => {
            li.classList.toggle('completed');
            if (li.classList.contains('completed')) {
                showCongratsMessage();
            }
            filterTasks();
        });
        
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

function toggleCompletedTasks() {
    filterTasks();
}

function filterTasks() {
    const showCompleted = document.getElementById('show-completed').checked;
    const tasks = document.querySelectorAll('.task');
    
    tasks.forEach(task => {
        if (task.classList.contains('completed')) {
            task.style.display = showCompleted ? 'flex' : 'none';
        }
    });
}

function showCongratsMessage() {
    const messages = ["おめでとう!", "よくやった!", "素晴らしい!", "やったね!"];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const congratsMessageElement = document.getElementById('congrats-message');
    
    congratsMessageElement.textContent = randomMessage;
    congratsMessageElement.classList.remove('hidden');
    
    setTimeout(() => {
        congratsMessageElement.classList.add('hidden');
    }, 3000); // 3秒後にメッセージを非表示にする
}

// 初期ロード時に完了タスクを表示するためのフィルタリング
document.addEventListener('DOMContentLoaded', filterTasks);
