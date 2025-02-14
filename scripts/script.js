document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('add-task');
    const tasksContainer = document.getElementById('tasks');
    let taskIdCounter = 0; //счетчик для уникальных идентификаторов задач

    //открытие новой строки задачи
    addTaskButton.addEventListener('click', () => {
        addNewTask();
    });

    function addNewTask() {
        //создание элемента строки задачи
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.dataset.taskId = `task-${taskIdCounter++}`; //уникальный идентификатор для задачи

        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category');
        categoryElement.classList.add('gray');
        categoryElement.dataset.taskId = taskElement.dataset.taskId; //привязка к задаче
        categoryElement.addEventListener('click', (event) => {
            if (isEditing(taskElement)) {
                showColorPicker(event.currentTarget);
            }
        }); 

        //поле времени
        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        
        const startTimeHour = createTimeInput('12', 23);
        const startTimeMinute = createTimeInput('00', 59);
        const endTimeHour = createTimeInput('13', 23);
        const endTimeMinute = createTimeInput('30', 59);

        const descriptionInput = document.createElement('input');
        descriptionInput.setAttribute('type', 'text');
        descriptionInput.setAttribute('placeholder', 'Описание задачи');

        //автоматический переход на другое окно
        startTimeHour.addEventListener('input', () => autoMove(startTimeHour, startTimeMinute));
        startTimeMinute.addEventListener('input', () => autoMove(startTimeMinute, endTimeHour));
        endTimeHour.addEventListener('input', () => autoMove(endTimeHour, endTimeMinute));
        endTimeMinute.addEventListener('input', () => autoMove(endTimeMinute, descriptionInput));

        
        timeElement.appendChild(startTimeHour);
        timeElement.appendChild(createSeparator(':', 'colon'));
        timeElement.appendChild(startTimeMinute);
        timeElement.appendChild(createSeparator(' - ', 'dash'));
        timeElement.appendChild(endTimeHour);
        timeElement.appendChild(createSeparator(':', 'colon'));
        timeElement.appendChild(endTimeMinute);

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('description');
        descriptionElement.appendChild(descriptionInput);

        //создание контейнера для кнопок
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const confirmButton = document.createElement('button');
        confirmButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" fill="none">
                <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m2.111 7.317 3.943 4.929 9.2-9.857"/>
            </svg>
        `;
        confirmButton.classList.add('accept');
        confirmButton.addEventListener('click', () => {
            saveTask(categoryElement, startTimeHour.value, startTimeMinute.value, endTimeHour.value, endTimeMinute.value, descriptionInput.value, taskElement);
        });

        // Функция для обработки нажатия Enter
        const handleEnterKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                confirmButton.click();
            }
        };

        const cancelButton = document.createElement('button');
        cancelButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none">
                <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m2 15 6.5-6.5M15 2 8.5 8.5m0 0L15 15M8.5 8.5 2 2"/>
            </svg>
        `;
        cancelButton.classList.add('cancel');
        cancelButton.addEventListener('click', () => {
            tasksContainer.removeChild(taskElement);
        });

        // Добавляем обработчик нажатия клавиши Enter для всех полей ввода
        startTimeHour.addEventListener('keypress', handleEnterKeyPress);
        startTimeMinute.addEventListener('keypress', handleEnterKeyPress);
        endTimeHour.addEventListener('keypress', handleEnterKeyPress);
        endTimeMinute.addEventListener('keypress', handleEnterKeyPress);
        descriptionInput.addEventListener('keypress', handleEnterKeyPress);

        //добавление кнопок в контейнер
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);

        //добавление элементов в строку задачи
        taskElement.appendChild(categoryElement);
        taskElement.appendChild(timeElement);
        taskElement.appendChild(descriptionElement);
        taskElement.appendChild(buttonContainer);

        //добавление строки задачи в контейнер задач
        tasksContainer.appendChild(taskElement);
    }

    function createTimeInput(placeholder, max) {
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', placeholder);
        input.maxLength = 2;
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^\d]/g, ''); //разрешены только цифры
            if (parseInt(input.value) > max) input.value = max.toString().padStart(2, '0');
        });
        return input;
    }

    function autoMove(input, nextInput) {
        if (input.value.length === 2) {
            nextInput.focus();
        }
    }

    function createSeparator(text, className) {
        const separator = document.createElement('span');
        separator.textContent = text;
        separator.classList.add(className);
        return separator;
    }

    function formatTime(hour, minute) {
        return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    }

    function autoResize(event) {
        const input = event.target;
        input.style.height = 'auto';
        input.style.height = (input.scrollHeight) + 'px';
    }

    function saveTask(categoryElement, startHour, startMinute, endHour, endMinute, description, taskElement) {
        if (!startHour || !startMinute || !description) {
            alert('Пожалуйста, укажите время и опишите задачу');
            return;
        }

        //форматирование времени для внутреннего использования и отображения
        const formattedStartTime = formatTime(startHour, startMinute);
        const formattedEndTime = endHour && endMinute ? formatTime(endHour, endMinute) : '';
        const displayStartTime = `${parseInt(startHour)}:${startMinute}`;
        const displayEndTime = endHour && endMinute ? `${parseInt(endHour)}:${endMinute}` : '';

        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        timeElement.textContent = formattedEndTime ? `${displayStartTime} - ${displayEndTime}` : displayStartTime;

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('description');
        descriptionElement.textContent = description;

        //создание контейнера для кнопок
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
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                description: description
            };
            editTask(taskElement, categoryElement, startHour, startMinute, endHour, endMinute, description, originalTask);
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

        //добавление кнопок в контейнер
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        taskElement.innerHTML = '';
        taskElement.appendChild(categoryElement);
        taskElement.appendChild(timeElement);
        taskElement.appendChild(descriptionElement);
        taskElement.appendChild(buttonContainer);
        
        //сортировка задач по времени
        sortTasks();
    }

    function editTask(taskElement, categoryElement, startHour, startMinute, endHour, endMinute, description, originalTask) {
        taskElement.innerHTML = '';
        
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category');
        categoryContainer.classList.add(categoryElement.classList[1]);
        categoryContainer.dataset.taskId = taskElement.dataset.taskId; //привязка к задаче
        categoryContainer.addEventListener('click', (event) => {
            if (isEditing(taskElement)) {
                showColorPicker(event.currentTarget);
            }
        });

        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        
        const startTimeHour = createTimeInput('12', 23);
        startTimeHour.value = startHour;
        const startTimeMinute = createTimeInput('00', 59);
        startTimeMinute.value = startMinute;
        const endTimeHour = createTimeInput('13', 23);
        endTimeHour.value = endHour;
        const endTimeMinute = createTimeInput('30', 59);
        endTimeMinute.value = endMinute;

        const descriptionInput = document.createElement('input');
        descriptionInput.setAttribute('type', 'text');
        descriptionInput.setAttribute('value', description);
        descriptionInput.setAttribute('placeholder', 'Описание задачи');

        //автоматический переход на другое окно
        startTimeHour.addEventListener('input', () => autoMove(startTimeHour, startTimeMinute));
        startTimeMinute.addEventListener('input', () => autoMove(startTimeMinute, endTimeHour));
        endTimeHour.addEventListener('input', () => autoMove(endTimeHour, endTimeMinute));
        endTimeMinute.addEventListener('input', () => autoMove(endTimeMinute, descriptionInput));
        
        timeElement.appendChild(startTimeHour);
        timeElement.appendChild(createSeparator(':', 'colon'));
        timeElement.appendChild(startTimeMinute);
        timeElement.appendChild(createSeparator(' - ', 'dash'));
        timeElement.appendChild(endTimeHour);
        timeElement.appendChild(createSeparator(':', 'colon'));
        timeElement.appendChild(endTimeMinute);

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('description');
        descriptionElement.appendChild(descriptionInput);

        //создание контейнера для кнопок
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const confirmButton = document.createElement('button');
        confirmButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" fill="none">
                <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m2.111 7.317 3.943 4.929 9.2-9.857"/>
            </svg>
        `;
        confirmButton.classList.add('accept');
        confirmButton.addEventListener('click', () => {
            saveTask(categoryContainer, startTimeHour.value, startTimeMinute.value, endTimeHour.value, endTimeMinute.value, descriptionInput.value, taskElement);
        });

        // Функция для обработки нажатия Enter
        const handleEnterKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                confirmButton.click();
            }
        };

        const cancelButton = document.createElement('button');
        cancelButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none">
                <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m2 15 6.5-6.5M15 2 8.5 8.5m0 0L15 15M8.5 8.5 2 2"/>
            </svg>
        `;
        cancelButton.classList.add('cancel');
        cancelButton.addEventListener('click', () => {
            //возвращение задачи в изначальное состояние
            taskElement.innerHTML = '';
            taskElement.appendChild(createCategoryElement(originalTask.category));
            taskElement.appendChild(createTextElement('time', originalTask.startTime + (originalTask.endTime ? ` - ${originalTask.endTime}` : '')));
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
                editTask(taskElement, taskElement.querySelector('.category'), originalTask.startTime.split(':')[0], originalTask.startTime.split(':')[1], originalTask.endTime.split(':')[0], originalTask.endTime.split(':')[1], originalTask.description, originalTask);
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

        // Добавляем обработчик нажатия клавиши Enter для всех полей ввода
        startTimeHour.addEventListener('keypress', handleEnterKeyPress);
        startTimeMinute.addEventListener('keypress', handleEnterKeyPress);
        endTimeHour.addEventListener('keypress', handleEnterKeyPress);
        endTimeMinute.addEventListener('keypress', handleEnterKeyPress);
        descriptionInput.addEventListener('keypress', handleEnterKeyPress);

        //добавление кнопок в контейнер
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);

        taskElement.appendChild(categoryContainer);
        taskElement.appendChild(timeElement);
        taskElement.appendChild(descriptionElement);
        taskElement.appendChild(buttonContainer);
    }

    function showColorPicker(categoryElement) {
        let colorPicker = document.querySelector('.color-picker');
        if (!colorPicker) {
            colorPicker = document.createElement('div');
            colorPicker.classList.add('color-picker');

            const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'gray'];
            colors.forEach(color => {
                const colorElement = document.createElement('div');
                colorElement.classList.add('color', color);
                colorElement.addEventListener('click', () => {
                    const targetCategoryElement = document.querySelector(`.category[data-task-id="${colorPicker.dataset.taskId}"]`);
                    if (targetCategoryElement) {
                        targetCategoryElement.className = 'category ' + color;
                    }
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

        //сохранение текущего элемента для изменения цвета
        colorPicker.dataset.taskId = categoryElement.dataset.taskId;
    }

    window.addEventListener('click', (event) => {
        const colorPicker = document.querySelector('.color-picker');
        if (colorPicker && !colorPicker.contains(event.target) && !event.target.classList.contains('category')) {
            colorPicker.style.display = 'none';
        }
    });

    //вспомогательные функции для создания элементов
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

    function isEditing(taskElement) {
        return taskElement.querySelector('input') !== null;
    }

    function sortTasks() {
        const tasks = Array.from(tasksContainer.children);
        tasks.sort((a, b) => {
            const timeA = a.querySelector('.time').textContent.split(' ')[0];
            const timeB = b.querySelector('.time').textContent.split(' ')[0];
            return timeA.localeCompare(timeB, undefined, { numeric: true, sensitivity: 'base' });
        });
        tasks.forEach(task => tasksContainer.appendChild(task));
    }
});