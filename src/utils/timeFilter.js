// Time filtering utilities for bus search

export const parseTimeToMinutes = (timeString) => {
  if (!timeString) return 0;
  
  try {
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  } catch {
    return 0;
  }
};

export const getCurrentTimeInMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const isValidDepartureTime = (departureTime, searchDate) => {
  if (!departureTime || !searchDate) return false;
  
  const today = new Date().toISOString().split('T')[0];
  const searchDateStr = searchDate;
  
  // If search date is not today, show all buses
  if (searchDateStr !== today) return true;
  
  const departureMinutes = parseTimeToMinutes(departureTime);
  const currentMinutes = getCurrentTimeInMinutes();
  
  // Add 60 minutes (1 hour) buffer to current time
  const minimumDepartureTime = currentMinutes + 60;
  
  // Handle next day departure (e.g., current time 11 PM, departure 1 AM next day)
  if (departureMinutes < currentMinutes) {
    // Assume it's next day departure, so it's valid
    return true;
  }
  
  return departureMinutes >= minimumDepartureTime;
};

export const getTimeFilterMessage = () => {
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  const minimumTime = oneHourLater.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  return {
    currentTime,
    minimumTime,
    message: `Showing buses departing from ${minimumTime} onwards (1 hour from now)`
  };
};