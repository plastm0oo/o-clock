document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('add-task');
    const tasksContainer = document.getElementById('tasks');

    // Открытие новой строки задачи
    addTaskButton.addEventListener('click', () => {
        addNewTask();
    });

    function addNewTask() {
        // Создание элемента строки задачи
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');

        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category');
        categoryElement.classList.add('gray');
        categoryElement.addEventListener('click', () => {
            showColorPicker(categoryElement, taskElement, true);
        });

        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        const timeInput = document.createElement('input');
        timeInput.setAttribute('type', 'text');
        timeInput.setAttribute('placeholder', '13:00 - 14:20');
        timeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9: -]/g, '');
        });
        timeElement.appendChild(timeInput);

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('description');
        const descriptionInput = document.createElement('input');
        descriptionInput.setAttribute('type', 'text');
        descriptionInput.setAttribute('placeholder', 'Описание задачи');
        descriptionElement.appendChild(descriptionInput);

        // Создание контейнера для кнопок
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'v';
        confirmButton.classList.add('accept');
        confirmButton.addEventListener('click', () => {
            saveTask(categoryElement, timeInput.value, descriptionInput.value, taskElement);
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'x';
        cancelButton.classList.add('cancel');
        cancelButton.addEventListener('click', () => {
            tasksContainer.removeChild(taskElement);
        });

        // Добавление кнопок в контейнер
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);

        // Добавление элементов в строку задачи
        taskElement.appendChild(categoryElement);
        taskElement.appendChild(timeElement);
        taskElement.appendChild(descriptionElement);
        taskElement.appendChild(buttonContainer);

        // Добавление строки задачи в контейнер задач
        tasksContainer.appendChild(taskElement);
    }

    function saveTask(categoryElement, time, description, taskElement) {
        if (!time || !description) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        timeElement.textContent = time;

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('description');
        descriptionElement.textContent = description;

        // Создание контейнера для кнопок
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const editButton = document.createElement('button');
        editButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" fill="none">
                <path stroke="#666" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12.844 7.14 15 4.422l-3.75-3L9 4.005m3.844 3.134L6 14.75l-4.5 1.5.75-4.5L9 4.005m3.844 3.134L9 4.005"/>
            </svg>
        `;
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => {
            const originalTask = {
                category: categoryElement.className,
                time: time,
                description: description
            };
            editTask(taskElement, categoryElement, time, description, originalTask);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" fill="none">
                <path stroke="#666" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.5 2.364h-4L2.833 16h9.334L13.5 2.364h-4m-4 0c.443-1.018.853-1.357 2-1.364 1.29.043 1.603.462 2 1.364m-4 0h4M4.167 5.5l.666 7.773m6-7.773-.666 7.773M7.5 5.5v7.773"/>
            </svg>
        `;
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => {
            tasksContainer.removeChild(taskElement);
        });

        // Добавление кнопок в контейнер
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        taskElement.innerHTML = '';
        taskElement.appendChild(categoryElement);
        taskElement.appendChild(timeElement);
        taskElement.appendChild(descriptionElement);
        taskElement.appendChild(buttonContainer);
    }

    function editTask(taskElement, categoryElement, time, description, originalTask) {
        taskElement.innerHTML = '';

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category');
        categoryContainer.classList.add(categoryElement.classList[1]);
        categoryContainer.addEventListener('click', () => {
            showColorPicker(categoryContainer, taskElement, true);
        });

        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        const timeInput = document.createElement('input');
        timeInput.setAttribute('type', 'text');
        timeInput.setAttribute('value', time);
        timeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9: -]/g, '');
        });
        timeElement.appendChild(timeInput);

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('description');
        const descriptionInput = document.createElement('input');
        descriptionInput.setAttribute('type', 'text');
        descriptionInput.setAttribute('value', description);
        descriptionElement.appendChild(descriptionInput);

        // Создание контейнера для кнопок
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'v';
        confirmButton.classList.add('accept');
        confirmButton.addEventListener('click', () => {
            saveTask(categoryElement, timeInput.value, descriptionInput.value, taskElement);
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'x';
        cancelButton.classList.add('cancel');
        cancelButton.addEventListener('click', () => {
            //Возвращение задачи в изначальное состояние
            taskElement.innerHTML = '';
            taskElement.appendChild(createCategoryElement(originalTask.category));
            taskElement.appendChild(createTextElement('time', originalTask.time));
            taskElement.appendChild(createTextElement('description', originalTask.description));

            const originalButtonContainer = document.createElement('div');
            originalButtonContainer.classList.add('button-container');

            const editButton = document.createElement('button');
            editButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" fill="none">
                    <path stroke="#666" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12.844 7.14 15 4.422l-3.75-3L9 4.005m3.844 3.134L6 14.75l-4.5 1.5.75-4.5L9 4.005m3.844 3.134L9 4.005"/>
                </svg>
            `;
            editButton.classList.add('edit');
            editButton.addEventListener('click', () => {
                editTask(taskElement, taskElement.querySelector('.category'), originalTask.time, originalTask.description, originalTask);
            });

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" fill="none">
                    <path stroke="#666" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.5 2.364h-4L2.833 16h9.334L13.5 2.364h-4m-4 0c.443-1.018.853-1.357 2-1.364 1.29.043 1.603.462 2 1.364m-4 0h4M4.167 5.5l.666 7.773m6-7.773-.666 7.773M7.5 5.5v7.773"/>
                </svg>
            `;
            deleteButton.classList.add('delete');
            deleteButton.addEventListener('click', () => {
                tasksContainer.removeChild(taskElement);
            });

            originalButtonContainer.appendChild(editButton);
            originalButtonContainer.appendChild(deleteButton);

            taskElement.appendChild(originalButtonContainer);
        });

        // Добавление кнопок в контейнер
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);

        taskElement.appendChild(categoryContainer);
        taskElement.appendChild(timeElement);
        taskElement.appendChild(descriptionElement);
        taskElement.appendChild(buttonContainer);
    }

    function showColorPicker(categoryElement, taskElement, isEditable) {
        let isEditing = taskElement.querySelector('input') !== null;
        if (!isEditing) return;

        let colorPicker = document.querySelector('.color-picker');
        if (!colorPicker) {
            colorPicker = document.createElement('div');
            colorPicker.classList.add('color-picker');

            const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'gray'];
            colors.forEach(color => {
                const colorElement = document.createElement('div');
                colorElement.classList.add('color');
                colorElement.classList.add(color);
                colorElement.addEventListener('click', () => {
                    categoryElement.className = 'category ' + color;
                    console.log('Selected color:', color, 'New class name:', categoryElement.className);
                    colorPicker.style.display = 'none';
                });
                colorPicker.appendChild(colorElement);
            });

            document.body.appendChild(colorPicker);
        }

        const rect = categoryElement.getBoundingClientRect();
        colorPicker.style.top = `${rect.bottom + window.scrollY}px`;
        colorPicker.style.left = `${rect.left + window.scrollX}px`;
        colorPicker.style.display = 'block';
    }

    window.addEventListener('click', (event) => {
        const colorPicker = document.querySelector('.color-picker');
        if (colorPicker && !colorPicker.contains(event.target) && !event.target.classList.contains('category')) {
            colorPicker.style.display = 'none';
        }
    });

    // Вспомогательные функции для создания элементов
    function createCategoryElement(className) {
        const categoryElement = document.createElement('div');
        categoryElement.className = className;
        return categoryElement;
    }

    function createTextElement(className, text) {
        const textElement = document.createElement('div');
        textElement.classList.add(className);
        textElement.textContent = text;
        return textElement;
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }
});