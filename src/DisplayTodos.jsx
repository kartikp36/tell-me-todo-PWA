import React from "react";
import { toggle } from "./db";

export const DisplayTodos = ({ level, todos }) => {
  todos = todos.slice(0, level * 10);
  const listItem = todos.map((todo) => {
    return (
      <li key={todo.key}>
        <input
          onChange={() => toggle(todo.key)}
          key={todo.check}
          type="checkbox"
          id={todo.key}
          className={todo.text}
          value={todo.text}
          label={todo.text}
          defaultChecked={todo.check ? true : false}
        />
        <label className="label" htmlFor={todo.key}>
          {`${todo.text}` +
            "    " +
            " (" +
            new Date(todo.timestamp).toLocaleString() +
            ")"}
        </label>
      </li>
    );
  });

  return (
    <div>
      {listItem}
    </div>
  );
};
export default DisplayTodos;
