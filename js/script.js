document.addEventListener('DOMContentLoaded', () => {

	const taskInput = document.getElementById('task-input');
	const addTaskBtn = document.getElementById('add-task-btn');
	const taskList = document.getElementById('task-list');
	const todosContainer = document.querySelector('.todos-container');

	// Adjust width if empty
	const toggleEmptyState = () => {
		todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
	};

	// SAVE TASKS TO LOCAL STORAGE
	const saveTasks = () => {
		const tasks = [];

		document.querySelectorAll('#task-list li').forEach(li => {
			tasks.push({
				text: li.querySelector('span').textContent,
				completed: li.querySelector('.checkbox').checked
			});
		});

		localStorage.setItem('tasks', JSON.stringify(tasks));
	};

	// ADD TASK FUNCTION
	const addTask = (text, completed = false) => {
		const taskText = text || taskInput.value.trim();
		if (!taskText) return;

		const li = document.createElement('li');
		li.innerHTML = `
			<input type="checkbox" class="checkbox" ${completed ? 'checked' : ''} />
			<span>${taskText}</span>
			<div class="task-buttons">
				<button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
				<button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
			</div>
		`;

		const checkbox = li.querySelector('.checkbox');
		const editBtn = li.querySelector('.edit-btn');

		// If already completed (from storage)
		if (completed) {
			li.classList.add('completed');
			editBtn.disabled = true;
			editBtn.style.opacity = '0.5';
			editBtn.style.pointerEvents = "none";
		}

		// CHECKBOX EVENT
		checkbox.addEventListener('change', () => {
			const isChecked = checkbox.checked;

			li.classList.toggle('completed', isChecked);

			editBtn.disabled = isChecked;
			editBtn.style.opacity = isChecked ? '0.5' : '1';
			editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';

			saveTasks();
		});

		// EDIT TASK
		editBtn.addEventListener('click', () => {
			if (!checkbox.checked) {
				taskInput.value = li.querySelector('span').textContent;
				li.remove();
				toggleEmptyState();
				saveTasks();
			}
		});

		// DELETE TASK
		li.querySelector('.delete-btn').addEventListener('click', () => {
			li.remove();
			toggleEmptyState();
			saveTasks();
		});

		taskList.appendChild(li);
		taskInput.value = '';
		toggleEmptyState();
		saveTasks();
	};

	// LOAD TASKS FROM LOCAL STORAGE
	const loadTasks = () => {
		const saved = localStorage.getItem('tasks');
		if (!saved) return;

		const tasks = JSON.parse(saved);
		tasks.forEach(task => addTask(task.text, task.completed));
	};

	// BUTTON CLICK
	addTaskBtn.addEventListener('click', (e) => {
		e.preventDefault();
		addTask();
	});

	// ENTER KEY
	taskInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTask();
		}
	});

	// LOAD SAVED TASKS ON START
	loadTasks();

});