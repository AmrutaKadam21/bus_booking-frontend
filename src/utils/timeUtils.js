// Utility functions for time formatting

export const formatDuration = (durationMins) => {
  if (!durationMins || durationMins === "N/A") return "N/A";
  
  // Handle string inputs like "120 mins"
  let mins = durationMins;
  if (typeof durationMins === 'string') {
    mins = parseInt(durationMins.replace(/[^\d]/g, ''));
  }
  
  if (isNaN(mins)) return durationMins;
  
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  
  if (hours === 0) return `${remainingMins}m`;
  if (remainingMins === 0) return `${hours}h`;
  return `${hours}h ${remainingMins}m`;
};

export const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  return timeString;
};

export const calculateDuration = (departureTime, arrivalTime) => {
  // Simple duration calculation (assumes same day)
  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };
  
  try {
    const depMins = parseTime(departureTime);
    const arrMins = parseTime(arrivalTime);
    
    let duration = arrMins - depMins;
    if (duration < 0) duration += 24 * 60; // Next day arrival
    
    return formatDuration(duration);
  } catch {
    return "N/A";
  }
};