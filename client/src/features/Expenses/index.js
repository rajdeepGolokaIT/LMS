import React from 'react'
// import ExpensesTable from './components/ExpanseTable'
import SalesPersonGraph from './components/SalesPersonGraph'
import SalesPersonExpenseTable from './components/SalesPersonExpenseTable'

const Expenses = () => {
  return (
    <>
    {/* <ExpensesTable/> */}
    <div className="grid mt-10 grid-cols-1 gap-6">
    <SalesPersonGraph/>
    <SalesPersonExpenseTable/>
    </div>
    </>
  )
}

export default Expenses