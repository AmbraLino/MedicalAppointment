import React from "react";
import { Card } from "react-bootstrap";
import { Calendar as BigCalendar } from 'react-big-calendar';

const CalendarTab = ({ localizer, appointments, parseAppointmentDates, currentCalendarDate, currentView, setCurrentCalendarDate, setCurrentView }) => (
  <Card className="border-0 shadow-sm p-4">
    <div style={{ height: "650px" }}>
      <BigCalendar
        localizer={localizer}
        events={appointments.filter(a => a.status === 'approved').map(app => {
          const { start, end } = parseAppointmentDates(app);
          return {
            id: app._id,
            title: `${app.consultationType === 'online' ? '🌐' : '🏥'} ${app.fullName}`,
            start,
            end,
            resource: app
          };
        })}
        date={currentCalendarDate}
        view={currentView}
        onNavigate={setCurrentCalendarDate}
        onView={setCurrentView}
        views={['month', 'week', 'day']}
        
        // --- Kufizimi i orarit ---
        min={new Date(new Date().setHours(9, 0, 0))}
        max={new Date(new Date().setHours(16, 0, 0))}
        
        // --- Stilimi i ngjyrave ---
        eventPropGetter={(event) => {
          const isOnline = event.resource.consultationType === 'online';
          return {
            style: {
              backgroundColor: isOnline ? '#e1f5fe' : '#e8f5e9',
              color: isOnline ? '#0288d1' : '#2e7d32',
              borderLeft: isOnline ? '5px solid #0288d1' : '5px solid #2e7d32',
              borderRadius: '6px',
            }
          };
        }}
      />
    </div>
  </Card>
);

export default CalendarTab;