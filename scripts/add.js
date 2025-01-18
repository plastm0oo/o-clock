document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('add-task');
    const modal = document.getElementById('task-modal');
    const closeModalButton = document.getElementById('close-modal');
    const taskForm = document.getElementById('task-form');
    const tasksContainer = document.getElementById('tasks');

    let isEditing = false;
    let currentTaskElement = null;

    // Открытие модального окна
    addTaskButton.addEventListener('click', () => {
        openModal();
    });

    // Закрытие модального окна
    closeModalButton.addEventListener('click', () => {
        closeModal();
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Обработка формы добавления задачи
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const category = taskForm.elements['category'].value;
        const time = taskForm.elements['time'].value;
        const description = taskForm.elements['description'].value;

        if (!category || !time || !description) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        if (isEditing && currentTaskElement) {
            updateTask(currentTaskElement, category, time, description);
        } else {
            addTask(category, time, description);
        }

        closeModal();
    });

    function openModal() {
        modal.style.display = 'flex';
        isEditing = false;
        currentTaskElement = null;
        taskForm.reset();
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function addTask(category, time, description) {
        // Создание элемента задачи
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');

        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category');
        categoryElement.classList.add(category);
        console.log('Category class added:', categoryElement.className); // Проверка добавления класса

        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        timeElement.textContent = time;

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('description');
        descriptionElement.textContent = description;

        const editButton = document.createElement('button');
        editButton.textContent = 'Редактировать';
        editButton.addEventListener('click', () => {
            editTask(taskElement, category, time, description);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', () => {
            tasksContainer.removeChild(taskElement);
        });

        taskElement.appendChild(categoryElement);
        taskElement.appendChild(timeElement);
        taskElement.appendChild(descriptionElement);
        taskElement.appendChild(editButton);
        taskElement.appendChild(deleteButton);

        tasksContainer.appendChild(taskElement);
    }

    function editTask(taskElement, category, time, description) {
        isEditing = true;
        currentTaskElement = taskElement;

        taskForm.elements['category'].value = category;
        taskForm.elements['time'].value = time;
        taskForm.elements['description'].value = description;

        modal.style.display = 'flex';
    }

    function updateTask(taskElement, category, time, description) {
        const categoryElement = taskElement.querySelector('.category');
        const timeElement = taskElement.querySelector('.time');
        const descriptionElement = taskElement.querySelector('.description');

        categoryElement.className = 'category'; // Сброс всех классов
        categoryElement.classList.add(category); // Добавление нового класса
        console.log('Category class updated:', categoryElement.className); // Проверка обновления класса

        timeElement.textContent = time;
        descriptionElement.textContent = description;
    }
});