import emailjs from '@emailjs/browser';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || '';

const buildTicketHTML = ({ bookingId, busData, selectedSeats, passengerForm, paymentMethod, totalPrice }) => {
  const seats = selectedSeats
    .map(s => `<span style="background:#d84e55;color:#fff;padding:4px 12px;border-radius:6px;font-size:13px;font-weight:600;display:inline-block;margin:2px;">Seat ${s.seatNumber}${s.deckType && s.deckType !== 'single' ? ` (${s.deckType})` : ''}</span>`)
    .join(' ');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:20px;background:#f0f0f0;font-family:Segoe UI,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
    
    <div style="background:#1a1a2e;color:#fff;padding:24px 30px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-size:22px;font-weight:700;letter-spacing:1px;">🎫 E-TICKET</div>
        <div style="font-size:12px;opacity:0.7;margin-top:4px;">Bus Ticket Confirmation</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px;opacity:0.7;">BOOKING ID</div>
        <div style="font-size:18px;font-weight:700;margin-top:4px;">${bookingId}</div>
      </div>
    </div>

    <div style="padding:24px 30px;">

      <div style="background:#f8f9fa;border-radius:10px;padding:20px;margin-bottom:20px;text-align:center;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:24px;font-weight:800;color:#1a1a2e;">${busData.from}</div>
            <div style="font-size:13px;color:#6c757d;">${busData.departureTime}</div>
          </div>
          <div style="font-size:28px;color:#d84e55;font-weight:700;">→</div>
          <div>
            <div style="font-size:24px;font-weight:800;color:#1a1a2e;">${busData.to}</div>
            <div style="font-size:13px;color:#6c757d;">${busData.arrivalTime}</div>
          </div>
        </div>
        <div style="margin-top:12px;padding-top:12px;border-top:1px dashed #dee2e6;font-size:13px;color:#6c757d;">
          📅 Travel Date: <strong>${busData.date}</strong>
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="width:50%;padding-right:10px;vertical-align:top;">
            <div style="background:#f8f9fa;border-radius:8px;padding:16px;">
              <div style="font-size:11px;text-transform:uppercase;color:#6c757d;font-weight:600;margin-bottom:10px;">BUS INFORMATION</div>
              <div style="font-size:13px;margin-bottom:6px;"><span style="color:#6c757d;">Bus Name</span><br/><strong>${busData.busName}</strong></div>
              <div style="font-size:13px;margin-bottom:6px;"><span style="color:#6c757d;">Bus Number</span><br/><strong>${busData.busNumber || 'N/A'}</strong></div>
              <div style="font-size:13px;"><span style="color:#6c757d;">Bus Type</span><br/><strong>${busData.busType || 'N/A'}</strong></div>
            </div>
          </td>
          <td style="width:50%;padding-left:10px;vertical-align:top;">
            <div style="background:#f8f9fa;border-radius:8px;padding:16px;">
              <div style="font-size:11px;text-transform:uppercase;color:#6c757d;font-weight:600;margin-bottom:10px;">PAYMENT DETAILS</div>
              <div style="font-size:13px;margin-bottom:6px;"><span style="color:#6c757d;">Total Amount</span><br/><strong style="color:#d84e55;font-size:16px;">₹${totalPrice}</strong></div>
              <div style="font-size:13px;margin-bottom:6px;"><span style="color:#6c757d;">Payment Mode</span><br/><strong>${paymentMethod.toUpperCase()}</strong></div>
              <div style="font-size:13px;"><span style="color:#6c757d;">Booking Date</span><br/><strong>${new Date().toLocaleDateString('en-IN')}</strong></div>
            </div>
          </td>
        </tr>
      </table>

      <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin-bottom:20px;">
        <div style="font-size:11px;text-transform:uppercase;color:#6c757d;font-weight:600;margin-bottom:10px;">SEAT ALLOCATION</div>
        <div>${seats}</div>
        <div style="margin-top:10px;font-size:12px;color:#6c757d;">Total Seats: ${selectedSeats.length} &nbsp;|&nbsp; Price per Seat: ₹${busData.price}</div>
      </div>

      <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin-bottom:20px;">
        <div style="font-size:11px;text-transform:uppercase;color:#6c757d;font-weight:600;margin-bottom:10px;">PASSENGER INFORMATION</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="font-size:13px;color:#6c757d;padding:4px 0;">Name</td>
            <td style="font-size:13px;font-weight:600;text-align:right;">${passengerForm.name}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#6c757d;padding:4px 0;">Email</td>
            <td style="font-size:13px;font-weight:600;text-align:right;">${passengerForm.email}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#6c757d;padding:4px 0;">Phone</td>
            <td style="font-size:13px;font-weight:600;text-align:right;">${passengerForm.phone}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#6c757d;padding:4px 0;">Age / Gender</td>
            <td style="font-size:13px;font-weight:600;text-align:right;">${passengerForm.age || 'N/A'} / ${passengerForm.gender}</td>
          </tr>
        </table>
      </div>

      <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:14px;font-size:12px;color:#856404;">
        <strong>Important Instructions:</strong><br/>
        • Carry a valid government ID proof &nbsp;|&nbsp; Report 30 mins before departure &nbsp;|&nbsp; Show this ticket at boarding
      </div>

    </div>

    <div style="background:#f8f9fa;padding:16px 30px;text-align:center;font-size:11px;color:#6c757d;border-top:1px solid #e9ecef;">
      Thank you for choosing <strong>Raj Mudra Travels</strong> 🚌 &nbsp;|&nbsp; Support: support@rajmudratravels.com
    </div>
  </div>
</body>
</html>`;
};

export const sendTicketEmail = async (params) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY to .env');
    return { success: false, reason: 'not_configured' };
  }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email:    params.passengerForm.email,
      to_name:     params.passengerForm.name,
      booking_id:  params.bookingId,
      ticket_html: buildTicketHTML(params),
      subject:     `🎫 Booking Confirmed! ${params.bookingId} | ${params.busData.from} → ${params.busData.to}`,
    }, PUBLIC_KEY);
    return { success: true };
  } catch (err) {
    console.error('EmailJS error:', err);
    return { success: false, reason: err?.text || err?.message };
  }
};
