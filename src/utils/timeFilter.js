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
  if (searchDate !== today) return true;
  
  const departureMinutes = parseTimeToMinutes(departureTime);
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Only treat as next-day if current time is after 10 PM AND departure is before 6 AM
  if (now.getHours() >= 22 && departureMinutes < 360) return true;
  
  return departureMinutes >= currentMinutes + 60;
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