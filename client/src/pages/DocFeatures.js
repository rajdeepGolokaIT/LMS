import {useState, useRef} from 'react'
import {Link} from 'react-router-dom'
// import DocFeatures from '../features/documentation/DocFeatures'
import Invoices from '../features/Invoices/index'

function ExternalPage(){


    return(
        <div className="">
            {/* <DocFeatures /> */}

            <Invoices />

        </div>
    )
}

export default ExternalPage