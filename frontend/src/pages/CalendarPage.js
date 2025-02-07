import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CalendarPage.css";

const CalendarPage = () => {
  const [chatsByDate, setChatsByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedChats, setSelectedChats] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/calendar`, {
          params: { user_id: localStorage.getItem("userId") },
        });
        setChatsByDate(response.data); // Backend returns { "2025-02-06": [...chats], ... }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };

    fetchChats();
  }, []);

  const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

  const renderCalendar = (month, year) => {
    const days = [];
    const firstDay = new Date(year, month - 1, 1).getDay();
    const totalDays = daysInMonth(month, year);
    const prevMonthDays = daysInMonth(month - 1, year);

    // Add gray days for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`prev-${i}`} className="day gray">
          {prevMonthDays - firstDay + i + 1}
        </div>
      );
    }

    // Add days for the current month
    for (let day = 1; day <= totalDays; day++) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const hasChats = chatsByDate[date];
      days.push(
        <div
          key={date}
          className={`day ${hasChats ? "green" : "red"}`}
          onClick={() => handleDayClick(date)}
        >
          {day}
        </div>
      );
    }

    // Add gray days for next month
    const totalCells = days.length % 7 === 0 ? days.length : days.length + (7 - (days.length % 7));
    for (let i = days.length; i < totalCells; i++) {
      days.push(
        <div key={`next-${i}`} className="day gray">
          {i - totalDays - firstDay + 1}
        </div>
      );
    }

    return days;
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setSelectedChats(chatsByDate[date] || []);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
    setSelectedChats([]);
  };

  return (
    <div className="calendar-page">
      {[...Array(12)].map((_, index) => {
        const month = index + 1;
        const year = new Date().getFullYear();
        return (
          <div key={month} className="month">
            <h3>{new Date(year, month - 1).toLocaleString("default", { month: "long" })}</h3>
            <div className="calendar-grid">{renderCalendar(month, year)}</div>
          </div>
        );
      })}

      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h4>Chats on {selectedDate}</h4>
            {selectedChats.length > 0 ? (
              <ul className="chat-list">
                {selectedChats.map((chat) => (
                  <li key={chat._id} className="chat-item">
                    <strong>{chat.chat_name || "Untitled Chat"}</strong>
                    <p>{chat.summary}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No chats on this day.</p>
            )}
            <button className="close-button" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
