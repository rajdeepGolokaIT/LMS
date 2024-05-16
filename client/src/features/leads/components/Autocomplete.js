import classNames from "classnames";
import React, { useRef, useState, useEffect } from "react";

const Autocomplete = ({ items, value, onChange, className, placeholder, disabled }) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    // Filter items based on input value whenever value changes
    const filtered = items.filter((item) =>
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
        className={`${className} `} // input input-bordered mx-auto my-2 input-sm w-full min-w-[160px]
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder ? placeholder : "Search"}
        tabIndex={0}
        onFocus={() => setOpen(true)}
        disabled={disabled ? true : null}
      />
      <ul
        className={classNames({
          "dropdown-content z-[1] p-2 shadow bg-base-100 grid grid-cols-1 rounded-box h-52 overflow-auto": true,
          hidden: !open,
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
      </ul>
    </div>
  );
};

export default Autocomplete;
