import PageContent from "./PageContent"
import LeftSidebar from "./LeftSidebar"
import { useSelector, useDispatch } from 'react-redux'
import RightSidebar from './RightSidebar'
import { useEffect } from "react"
import  {  removeNotificationMessage } from "../features/common/headerSlice"
// import {NotificationContainer, NotificationManager} from 'react-notifications';
// import 'react-notifications/lib/notifications.css';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalLayout from "./ModalLayout"

function Layout(){
  const dispatch = useDispatch()
  const {newNotificationMessage, newNotificationStatus} = useSelector(state => state.header)

  useEffect(() => {
      if(newNotificationMessage !== ""){
          if(newNotificationStatus === 1) {
            toast.success(newNotificationMessage, { autoClose: 10000, theme: "colored", pauseOnHover: true, transition: Zoom});
          } else if(newNotificationStatus === 0) {
            toast.error(newNotificationMessage, { autoClose: 10000, theme: "colored", pauseOnHover: true, transition: Zoom});
          }
          dispatch(removeNotificationMessage());
      }
  }, [newNotificationMessage])

    return(
      <>
        { /* Left drawer - containing page content and side bar (always open) */ }
        <div className="drawer  lg:drawer-open">
            <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
            <PageContent/>
            <LeftSidebar />
        </div>

        { /* Right drawer - containing secondary content like notifications list etc.. */ }
        <RightSidebar />


        {/** Notification layout container */}
        <ToastContainer newestOnTop={true} />

      {/* Modal layout container */}
        <ModalLayout />

      </>
    )
}

export default Layout