import React, { useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';

function CalendarPage({ userId }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [chats, setChats] = useState([]);

    const handleDateClick = async (date) => {
        setSelectedDate(date);
        const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/get-chats-by-date`, {
                params: { user_id: userId, date: formattedDate }
            });
            setChats(response.data.chats);
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    return (
        <div>
            <Calendar
                onClickDay={handleDateClick}
                value={selectedDate}
            />
            <div>
                <h2>Chats on {selectedDate.toDateString()}</h2>
                {chats.map((chat, index) => (
                    <div key={index}>
                        <h3>Chat {index + 1}</h3>
                        {chat.messages.map((msg, idx) => (
                            <p key={idx}>
                                <strong>{msg.sender}:</strong> {msg.text}
                            </p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CalendarPage;
