import classNames from "classnames";
import React, { useRef, useState } from "react";

const Autocomplete = ({ items, value, onChange }) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setOpen(true); // Always open the dropdown when input changes
  };

  return (
    <div
      className={classNames({
        "dropdown w-full": true,
        "dropdown-open": open, // Use 'dropdown-open' when open
      })}
      ref={ref}
    >
      <input
        type="text"
        className="input input-bordered mx-auto my-2 input-sm w-full min-w-[160px]"
        value={value}
        onChange={handleInputChange}
        placeholder="Select or Search..."
        tabIndex={0}
        onFocus={() => setOpen(true)} // Open dropdown when input is focused
      />
      <div className={classNames({
        "dropdown-content z-[1] p-2 shadow bg-base-100 grid grid-cols-1 rounded-box h-52 overflow-auto": true,
        "hidden": !open, // Use 'hidden' class when dropdown is closed
      })} style={{ width: ref.current ? ref.current.clientWidth : "auto" }}>
        {items.map((item, index) => (
          <li
            key={index}
            tabIndex={index + 1}
            onClick={() => {
              onChange(item);
              setOpen(false);
            }}
            className="border-b border-b-base-content/10 w-full text-sm text-left"
          >
            <button>{item}</button>
          </li>
        ))}
      </div>
    </div>
  );
};

export default Autocomplete;
