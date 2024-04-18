import React from 'react'
// import ExpensesTable from './components/ExpanseTable'
import SalesPersonGraph from './components/SalesPersonGraph'
import SalesPersonExpenseTable from './components/SalesPersonExpenseTable'

const Expenses = () => {
  return (
    <>
    {/* <ExpensesTable/> */}
    <SalesPersonExpenseTable/>
    <SalesPersonGraph/>
    </>
  )
}

export default Expenses