import React, { useRef, useState } from "react";

import "./App.css";
import { getUpdates, loadOnScroll, submitTodo } from "./db";

function App() {
  let level = 1,
    pages = 0;
  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const handleSubmit = () => {
    submitTodo();
  };

  const loadMore = () => {
    level++;
    loadOnScroll();
    setLoadMoreButton(false);
  };

  const listInnerRef = useRef();

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        ({ level, pages } = getUpdates());
        if (level >= pages / 10) {
          console.log("That's all the todos");
          return;
        } else if (level % 3 === 0) {
          console.log("3 levels Loadmore button here");
          setLoadMoreButton(true);
        } else {
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
            handleSubmit();
          }}>
          <div id="input-form" className="input-form">
            <div className="input-todo">
              <input
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
          <div id="todos"></div>
        </form>
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
