import classNames from "classnames";
import React, { useRef, useState } from "react";

const Autocomplete = ({ items, value, onChange }) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <div
      className={classNames({
        "dropdown w-full": true,
        "dropdown-open": open,
      })}
      ref={ref}
    >
      <input
        type="text"
        className="input input-bordered w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Select or Search..."
        tabIndex={0}
      />
      <div className="dropdown-bottom dropdown-hover">
        <ul
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          style={{ width: ref.current ? ref.current.clientWidth : "auto" }}
        >
          {items.map((item, index) => (
            <li
              key={index}
              tabIndex={index + 1}
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
            //   className="border-b border-b-base-content/10 w-full"
            >
              <button>{item}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Autocomplete;
