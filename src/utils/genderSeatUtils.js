export const getGenderIcon = (gender) => {
  if (gender === 'female') return '👩';
  if (gender === 'male') return '👨';
  return '👤';
};

const findAdjacentSleeperSeat = (seat, allSeats) => {
  if (!seat || !allSeats?.length) return null;
  const deckSeats = allSeats.filter((s) => s.deckType === seat.deckType);
  const index = deckSeats.findIndex((s) => s.seatNumber === seat.seatNumber);
  if (index === -1) return null;

  const rowSize = 3;
  const rowIndex = Math.floor(index / rowSize);
  const rowStart = rowIndex * rowSize;
  const row = deckSeats.slice(rowStart, rowStart + rowSize);
  if (row.length < 3) return null;

  const position = index % rowSize;
  if (position === 1) return row[2];
  if (position === 2) return row[1];
  return null;
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

  const pairSeat = findAdjacentSleeperSeat(seat, allSeats);
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
