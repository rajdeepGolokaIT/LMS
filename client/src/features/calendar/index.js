import { useEffect, useState } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import CalendarView from "../../components/CalendarView";
import moment from "moment";
import axios from "axios";
import DatePicker from "react-tailwindcss-datepicker";
// import { CALENDAR_INITIAL_EVENTS } from '../../utils/dummyData'
import { useDispatch } from "react-redux";
import { openRightDrawer } from "../common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../../utils/globalConstantUtil";
import { showNotification } from "../common/headerSlice";

// const INITIAL_EVENTS = CALENDAR_INITIAL_EVENTS

function Calendar() {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal visibility
  const [formData, setFormData] = useState({
    title: "",
    context: "",
    theme: "",
    date: "", // Default to current date
  });

  useEffect(() => {
    fetchNotes();
  }, []);
  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/notes/all"
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make POST request to API endpoint
      await axios.post(
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/notes/create",
        formData
      );
      dispatch(showNotification({ message: "New Event Added!", status: 1 }));
      document.getElementById("note_modal").close();
      fetchNotes();
      setFormData(
        {
          title: "",
          context: "",
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
      context: formData.context,
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
      <CalendarView
        calendarEvents={events}
        addNewEvent={openModal}
        openDayDetail={openDayDetail}
      />
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
                  Context
                </label>
                <input
                  type="text"
                  id="context"
                  name="context"
                  value={formData.context}
                  onChange={(e) =>
                    setFormData({ ...formData, context: e.target.value })
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
