import api from './api';

export const bookingService = {
  getBookings: () => api.get('/bookings'),
  createBooking: (data) => api.post('/bookings', data),
  confirmPayment: (id, data) => api.post(`/bookings/${id}/confirm-payment`, data),
  cancelBooking: (id) => api.post(`/bookings/${id}/cancel`),
};
