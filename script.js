document.getElementById("date").textContent = new Date().toDateString();

// Theme functionality with persistent storage
function loadTheme() {
    const savedTheme = localStorage.getItem('voidstart-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function saveTheme() {
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('voidstart-theme', 'dark');
    } else {
        localStorage.setItem('voidstart-theme', 'light');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    saveTheme();
}

// Load theme when page loads
loadTheme();

// Theme toggle event listener
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

// Search engine persistence
function loadSearchEngine() {
    const savedEngine = localStorage.getItem('voidstart-search-engine');
    if (savedEngine) {
        document.getElementById('search-engine').value = savedEngine;
    }
}

function saveSearchEngine() {
    const selectedEngine = document.getElementById('search-engine').value;
    localStorage.setItem('voidstart-search-engine', selectedEngine);
}

// Load saved search engine when page loads
loadSearchEngine();

// Save search engine when changed
document.getElementById('search-engine').addEventListener('change', saveSearchEngine);

// Search
document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-input").value;
    const engine = document.getElementById("search-engine").value;
    const urls = {
        google: `https://www.google.com/search?q=${query}`,
        bing: `https://www.bing.com/search?q=${query}`,
        duckduckgo: `https://duckduckgo.com/?q=${query}`,
        yahoo: `https://search.yahoo.com/search?p=${query}`
    };
    window.open(urls[engine], '_blank');
});

// Weather functionality
navigator.geolocation.getCurrentPosition(
    (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const weather = data.current_weather;
                const fahrenheit = (weather.temperature * 9/5) + 32;
                const mph = (weather.windspeed * 1.609344).toFixed(1);
                document.getElementById("weather-info").textContent = 
                    `Temp: ${weather.temperature}°C (${fahrenheit.toFixed(1)}°F)\nWind: ${weather.windspeed} km/h (${mph} mph)`;
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                document.getElementById("weather-info").textContent = "Weather data unavailable";
            });
    },
    (error) => {
        console.error("Error getting location:", error.message);
        document.getElementById("weather-info").textContent = "Location access denied";
    }
);

// Bookmarks functionality
let bookmarks = [];

// Load bookmarks from localStorage
function loadBookmarks() {
    const savedBookmarks = localStorage.getItem('voidstart-bookmarks');
    if (savedBookmarks) {
        bookmarks = JSON.parse(savedBookmarks);
        displayBookmarks();
    }
}

// Save bookmarks to localStorage
function saveBookmarks() {
    localStorage.setItem('voidstart-bookmarks', JSON.stringify(bookmarks));
}

// Display bookmarks in the list
function displayBookmarks() {
    const bookmarkList = document.getElementById('bookmark-list');
    bookmarkList.innerHTML = '';
    
    bookmarks.forEach((bookmark, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'bookmark-item';
        listItem.innerHTML = `
            <a href="${bookmark.url}" target="_blank" class="bookmark-link">${bookmark.name}</a>
            <button onclick="deleteBookmark(${index})" class="bookmark-delete">Delete</button>
        `;
        bookmarkList.appendChild(listItem);
    });
}

// Add new bookmark
function addBookmark() {
    const nameInput = document.getElementById('bookmark-name');
    const urlInput = document.getElementById('bookmark-url');
    const name = nameInput.value.trim();
    let url = urlInput.value.trim();
    
    if (name && url) {
        // Add https:// if no protocol is specified
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        bookmarks.push({ name, url });
        saveBookmarks();
        displayBookmarks();
        
        // Clear inputs
        nameInput.value = '';
        urlInput.value = '';
    }
}

// Delete bookmark
function deleteBookmark(index) {
    bookmarks.splice(index, 1);
    saveBookmarks();
    displayBookmarks();
}

// Add event listeners for bookmarks
document.getElementById('add-bookmark').addEventListener('click', addBookmark);

// Allow Enter key to add bookmark
document.getElementById('bookmark-name').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBookmark();
});

document.getElementById('bookmark-url').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBookmark();
});

// Load bookmarks when page loads
loadBookmarks();

// Todo functionality
let todos = [];

// Load todos from localStorage
function loadTodos() {
    const savedTodos = localStorage.getItem('voidstart-todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
        displayTodos();
    }
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('voidstart-todos', JSON.stringify(todos));
}

// Display todos in the list
function displayTodos() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    todos.forEach((todo, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'todo-item';
        listItem.innerHTML = `
            <div class="todo-content">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                       onchange="toggleTodo(${index})" class="todo-checkbox">
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
            </div>
            <button onclick="deleteTodo(${index})" class="todo-delete">Delete</button>
        `;
        todoList.appendChild(listItem);
    });
}

// Add new todo
function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const text = todoInput.value.trim();
    
    if (text) {
        todos.push({ text, completed: false });
        saveTodos();
        displayTodos();
        
        // Clear input
        todoInput.value = '';
    }
}

// Toggle todo completion
function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    displayTodos();
}

// Delete todo
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    displayTodos();
}

// Add event listeners for todos
document.getElementById('add-todo').addEventListener('click', addTodo);

// Allow Enter key to add todo
document.getElementById('todo-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// Load todos when page loads
loadTodos();
