import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import './styles.css';

const localizer = momentLocalizer(moment);

function App() {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    reminders: [], // Store reminders as an array of objects
  });

  const [events, setEvents] = useState([]); // Store events to display on the calendar

  const calendar = useRef(null);

  useEffect(() => {
    // Load events from your backend when the component mounts
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await axios.get("/get-events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const createEvent = async () => {
    try {
      const response = await axios.post("/create-event", event);
      console.log("Event created:", response.data);

      // Add the new event to the events array
      setEvents([...events, response.data]);

      // Clear the form
      setEvent({
        title: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        reminders: [],
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleStartDateChange = (date) => {
    setEvent({ ...event, startDate: date });
  };

  const handleEndDateChange = (date) => {
    setEvent({ ...event, endDate: date });
  };

  const handleReminderChange = (e) => {
    const { value } = e.target;
    const reminder = { method: "popup", minutes: parseInt(value) };
    setEvent({ ...event, reminders: [...event.reminders, reminder] });
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h1>Create Google Calendar Event</h1>
        <div className="form-input">
          <h2>Event title:</h2>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={event.title}
            onChange={handleInputChange}
            className="input"
          />
        </div>
        <div className="form-input">
          <h2>Event Description</h2>
          <input
            type="text"
            name="description"
            placeholder="Event Description"
            value={event.description}
            onChange={handleInputChange}
            className="input"
          />
        </div>
        <div className="date-time-picker">
          <div className="date-picker">
            <h2>Event Start Date:</h2>
            <DatePicker
              selected={event.startDate}
              onChange={handleStartDateChange}
              showTimeSelect
              dateFormat="Pp"
              name="startDate"
              placeholderText="Start Date and Time"
              className="input"
            />
          </div>
          <div className="date-picker">
            <h2>Event End Date:</h2>
            <DatePicker
              selected={event.endDate}
              onChange={handleEndDateChange}
              showTimeSelect
              dateFormat="Pp"
              name="endDate"
              placeholderText="End Date and Time"
              className="input"
            />
          </div>
        </div>
        <div className="form-input">
          <h2>Reminders:</h2>
          <select onChange={handleReminderChange} className="input">
            <option value="0">None</option>
            <option value="5">5 minutes before</option>
            <option value="15">15 minutes before</option>
            <option value="30">30 minutes before</option>
            <option value="60">1 hour before</option>
          </select>
        </div>
        <div className="form-button">
          <button onClick={createEvent} className="button">Create Event</button>
        </div>
        
      </div>

      <div className="calendar-container">
        <Calendar
          ref={calendar}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={(event) => {
            const selectedStartDate = moment(event.startDate);
            const selectedEndDate = moment(event.endDate);
            const isEventSelected = (
              selectedStartDate.isSameOrBefore(event.startDate) &&
              selectedEndDate.isSameOrAfter(event.endDate)
            );

            const eventColor = isEventSelected ? "#FFA500" : "#007bff"; // Orange for selected, Blue for others

            const eventStyle = {
              backgroundColor: eventColor,
              borderColor: eventColor,
            };

            return {
              style: eventStyle,
              title: event.reminders.map(
                (reminder) => `Reminder ${reminder.minutes} mins before`
              ),
            };
          }}
        />
      </div>
      <div className="event-details">
        <h1>Event Details</h1>
          <h2>Event Title: {event.title}</h2>
          <p>Event Description: {event.description}</p>
          <p>Start Date: {moment(event.startDate).format("MMMM Do YYYY, h:mm a")}</p>
          <p>End Date: {moment(event.endDate).format("MMMM Do YYYY, h:mm a")}</p>
        </div>
    </div>
  );
}

export default App;
