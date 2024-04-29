import React, { useState } from "react";
import TopProductsDistributors from "./components/TopProductsDistributors";
import LeastProductsDistributors from "./components/LeastProductsDistributors";

function Charts() {
  return (
    <>
      <div className="grid mt-10 grid-cols-1 gap-6">
        <TopProductsDistributors />
        <LeastProductsDistributors />
      </div>
    </>
  );
}

export default Charts;
