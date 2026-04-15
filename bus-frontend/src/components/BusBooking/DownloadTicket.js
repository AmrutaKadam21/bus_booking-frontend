const downloadTicket = ({ bookingId, busData, selectedSeats, seats, passengerForm, paymentMethod, totalPrice }) => {
  const ticketWindow = window.open('', '_blank');
  ticketWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bus Ticket - ${bookingId}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f0f0; padding: 40px 20px; display: flex; justify-content: center; min-height: 100vh; }
        .ticket-container { max-width: 900px; width: 100%; }
        .ticket { background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; margin-bottom: 20px; }
        .ticket-header { background: #1a1a2e; color: white; padding: 24px 30px; display: flex; justify-content: space-between; align-items: center; }
        .ticket-header h1 { font-size: 24px; font-weight: 600; letter-spacing: 1px; }
        .ticket-header p { font-size: 12px; opacity: 0.8; margin-top: 5px; }
        .booking-id-badge { text-align: right; }
        .booking-id-badge .label { font-size: 11px; opacity: 0.7; text-transform: uppercase; }
        .booking-id-badge .id { font-size: 18px; font-weight: 700; letter-spacing: 1px; margin-top: 4px; }
        .ticket-body { padding: 30px; }
        .route-section { background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 25px; border: 1px solid #e9ecef; }
        .route-display { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .route-point { flex: 1; text-align: center; }
        .route-point .city { font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 5px; }
        .route-point .time { font-size: 14px; color: #6c757d; font-weight: 500; }
        .route-arrow { font-size: 24px; color: #d84e55; font-weight: 600; }
        .route-date { text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px dashed #dee2e6; font-size: 13px; color: #6c757d; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px; }
        .info-card { background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef; }
        .info-card-title { font-size: 11px; text-transform: uppercase; color: #6c757d; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 12px; }
        .info-card-content { display: flex; flex-direction: column; gap: 8px; }
        .info-row { display: flex; justify-content: space-between; align-items: baseline; }
        .info-label { font-size: 12px; color: #6c757d; }
        .info-value { font-size: 14px; font-weight: 600; color: #1a1a2e; }
        .seats-section { background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 25px; border: 1px solid #e9ecef; }
        .seats-title { font-size: 13px; font-weight: 600; color: #6c757d; margin-bottom: 12px; text-transform: uppercase; }
        .seats-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .seat-item { background: #d84e55; color: white; padding: 6px 14px; border-radius: 6px; font-size: 14px; font-weight: 600; }
        .passenger-details { background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 25px; border: 1px solid #e9ecef; }
        .ticket-footer { background: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: center; }
        .footer-note { font-size: 11px; color: #6c757d; line-height: 1.5; }
        .footer-note p { margin-bottom: 4px; }
        @media print { body { background: white; padding: 0; } .no-print { display: none; } .ticket { box-shadow: none; border: 1px solid #e9ecef; } }
        .action-buttons { display: flex; gap: 15px; justify-content: center; margin-top: 20px; }
        .btn { padding: 12px 30px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-primary { background: #d84e55; color: white; }
        .btn-secondary { background: #6c757d; color: white; }
      </style>
    </head>
    <body>
      <div class="ticket-container">
        <div class="ticket">
          <div class="ticket-header">
            <div><h1>E-TICKET</h1><p>Bus Ticket Confirmation</p></div>
            <div class="booking-id-badge">
              <div class="label">BOOKING ID</div>
              <div class="id">${bookingId}</div>
            </div>
          </div>
          <div class="ticket-body">
            <div class="route-section">
              <div class="route-display">
                <div class="route-point"><div class="city">${busData.from}</div><div class="time">${busData.departureTime}</div></div>
                <div class="route-arrow">→</div>
                <div class="route-point"><div class="city">${busData.to}</div><div class="time">${busData.arrivalTime}</div></div>
              </div>
              <div class="route-date">Travel Date: ${busData.date} | Duration: ${busData.duration || "N/A"}</div>
            </div>
            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-title">BUS INFORMATION</div>
                <div class="info-card-content">
                  <div class="info-row"><span class="info-label">Bus Name</span><span class="info-value">${busData.busName}</span></div>
                  <div class="info-row"><span class="info-label">Bus Number</span><span class="info-value">${busData.busNumber || "N/A"}</span></div>
                  <div class="info-row"><span class="info-label">Bus Type</span><span class="info-value">${busData.busType || "N/A"}</span></div>
                </div>
              </div>
              <div class="info-card">
                <div class="info-card-title">PAYMENT DETAILS</div>
                <div class="info-card-content">
                  <div class="info-row"><span class="info-label">Total Amount</span><span class="info-value">₹${totalPrice}</span></div>
                  <div class="info-row"><span class="info-label">Payment Mode</span><span class="info-value">${paymentMethod.toUpperCase()}</span></div>
                  <div class="info-row"><span class="info-label">Booking Date</span><span class="info-value">${new Date().toLocaleDateString()}</span></div>
                </div>
              </div>
            </div>
            <div class="seats-section">
              <div class="seats-title">SEAT ALLOCATION</div>
              <div class="seats-list">
                ${selectedSeats.map(id => { const seat = seats.find(s => s.id === id); return `<div class="seat-item">Seat ${seat?.seatNumber}</div>`; }).join('')}
              </div>
              <div style="margin-top:12px;font-size:12px;color:#6c757d;">Total Seats: ${selectedSeats.length} | Price per Seat: ₹${busData.price}</div>
            </div>
            <div class="passenger-details">
              <div class="info-card-title">PASSENGER INFORMATION</div>
              <div class="info-grid" style="margin-bottom:0;">
                <div class="info-row"><span class="info-label">Full Name</span><span class="info-value">${passengerForm.name}</span></div>
                <div class="info-row"><span class="info-label">Email</span><span class="info-value">${passengerForm.email}</span></div>
                <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${passengerForm.phone}</span></div>
                <div class="info-row"><span class="info-label">Age / Gender</span><span class="info-value">${passengerForm.age || "N/A"} / ${passengerForm.gender}</span></div>
              </div>
            </div>
          </div>
          <div class="ticket-footer">
            <div class="footer-note">
              <p><strong>Important Instructions:</strong></p>
              <p>• Please carry a valid government ID proof</p>
              <p>• Report at boarding point 30 minutes before departure</p>
              <p>• Show this ticket at the time of boarding</p>
            </div>
            <div class="footer-note" style="text-align:right;">
              <p><strong>Customer Support</strong></p>
              <p>📞 1800-XXX-XXXX</p>
              <p>✉ support@busbooking.com</p>
            </div>
          </div>
        </div>
        <div class="action-buttons no-print">
          <button class="btn btn-primary" onclick="window.print()">Print Ticket</button>
          <button class="btn btn-secondary" onclick="window.close()">Close</button>
        </div>
      </div>
    </body>
    </html>
  `);
  ticketWindow.document.close();
};

export default downloadTicket;
