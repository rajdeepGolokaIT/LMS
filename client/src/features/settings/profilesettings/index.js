
import { useEffect, useState } from "react"
import { useDispatch} from "react-redux"
import TitleCard from "../../../components/Cards/TitleCard"
import { showNotification } from '../../common/headerSlice'
import InputText from '../../../components/Input/InputText'
import axios from 'axios'

function ProfileSettings(){


    const dispatch = useDispatch()
    const [user, setUser] = useState({
        username: "",
        nameString: "",
        email: "",
        address: "",
        password: "",
        mobileNumber: "",
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await axios.get("https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/Signup/all")
            const data = response.data[0]
            setUser(data)

        } catch (error) {
            console.error("Error fetching profile:", error)
        }
    }

    // Call API to update profile settings changes
    const updateProfile = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put("https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/Signup/update-user", user)
        dispatch(showNotification({message : "Profile Updated", status : 1}))    
        } catch (error) {
            console.error("Error updating profile:", error)
        dispatch(showNotification({message : "Error updating profile", status : 0}))
        }
    }

    const updateFormValue = ({updateType, value}) => {
        setUser({...user, [updateType] : value})
    }

    console.log(user)

    return(
        <>
            
            <TitleCard title="Profile Settings" topMargin="mt-2">
                <form onSubmit={(e) => updateProfile(e)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Name" defaultValue={user.nameString} updateType={"nameString"} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Email Id" defaultValue={user.email} updateType={"email"} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Username" defaultValue={user.username} updateType={"username"} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Address" defaultValue={user.address} updateType={"address"} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Mobile Number" defaultValue={user.mobileNumber} updateType={"mobileNumber"} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Password" defaultValue={user.password} updateType={"password"} type={"password"} updateFormValue={updateFormValue}/>
                </div>
                {/* <div className="divider" ></div> */}

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
                </div> */}

                <div className="mt-16"><button className="btn btn-primary float-right" >Update</button></div>
                </form>
            </TitleCard>
        </>
    )
}


export default ProfileSettings