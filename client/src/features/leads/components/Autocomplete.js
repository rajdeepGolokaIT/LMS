import classNames from "classnames";
import React, { useRef, useState, useEffect } from "react";

const Autocomplete = ({ items, value, onChange }) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    // Filter items based on input value whenever value changes
    const filtered = items.filter(item =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [value, items]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setOpen(true);
  };

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
        className="input input-bordered mx-auto my-2 input-sm w-full min-w-[160px]"
        value={value}
        onChange={handleInputChange}
        placeholder="Search..."
        tabIndex={0}
        onFocus={() => setOpen(true)}
      />
      <div
        className={classNames({
          "dropdown-content z-[1] p-2 shadow bg-base-100 grid grid-cols-1 rounded-box h-52 overflow-auto": true,
          "hidden": !open,
        })}
        style={{ width: ref.current ? ref.current.clientWidth : "auto" }}
      >
        {filteredItems.map((item, index) => (
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
