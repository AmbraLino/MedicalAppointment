import React from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";

const NotificationsTab = ({ appointments, handleMarkAsViewed }) => {
  return (
    <Card className="border-0 shadow-sm p-4 content-card">
      <h5 className="section-title mb-4">Last Notifications</h5>
      <div className="notifications-page-list">
        {appointments.map((app) => (
          <div key={app._id} className={`notification-full-card p-3 mb-3 border rounded-3 bg-white shadow-sm ${app.isViewed ? 'opacity-75 bg-light' : ''}`}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex gap-2">
                <div className={app.isViewed ? "gray-bullet-dot mt-1" : "blue-bullet-dot mt-1"}></div>
                <div>
                  <h6 className={`fw-bold mb-1 ${app.isViewed ? 'text-muted' : 'text-dark'}`}>
                    {app.status === 'pending' ? 'Appointment Request' : 'Confirmed Appointment'}
                  </h6>
                </div>
              </div>
              <Button 
                variant={app.isViewed ? "light" : "success"} 
                size="sm" 
                onClick={() => handleMarkAsViewed(app._id)} 
                disabled={app.isViewed}
              >
                {app.isViewed ? "✓ Viewed" : "Mark as viewed"}
              </Button>
            </div>

            {/* Detajet e vizitës të zgjeruara */}
            <Row className="g-3 bg-light p-3 rounded-3 mt-1">
              <Col md={2} xs={6}><small className="text-muted d-block">Patient</small><span className="fw-bold small">{app.fullName}</span></Col>
              <Col md={2} xs={6}><small className="text-muted d-block">Phone</small><span className="fw-bold small">{app.phoneNumber || "N/A"}</span></Col>
              <Col md={2} xs={6}><small className="text-muted d-block">Date</small><span className="fw-bold small">{app.preferredDate}</span></Col>
              <Col md={2} xs={6}><small className="text-muted d-block">Time</small><span className="fw-bold small">{app.preferredTime}</span></Col>
              <Col md={2} xs={6}>
              <small className="text-muted d-block">Type</small>
              {/* <span className="fw-bold small text-primary">{app.appointmentType}</span> */}
              <Badge bg={app.appointmentType === 'emergency' ? 'danger' : 'info'} className="me-1">
                          {app.appointmentType.charAt(0).toUpperCase() + app.appointmentType.slice(1)}
                        </Badge>
              </Col>
              <Col md={2} xs={6}>
                <small className="text-muted d-block">Payment</small>
                <Badge bg={app.isPaid ? "success" : "warning"} className="text-dark">
                  {app.isPaid ? "Paid" : "Unpaid"}
                </Badge>
              </Col>
            </Row>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NotificationsTab;