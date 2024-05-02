import {useState, useEffect} from 'react'
import {Link, useLocation} from 'react-router-dom'
import axios from 'axios'
import LandingIntro from './LandingIntro'
import ErrorText from  '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'
import CheckCircleIcon  from '@heroicons/react/24/solid/CheckCircleIcon'

const ResetPassword = () => {

    const INITIAL_USER_OBJ1 = {
        password : ""
    }
    const INITIAL_USER_OBJ2 = {
        password : ""
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [linkSent, setLinkSent] = useState(false)
    const [userObj1, setUserObj1] = useState(INITIAL_USER_OBJ1)
    const [userObj2, setUserObj2] = useState(INITIAL_USER_OBJ2)
    const [token, setToken] = useState("")

    // const TOKEN = localStorage.getItem("jwt")
    // console.log(TOKEN)

    const location = useLocation();

    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');
  
      setToken(token);
      console.log(token);
    }, [location.search]);


    const submitForm = async (e) =>{
        e.preventDefault()
        setErrorMessage("")

        if(userObj1.password.trim() === "" || userObj2.password.trim() === "")return setErrorMessage("Password is required! (use any value)")
        else if(userObj1.password.trim() !== userObj2.password.trim())return setErrorMessage("Passwords do not match!")
        else if(token === "")return setErrorMessage("Invalid token!")
        else{
            setLoading(true)
            const url = `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/auth/password/resetPassword?newPassword=${userObj2.password}&token=${token}`
            console.log(url)
            try {
            const response = await axios.get(url)
            console.log(response.data)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
            setLinkSent(true)
        }
    }

    const updateFormValue1 = ({updateType, value}) => {
        setErrorMessage("")
        setUserObj1({...userObj1, [updateType] : value})
    }
    const updateFormValue2 = ({updateType, value}) => {
        setErrorMessage("")
        setUserObj2({...userObj2, [updateType] : value})
    }


  return (
    <div className="min-h-screen bg-base-200 flex items-center">
    <div className="card mx-auto w-full max-w-5xl  shadow-xl">
        <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
        <div className=''>
                <LandingIntro />
        </div>
        <div className='py-24 px-10'>
            <h2 className='text-2xl font-semibold mb-2 text-center'>Reset Password</h2>

            {
                linkSent && 
                <>
                    <div className='text-center mt-8'><CheckCircleIcon className='inline-block w-32 text-success'/></div>
                    <p className='my-4 text-xl font-bold text-center'>Password Reset successfully!</p>
                    <p className='mt-4 mb-8 font-semibold text-center'>Login with new password</p>
                    <div className='text-center mt-4'><Link to="/login"><button className="btn btn-block btn-primary ">Login</button></Link></div>

                </>
            }

            {
                !linkSent && 
                <>
                    {/* <p className='my-8 font-semibold text-center'>Enter new password</p> */}
                    <form onSubmit={(e) => submitForm(e)}>

                        <div className="mb-4">

                            <InputText type="password" defaultValue={userObj1.password} updateType="password" containerStyle="mt-4" labelTitle="New Password" updateFormValue={updateFormValue1}/>
                            <InputText type="password" defaultValue={userObj2.password} updateType="password" containerStyle="mt-4" labelTitle="Confirm Password" updateFormValue={updateFormValue2}/>


                        </div>

                        <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                        <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Reset Password</button>

                        {/* <div className='text-center mt-4'>Don't have an account yet? <Link to="/register"><button className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Register</button></Link></div> */}
                    </form>
                </>
            }
            
        </div>
    </div>
    </div>
</div>
  )
}

export default ResetPassword