import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    dateRange: null,
    guests: {
      adults: 0,
      children: 0,
      rooms: 0
    },
    location: '',
    searchQuery: ''
  });

  const updateBookingData = (newData) => {
    setBookingData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const updateGuests = (guestData) => {
    setBookingData(prev => ({
      ...prev,
      guests: {
        ...prev.guests,
        ...guestData
      }
    }));
  };

  const resetBookingData = () => {
    setBookingData({
      dateRange: null,
      guests: {
        adults: 0,
        children: 0,
        rooms: 0
      },
      location: '',
      searchQuery: ''
    });
  };

  const value = {
    bookingData,
    updateBookingData,
    updateGuests,
    resetBookingData
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
