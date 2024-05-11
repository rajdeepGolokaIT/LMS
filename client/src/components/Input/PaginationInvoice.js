import React, { useState, useEffect } from "react";



const Pagination = ({ nPages, currentPage, setCurrentPage }) => {
  
    const pageNumbers = [...Array(nPages + 1).keys()].slice(1);
    // console.log(nPages, currentPage)
    // console.log(pageNumbers)
  
    const goToNextPage = () => {
      if ((currentPage + 1) !== nPages) setCurrentPage(currentPage + 1);
    };
  
    const goToPrevPage = () => {
      if (currentPage !== 0) setCurrentPage(currentPage - 1);
    };
  
    const goToPage = (pageNumber) => {
      //   if (pageNumber >= 1 && pageNumber <= nPages)
      setCurrentPage(pageNumber - 1);
    };
  
    return (
      <nav className="flex justify-start my-4">
        <ul className="join ">
          <li className="join-item">
            <button className="btn btn-ghost" onClick={goToPrevPage}>
              Previous
            </button>
          </li>
          {pageNumbers.map((pgNumber, index) => {
            // console.log(index, currentPage, pgNumber)
            if (
              index <= 2 ||
              index >= nPages - 2 ||
              (index >= currentPage && index <= currentPage)
            ) {
              return (
                <li
                  key={pgNumber}
                  className={`join-item ${
                    currentPage === pgNumber - 1  ? "active" : ""
                  }`}
                >
                  <button
                    className={`btn btn-ghost ${
                      currentPage === pgNumber -1 ? "btn-active" : ""
                    }`}
                    onClick={() => setCurrentPage(pgNumber-1)}
                  >
                    {pgNumber}
                  </button>
                </li>
              );
            } else if (
                (index === 3 && currentPage > 2) ||
                (index === nPages - 3 && currentPage < nPages - 3)
            ) {
              return (
                <li key={pgNumber} className="join-item disabled">
                  <span className="btn btn-ghost">...</span>
                </li>
              );
            } else {
              return null;
            }
          })}
          <li className="join-item">
            <button className="btn btn-ghost" onClick={goToNextPage}>
              Next
            </button>
          </li>
          <li className="join-item">
            <input
              type="number"
              className="input input-bordered w-20 mx-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={currentPage + 1}
              onChange={(e) => goToPage(parseInt(e.target.value))}
            />
          </li>
        </ul>
      </nav>
    );
  };


export default Pagination