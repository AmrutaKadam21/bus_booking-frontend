export const getGenderIcon = (gender) => {
  if (gender === 'female') return '👩';
  if (gender === 'male') return '👨';
  return '👤';
};

export const getSeatStatusWithGender = (seat, userGender, allSeats, busType) => {
  const isSleeper = busType && busType.toLowerCase().includes('sleeper');

  // Not a sleeper — no gender restriction
  if (!isSleeper) {
    return { ...seat, canBook: seat.status === 'available', message: '', blocked: false };
  }

  // Seat itself is already booked — just show gender icon
  if (seat.status === 'booked') {
    return {
      ...seat,
      canBook: false,
      message: '',
      blocked: false,
      genderIcon: seat.bookedByGender ? getGenderIcon(seat.bookedByGender) : null,
    };
  }

  // Find adjacent berth (odd↔even pairs: 1-2, 3-4, 5-6 ...)
  const seatNum = parseInt(seat.seatNumber);
  const pairNum = seatNum % 2 === 1 ? seatNum + 1 : seatNum - 1;
  const pairSeat = allSeats.find(s => s.seatNumber === String(pairNum));
  const pairGender = pairSeat?.bookedByGender || null;
  const pairBooked = pairSeat?.status === 'booked';

  // Adjacent berth booked by female → ONLY female allowed
  if (pairBooked && pairGender === 'female') {
    if (userGender === 'female') {
      return { ...seat, canBook: true, message: '✅ Female-only berth', blocked: false };
    }
    return {
      ...seat,
      canBook: false,
      message: '🚫 Reserved for female passengers only',
      blocked: true,
    };
  }

  // Adjacent berth booked by male → only male allowed
  if (pairBooked && pairGender === 'male') {
    if (userGender === 'male') {
      return { ...seat, canBook: true, message: '', blocked: false };
    }
    return {
      ...seat,
      canBook: false,
      message: '🚫 Adjacent berth occupied by a male passenger',
      blocked: true,
    };
  }

  // Adjacent empty or no gender info — anyone can book
  return { ...seat, canBook: true, message: '', blocked: false };
};
