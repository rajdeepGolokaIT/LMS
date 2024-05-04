import { useEffect, useState } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import CalendarView from "../../components/CalendarView";
import moment from "moment";
import axios from "axios";
import DatePicker from "react-tailwindcss-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { openRightDrawer } from "../common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../../utils/globalConstantUtil";
import { showNotification } from "../common/headerSlice";
import { BASE_URL } from "../../Endpoint";

// const INITIAL_EVENTS = CALENDAR_INITIAL_EVENTS

function Calendar() {
  const dispatch = useDispatch();
  const {isOpen} = useSelector(state => state.rightDrawer)
  const [events, setEvents] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false); // State to manage modal visibility
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    theme: "",
    date: "", // Default to current date
  });

  useEffect(() => {
    fetchNotes();
    if (!isOpen) {
        fetchNotes();
      }
  }, [isOpen]);
  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/notes/all`
      );
      setEvents(response.data);
      
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make POST request to API endpoint
      await axios.post(
        `${BASE_URL}/api/v1/notes/create`,
        formData
      );
      dispatch(showNotification({ message: "New Event Added!", status: 1 }));
      document.getElementById("note_modal").close();
      fetchNotes();
      setFormData(
        {
          title: "",
          content: "",
          theme: "",
          date: "",
        }
      )
    } catch (error) {
      console.error("Error adding event:", error);
      dispatch(showNotification({ message: "Error adding event!", status: 0 }));
    }
  };

  const openModal = (date) => {
    if(date === null){
        return false;
    } else {
        setFormData({ ...formData, date: moment(date).format("YYYY-MM-DD") });
    }
    document.getElementById("note_modal").showModal();
  };

  
  console.log(formData);
  // Add your own Add Event handler, like opening modal or random event addition
  // Format - {title :"", theme: "", startTime : "", endTime : ""}, typescript version comming soon :)
  const addNewEvent = (date) => {
    // let randomEvent = INITIAL_EVENTS[Math.floor(Math.random() * 10)]
    let newEventObj = {
      title: formData.title,
      content: formData.content,
      theme: formData.theme,
      startTime: moment(date).startOf("day"),
      endTime: moment(date).endOf("day"),
    };
    setEvents([...events]);
    dispatch(showNotification({ message: "New Event Added!", status: 1 }));
  };

  // Open all events of current day in sidebar
  const openDayDetail = ({ filteredEvents, title }) => {
    dispatch(
      openRightDrawer({
        header: title,
        bodyType: RIGHT_DRAWER_TYPES.CALENDAR_EVENTS,
        extraObject: { filteredEvents },
      })
    );
  };

  const handleDateChange = (date) => {
    // const formattedDate = moment(date.startDate).format("DD-MM-YYYY");
    setFormData({ ...formData, date: date.startDate });
  };

  return (
    <>
    <div className="grid mt-5 grid-cols-1 gap-6">
      <CalendarView
        calendarEvents={events}
        addNewEvent={openModal}
        openDayDetail={openDayDetail}
      />
      </div>
      <dialog id="note_modal" className="modal">
        <div className="modal-box w-11/12 max-w-4xl ">
          <TitleCard title="Add Event" topMargin="mt-2">

            <form onSubmit={handleSubmit} className="space-y-3">
            <label
              onClick={() => document.getElementById("note_modal").close()}
              htmlFor="note_modal"
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label htmlFor="title" className="label label-text text-base">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full input input-bordered input-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="context" className="label label-text text-base">
                  Content
                </label>
                <input
                  type="text"
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full input input-bordered input-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="theme" className="label label-text text-base">
                  Theme Colour :
                </label>
                <select
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={(e) =>
                    setFormData({ ...formData, theme: e.target.value })
                  }
                  className="w-full select select-bordered select-primary"
                  required
                >
                  {/* Dropdown options for theme */}
                  <option value="">Select Colour</option>
                  <option value="BLUE">Blue</option>
                  <option value="GREEN">Green</option>
                  <option value="PURPLE">Purple</option>
                  <option value="ORANGE">Orange</option>
                  <option value="PINK">Pink</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="expenseDate"
                  className="label label-text text-base"
                >
                  Expense Date:
                </label>
                <DatePicker
                  inputClassName="w-full input input-bordered input-primary"
                  useRange={false}
                  asSingle={true}
                  displayFormat={"DD/MM/YYYY"}
                  value={{ startDate: formData.date, endDate: formData.date }}
                  onChange={handleDateChange}
                  required
                />
              </div>
            </div>
              <div className="flex justify-center ">
                <button type="submit" className="btn btn-primary w-full ">
                  Add Event
                </button>
              </div>
            </form>
          </TitleCard>
        </div>
      </dialog>
    </>
  );
}

export default Calendar;
