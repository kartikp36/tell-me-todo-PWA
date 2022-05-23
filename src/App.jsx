import React, { useEffect, useRef, useState } from "react";

import "./App.css";
import { handleDelete, initDb } from "./db";
import { loadOnScroll, submitTodo } from "./db";
import DisplayTodos from "./DisplayTodos";

function App() {
  const [level, setLevel] = useState(1);
  const [allTodos, setAllTodos] = useState();

  const getTodos = async () => {
    let result = await initDb()();
    setAllTodos(result);
  };
  const handleTrashClick = (key) => {
    handleDelete(key);
    getTodos();
  };
  useEffect(() => {
    getTodos();
  }, []);

  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const [task, setTask] = useState("");

  const handleChange = (e) => {
    setTask(e.target.value);
  };
  const loadMore = () => {
    setLevel(() => level + 1);
    loadOnScroll();
    setLoadMoreButton(false);
  };

  const listInnerRef = useRef();

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        console.log("Level: ", level);
        if (level * 10 >= allTodos.length) {
          console.log("That's all the todos");
          return;
        } else if (level % 3 === 0) {
          console.log("3 levels Loadmore button here");
          setLoadMoreButton(true);
        } else {
          setLevel(() => level + 1);
          setTimeout(() => {
            loadOnScroll();
          }, 2000);
        }
        console.log("End reached");
      }
    }
  };

  return (
    <div
      id="body-scroll"
      className="body-scroll"
      onScroll={onScroll}
      ref={listInnerRef}
      style={{
        height: "100vh",
        overflowY: "auto",
        minWidth: "-webkit-fill-available",
      }}>
      <div id="container">
        <h1 className="heading">
          Here's what you've got,
          <br />
          to do!
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitTodo(task);
            getTodos();
            setTask("");
          }}>
          <div id="input-form" className="input-form">
            <div className="input-todo">
              <input
                onChange={(e) => handleChange(e)}
                value={task}
                autoFocus
                required
                className="border-effect"
                type="text"
                id="input-text"
                name="input-text"
                placeholder="Add new task to do"
              />
              <span className="focus-border"></span>
            </div>
            <input
              type="submit"
              className="submit-btn"
              id="submit-bn"
              name="submit-btn"
              value="Add task"
            />
          </div>
        </form>
        <div id="todos">
          <ul>
            {allTodos?.length > 0 && (
              <DisplayTodos
                key={!!allTodos}
                todos={allTodos}
                level={level}
                handleTrashClick={handleTrashClick}
              />
            )}
          </ul>
        </div>
        <div id="loadmore">
          {loadMoreButton && (
            <button
              id="load-btn"
              className="load-btn"
              onClick={() => loadMore()}>
              Load more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
