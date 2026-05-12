// Gender-based seat allocation utilities for sleeper buses

export const getSeatPairInfo = (seatNumber, busType) => {
  if (!busType || !busType.toLowerCase().includes('sleeper')) {
    return { isPaired: false, pairSeat: null };
  }

  const seatNum = parseInt(seatNumber);
  
  // In sleeper buses, seats are paired (lower-upper berths)
  // Odd numbers are lower berths, even numbers are upper berths
  // Pairs: (1,2), (3,4), (5,6), etc.
  
  let pairSeat;
  if (seatNum % 2 === 1) {
    // Odd seat (lower berth) - pair with next seat (upper berth)
    pairSeat = seatNum + 1;
  } else {
    // Even seat (upper berth) - pair with previous seat (lower berth)
    pairSeat = seatNum - 1;
  }
  
  return {
    isPaired: true,
    pairSeat: pairSeat.toString(),
    isLowerBerth: seatNum % 2 === 1,
    isUpperBerth: seatNum % 2 === 0
  };
};

export const checkGenderCompatibility = (selectedSeat, pairSeat, allSeats, userGender) => {
  if (!pairSeat) return { canBook: true, message: '' };
  
  const pairSeatData = allSeats.find(s => s.seatNumber === pairSeat.toString());
  
  if (!pairSeatData) return { canBook: true, message: '' };
  
  // If pair seat is available, user can book
  if (pairSeatData.status === 'available') {
    return { canBook: true, message: '' };
  }
  
  // If pair seat is booked, check gender compatibility
  if (pairSeatData.status === 'booked' && pairSeatData.bookedByGender) {
    if (userGender === 'female' && pairSeatData.bookedByGender === 'female') {
      return { 
        canBook: true, 
        message: 'Suitable - Female passenger area' 
      };
    }
    
    if (userGender === 'male' && pairSeatData.bookedByGender === 'male') {
      return { 
        canBook: true, 
        message: 'Suitable - Male passenger area' 
      };
    }
    
    // Gender mismatch
    if (userGender === 'female' && pairSeatData.bookedByGender === 'male') {
      return { 
        canBook: false, 
        message: 'Not suitable - Male passenger in adjacent berth' 
      };
    }
    
    if (userGender === 'male' && pairSeatData.bookedByGender === 'female') {
      return { 
        canBook: false, 
        message: 'Not suitable - Female passenger in adjacent berth' 
      };
    }
  }
  
  return { canBook: true, message: '' };
};

export const getGenderIcon = (gender) => {
  if (gender === 'female') return '👩';
  if (gender === 'male') return '👨';
  return '👤';
};

export const getSeatStatusWithGender = (seat, userGender, allSeats, busType) => {
  const pairInfo = getSeatPairInfo(seat.seatNumber, busType);
  
  if (!pairInfo.isPaired) {
    return {
      ...seat,
      canBook: seat.status === 'available',
      message: '',
      showGenderIcon: false
    };
  }
  
  const compatibility = checkGenderCompatibility(seat, pairInfo.pairSeat, allSeats, userGender);
  
  return {
    ...seat,
    canBook: seat.status === 'available' && compatibility.canBook,
    message: compatibility.message,
    showGenderIcon: seat.status === 'booked' && seat.bookedByGender,
    genderIcon: seat.bookedByGender ? getGenderIcon(seat.bookedByGender) : null,
    pairInfo
  };
};