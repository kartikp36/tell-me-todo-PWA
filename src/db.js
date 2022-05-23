let db;
let dbReq;

export const initDb = () => {
  async function initPromise() {
    return new Promise(function (resolve, reject) {
      dbReq = indexedDB.open("myDatabase", 1);
      dbReq.onupgradeneeded = function (event) {
        db = event.target.result;
        db.createObjectStore("todos", { autoIncrement: true });
      };
      dbReq.onsuccess = function (event) {
        db = event.target.result;
        getAndDisplayTodos(db).then((allTodos) => {
          resolve(allTodos);
        });
      };
      dbReq.onerror = function (event) {
        console.error("Error while opening database " + event.target.errorCode);
        reject(event.target);
      };
    });
  }
  return initPromise;
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
    console.log("Stored your new todo task!");
  };
  transaction.onerror = function (event) {
    console.error("Error while storing the todo " + event.target.errorCode);
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
  return new Promise((resolve, reject) => {
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
        resolve(allTodos);
      }
    };
    req.onerror = function (event) {
      reject(event.target);
      console.error("error in cursor request " + event.target.errorCode);
    };
  });
};

export const toggle = async (id) => {
  let checked = await document.getElementById(id)?.checked;
  let transaction = await db.transaction(["todos"], "readwrite");
  let objectStore = await transaction.objectStore("todos");

  let req = await objectStore.get(id);
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
    console.error("Error toggling the todo" + event.target.errorCode);
  };
};

export const handleDelete = async (id) => {
  let transaction = await db.transaction(["todos"], "readwrite");
  let objectStore = transaction.objectStore("todos");

  let req = await objectStore.delete(id);
  req.onsuccess = function () {
    console.log("The delete transaction was completed" + req);
  };
  req.onerror = function (event) {
    console.error("Error deleting the todo" + event.target.errorCode);
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
  };
  transaction.onerror = function (event) {
    console.error("Error while loading the todo " + event.target.errorCode);
  };
};
