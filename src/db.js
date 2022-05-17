let db;
let dbReq = indexedDB.open("myDatabase", 1);
let level = 1,
  pages = 0;
dbReq.onupgradeneeded = function (event) {
  db = event.target.result;
  let todos = db.createObjectStore("todos", { autoIncrement: true });
};
dbReq.onsuccess = function (event) {
  db = event.target.result;
};
dbReq.onerror = function (event) {
  alert("Error while opening database " + event.target.errorCode);
};

export const getUpdates = () => {
  return { level, pages };
};
export const initDb = async () => {
  let allTodos = [];
  async function initPromise() {
    return new Promise(function (resolve, reject) {
      dbReq = indexedDB.open("myDatabase", 1);
      dbReq.onupgradeneeded = function (event) {
        db = event.target.result;
        db.createObjectStore("todos", { autoIncrement: true });
      };
      dbReq.onsuccess = function (event) {
        db = event.target.result;
        allTodos = getAndDisplayTodos(db);
        resolve(allTodos);
      };
      dbReq.onerror = function (event) {
        alert("Error while opening database " + event.target.errorCode);
      };
    });
  }

  allTodos = initPromise().then(function (result) {
    return result;
  });
  return allTodos;
};

function addTodo(db, task) {
  let transaction = db.transaction(["todos"], "readwrite");
  let objectStore = transaction.objectStore("todos");
  let todo = { text: task, check: false, timestamp: Date.now() };
  objectStore.add(todo);

  objectStore.onsuccess = function () {
    console.log(objectStore.result);
  };
  transaction.oncomplete = function () {
    console.log("objectStored your new todo task!");
    // getAndDisplayTodos(db);
  };
  transaction.onerror = function (event) {
    alert("Error while storing the todo " + event.target.errorCode);
  };
}

export const submitTodo = (task) => {
  if (!task) {
    console.error("Please enter a task");
  } else {
    addTodo(db, `${task}`);
  }
};

export const getAndDisplayTodos = (db) => {
  let transaction = db.transaction(["todos"], "readwrite");
  let objectStore = transaction.objectStore("todos");

  let req = objectStore.openCursor();
  let allTodos = [];

  req.onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor != null) {
      let todo = !cursor.value.key
        ? { ...cursor.value, key: cursor.key }
        : cursor.value;
      allTodos.push(todo);
      cursor.continue();
    } else {
      allTodos.sort(function (a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      allTodos.sort(function (a, b) {
        return a.check - b.check;
      });
      pages = allTodos.length;
    }
  };
  req.onerror = function (event) {
    alert("error in cursor request " + event.target.errorCode);
  };
  return allTodos;
};

// new toggle func

export const toggle = async (id) => {
  async function togglePromise() {
    return new Promise(function (resolve, reject) {
      toggleTodo(db, id);
    });
  }

  togglePromise().then(function (result) {
    return;
  });
  return;
};
// old toggle
export const toggleTodo = (db, id) => {
  let checked = document.getElementById(id)?.checked;
  console.log(checked);
  let transaction = db.transaction(["todos"], "readwrite");
  let objectStore = transaction.objectStore("todos");

  let req = objectStore.get(id);
  req.onsuccess = function () {
    let todo = req.result;
    if (todo) {
      todo.check = checked;
      const updateReq = objectStore.put(todo, id);
      console.log(
        "The transaction that originated this request is " +
          updateReq.transaction
      );
      updateReq.onsuccess = () => {
        console.log("Todo toggled");
      };
    } else {
      console.error("Todo not found");
    }
  };
  req.onerror = function (event) {
    alert("Error toggling the todo" + event.target.errorCode);
  };
};
export const loadOnScroll = () => {
  let transaction = db.transaction(["todos"], "readwrite");
  let objectStore = transaction.objectStore("todos");
  objectStore.onsuccess = function () {
    console.log(objectStore.result);
  };
  transaction.oncomplete = function () {
    console.log("New todos loaded");
    level++;
    // getAndDisplayTodos(db, level);
  };
  transaction.onerror = function (event) {
    alert("Error while loading the todo " + event.target.errorCode);
  };
};
