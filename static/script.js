document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://127.0.0.1:8000/api/tasks/';
    const addTaskButton = document.getElementById('add-task');
    const tasksContainer = document.getElementById('tasks');
    const prevDayButton = document.getElementById('prev-day');
    const nextDayButton = document.getElementById('next-day');
    const currentDateElement = document.getElementById('current-date');
    const currentWeekdayElement = document.getElementById('current-weekday');
    const currentYearElement = document.getElementById('current-year');

    let taskIdCounter = 0;
    let currentDate = new Date().toISOString().split('T')[0];

    if (!(currentDate instanceof Date)) {
        console.warn("Инициализация currentDate: восстанавливаю значение...");
        currentDate = new Date();
    }
    console.log("Изначальное значение currentDate:", currentDate);

    async function loadTasksForDate(date) {
        const formattedDate = date.toISOString().split('T')[0];
        try {
            const response = await fetch(`${apiBaseUrl}?date=${formattedDate}`);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки задач: ${response.statusText}`);
            }
            const tasks = await response.json();
            tasksContainer.innerHTML = ''; // Очистка контейнера задач
            tasks.forEach(task => {
                const existingTask = tasksContainer.querySelector(`[data-task-id="task-${task.id}"]`);
                if (!existingTask) {
                    addTaskToDOM(task); // Добавляем задачу в DOM
                }
            });
            sortTasks();
        } catch (error) {
            console.error('Ошибка при загрузке задач:', error);
        }
    }

    // Функция для форматирования даты
    function formatDate(date) {
        const options = { month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    }

    function formatWeekday(date) {
        const options = { weekday: 'long' };
        return date.toLocaleDateString('ru-RU', options);
    }

    function formatYear(date) {
        const options = { year: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    }

    // Обновление отображаемой даты
    function updateDateDisplay() {
        if (!(currentDate instanceof Date)) {
            console.error("Ошибка: currentDate не является объектом Date!");
            return;
        }
        currentDateElement.textContent = formatDate(currentDate);
        currentWeekdayElement.textContent = formatWeekday(currentDate);
        currentYearElement.textContent = formatYear(currentDate);
        loadTasksForDate(currentDate);
    }

    // Добавление задачи в DOM
    function addTaskToDOM(task) {
        if (!task.id || task.id === 0) {
            console.error('Invalid task ID, cannot add to DOM:', task.id);
            return; // Не добавляем задачу с некорректным ID
        }
    
        const existingTask = tasksContainer.querySelector(`[data-task-id="task-${task.id}"]`);
        if (existingTask) {
            console.warn(`Task with ID ${task.id} already exists in DOM, skipping addition.`);
            return; // Пропускаем задачу, если она уже существует
        }

        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.setAttribute('data-task-id', `task-${task.id}`);

        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category');
        const categoryClasses = task.category.split(' ');
        categoryClasses.forEach(className => categoryElement.classList.add(className));
        categoryElement.dataset.taskId = taskElement.dataset.taskId;

        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        const formattedTime = `${task.start_time.slice(0, 5)} - ${task.end_time.slice(0, 5)}`;
        timeElement.textContent = formattedTime;

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('description');
        descriptionElement.textContent = task.description;

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const editButton = document.createElement('button');
        editButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" fill="none">
                <path stroke="#666" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12.844 7.14 15 4.422l-3.75-3L9 4.005m3.844 3.134L6 14.75l-4.5 1.5.75-4.5L9 4.005m3.844 3.134L9 4.005"/>
            </svg>
        `;
        editButton.addEventListener('click', () => {
            const originalTask = {
                id: task.id,
                category: task.category,
                startTime: task.start_time,
                endTime: task.end_time,
                description: task.description,
                date: task.date
            };
            editTask(
                taskElement,
                categoryElement,
                task.start_time.split(':')[0],
                task.start_time.split(':')[1],
                task.end_time.split(':')[0],
                task.end_time.split(':')[1],
                task.description,
                originalTask
            );
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" fill="none">
                <path stroke="#666" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.5 2.364h-4L2.833 16h9.334L13.5 2.364h-4m-4 0c.443-1.018.853-1.357 2-1.364 1.29.043 1.603.462 2 1.364m-4 0h4M4.167 5.5l.666 7.773m6-7.773-.666 7.773M7.5 5.5v7.773"/>
            </svg>
            `;
        deleteButton.addEventListener('click', () => {
            deleteTask(task.id);
        });

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        taskElement.appendChild(categoryElement);
        taskElement.appendChild(timeElement);
        taskElement.appendChild(descriptionElement);
        taskElement.appendChild(buttonContainer);

        tasksContainer.appendChild(taskElement);
    }

    // Переход на следующий день
    nextDayButton.addEventListener('click', () => {
        if (!(currentDate instanceof Date)) {
            console.warn("currentDate был перезаписан, восстанавливаю значение...");
            currentDate = new Date(); // Восстанавливаем значение
        }
    
        if (currentDate instanceof Date) {
            currentDate.setDate(currentDate.getDate() + 1);
        } else {
            console.error("currentDate не является объектом Date!");
        }
        updateDateDisplay();
    });

    // Переход на предыдущий день
    prevDayButton.addEventListener('click', () => {
        if (!(currentDate instanceof Date)) {
            console.warn("currentDate был перезаписан, восстанавливаю значение...");
            currentDate = new Date(); // Восстанавливаем значение
        }
    
        if (currentDate instanceof Date) {
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            console.error("currentDate не является объектом Date!");
        }
        updateDateDisplay();
    });

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
            saveTask(
                categoryElement,
                startTimeHour.value,
                startTimeMinute.value,
                endTimeHour.value,
                endTimeMinute.value,
                descriptionInput.value,
                taskElement
            );
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

    function saveTask(categoryElement, startHour, startMinute, endHour, endMinute, description, taskElement, taskId = null) {
        if (!startHour || !startMinute || !description) {
            alert('Пожалуйста, укажите время и опишите задачу');
            return;
        }

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
                id: taskId,
                category: categoryElement.className,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                description: description
            };
            editTask(
                taskElement,
                categoryElement,
                startHour,
                startMinute,
                endHour,
                endMinute,
                description,
                originalTask
            );
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

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        taskElement.innerHTML = '';
        taskElement.appendChild(categoryElement);
        taskElement.appendChild(timeElement);
        taskElement.appendChild(descriptionElement);
        taskElement.appendChild(buttonContainer);
        
        const task = {
            category: categoryElement.className,
            start_time: formatTime(startHour, startMinute),
            end_time: endHour && endMinute ? formatTime(endHour, endMinute) : '',
            description: description,
            date: currentDate.toISOString().split('T')[0]
        };
        console.log('Task being created:', task);
        //если есть taskId, выполняем PUT-запрос (редактирование)
        const url = taskId ? `${apiBaseUrl}${taskId}/` : apiBaseUrl;
        const method = taskId ? 'PUT' : 'POST';
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
            .then(response => {
                if (!response.ok) {
                    console.error(`Network response was not ok: ${response.statusText}`);
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(savedTask => {
                taskElement.remove();
                addTaskToDOM(savedTask);
                sortTasks();
            })
            .catch(error => console.error('Error saving task:', error));
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
            saveTask(
                categoryContainer,
                startTimeHour.value,
                startTimeMinute.value,
                endTimeHour.value,
                endTimeMinute.value,
                descriptionInput.value,
                taskElement,
                originalTask.id
            );
            const task = {
                category: categoryContainer.className.split(' ')[1],
                start_time: `${startTimeHour.value.padStart(2, '0')}:${startTimeMinute.value.padStart(2, '0')}`,
                end_time: `${endTimeHour.value.padStart(2, '0')}:${endTimeMinute.value.padStart(2, '0')}`,
                description: descriptionInput.value,
                date: originalTask.date
            };
            console.log(`Task ID: ${originalTask.id}`);
            fetch(`api/tasks/${originalTask.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            })
                .then(response => {
                    if (!response.ok) {
                        console.error(`Network response was not ok: ${response.statusText}`);
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                /*
                .then(updatedTask => {
                    console.log('Attempting to remove taskElement:', taskElement);
                    if (tasksContainer.contains(taskElement)) {
                        tasksContainer.removeChild(taskElement);
                    } else {
                        console.warn('taskElement is not a child of tasksContainer');
                    }
                    addTaskToDOM(updatedTask);
                    sortTasks();
                }) */
                .then(savedTask => {
                    console.log(`Adding task to DOM: ${savedTask.id}`);
                    addTaskToDOM(savedTask);
                    sortTasks();
                })
                .catch(error => console.error('Error saving task:', error));
        });

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
                if (!originalTask.id) {
                    console.error('Task ID is null or undefined, cannot edit task.');
                    return; // Прекращаем выполнение, если ID задачи некорректен
                }
                editTask(
                    taskElement,
                    taskElement.querySelector('.category'),
                    originalTask.startTime.split(':')[0],
                    originalTask.startTime.split(':')[1],
                    originalTask.endTime.split(':')[0],
                    originalTask.endTime.split(':')[1],
                    originalTask.description,
                    originalTask
                );
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
        const tasksArray = Array.from(tasksContainer.getElementsByClassName('task'));
        tasksArray.sort((a, b) => {
            const timeAElement = a.querySelector('.time');
            const timeBElement = b.querySelector('.time');
            const timeA = timeAElement ? timeAElement.textContent.split(' ')[0] : '';
            const timeB = timeBElement ? timeBElement.textContent.split(' ')[0] : '';
            return timeA.localeCompare(timeB, undefined, { numeric: true, sensitivity: 'base' });
        });
        tasksArray.forEach(task => tasksContainer.appendChild(task));
    }

    function deleteTask(taskId) {
        fetch(`/api/tasks/${taskId}/`, { // Убедитесь, что URL совпадает с маршрутом на сервере
            method: 'DELETE'
        }).then(response => {
            if (!response.ok) {
                throw new Error('Ошибка удаления задачи');
            }
            loadTasksForDate(currentDate); // Обновляем список задач после удаления
        }).catch(error => console.error('Ошибка удаления задачи:', error));
    }

    updateDateDisplay();
});