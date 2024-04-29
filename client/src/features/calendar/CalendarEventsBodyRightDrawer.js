import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {fetchNotes} from "./index";
import axios from "axios";
import DatePicker from "react-tailwindcss-datepicker";
import TitleCard from "../../components/Cards/TitleCard";
import { showNotification } from "../common/headerSlice";
import { CALENDAR_EVENT_STYLE } from "../../components/CalendarView/util";

const THEME_BG = CALENDAR_EVENT_STYLE;

function CalendarEventsBodyRightDrawer({ filteredEvents }) {
    const dispatch = useDispatch();
    // const [data,setData] = useState([]);
  const [selectedId,setSelectedId] = useState(null)
  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    content: '',
    theme: '',
    date: '',
  });
  const [selectedData, setSelectedData] = useState([]);

console.log(formData)
console.log(selectedId)
console.log(filteredEvents)


useEffect(() => {
    getData();
}, []);

const getData = async () => {
    try {
        const date = filteredEvents[0].date
        const response = await axios.get(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/notes/findByDate?date=${date}`);
        setSelectedData(response.data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// useEffect(() => {
//     setFormData({
//         title: filteredEvents.title,
//         content: filteredEvents.content,
//         theme: filteredEvents.theme,
//         date: filteredEvents.date,
//     });
// }, [filteredEvents]);

    const updateModal = (id) => {
        setSelectedId(id);
        setFormData(selectedData.filter(e => e.id === id)[0]);
        console.log(formData);
        document.getElementById('update_modal').showModal();
    }

    const deleteModal = (id) => {
        setSelectedId(id);
        document.getElementById('delete_modal').showModal();
    }

    const deleteNoteCard = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.delete(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/notes/delete/${selectedId}`);
            document.getElementById("delete_modal").close();
            getData();
            dispatch(showNotification({ message: " Event Deleted!", status: 1 }));
            
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    }

    const handleDateChange = (date) => {
        // const formattedDate = moment(date.startDate).format("DD-MM-YYYY");
        setFormData({ ...formData, date: date.startDate });
      };
    const updateNoteCard = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/notes/update/${selectedId}`, formData);
            document.getElementById("update_modal").close();
            getData()
            dispatch(showNotification({ message: " Event Updated!", status: 1 }));
            setFormData(
            {
             id: 0,
             title: "",
             content: "",
             theme: "",
             date: "",
            }
            )

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

  return (
    <>
      {selectedData.map((e, k) => {
        return (
          <div
            key={k}
            className={`grid mt-3 p-3 `}
          >
            <div className={`card ${THEME_BG[e.theme] || ""} `}>
              <div className="card-body">
                <h2 className="card-title">{e.title}</h2>
                <p>{e.content}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-success btn-sm" onClick={() => updateModal(e.id)}>Edit</button>
                  <button className="btn btn-error btn-sm" onClick={() => deleteModal(e.id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <dialog id="update_modal" className="modal">
      <div className="modal-box w-11/12 max-w-4xl ">
          <TitleCard title="Add Event" topMargin="mt-2">

            <form onSubmit={updateNoteCard} className="space-y-3">
            <label
              onClick={() => document.getElementById("update_modal").close()}
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
                <button type="submit" className="btn btn-primary w-full">
                  Update
                </button>
              </div>
            </form>
          </TitleCard>
        </div>
      </dialog>

      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <TitleCard title="Delete Modal" topMargin="mt-2">
            <h1 className="text-xl text-center">Are you sure you want to delete this event?</h1>
            <div className="modal-action">
              <button
                
                className="btn btn-error"
                onClick={deleteNoteCard}
              >
                Delete
              </button>
              <button
                onClick={() => document.getElementById("delete_modal").close()}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </TitleCard>
        </div>
      </dialog>
    </>
  );
}

export default CalendarEventsBodyRightDrawer;
