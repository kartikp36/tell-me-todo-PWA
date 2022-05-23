import React from "react";
import { toggle } from "./db";
import { BsTrash } from "@react-icons/all-files/bs/BsTrash";

export const DisplayTodos = ({ level, todos, handleTrashClick }) => {
  todos = todos.slice(0, level * 10);
  const listItem = todos.map((todo) => {
    return (
      <li key={todo.key} className={todo.key}>
        <BsTrash
          key={todo.key}
          className="trash"
          onClick={() => handleTrashClick(todo.key)}
        />
        <input
          onChange={() => toggle(todo.key)}
          key={todo.check}
          type="checkbox"
          id={todo.key}
          className={todo.key}
          value={todo.text}
          label={todo.key}
          defaultChecked={todo.check ? true : false}
        />
        <label className="label" htmlFor={todo.key}>
          {`${todo.text}    `}
        </label>
        <br />
        <small className="label-date">
          {new Date(todo.timestamp).toLocaleString()}
        </small>
      </li>
    );
  });

  return <div>{listItem}</div>;
};
export default DisplayTodos;
