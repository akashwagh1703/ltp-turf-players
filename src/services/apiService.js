import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';

// Auth Services
export const authService = {
  sendOtp: (phone) => api.post(API_ENDPOINTS.SEND_OTP, { phone }),
  verifyOtp: (phone, otp, name) => api.post(API_ENDPOINTS.VERIFY_OTP, { phone, otp, name }),
  logout: () => api.post(API_ENDPOINTS.LOGOUT),
  getProfile: () => api.get(API_ENDPOINTS.GET_PROFILE),
  updateProfile: (data) => api.put(API_ENDPOINTS.UPDATE_PROFILE, data),
};

// Turf Services
export const turfService = {
  getTurfs: (params) => api.get(API_ENDPOINTS.GET_TURFS, { params }),
  getFeaturedTurfs: () => api.get(API_ENDPOINTS.GET_FEATURED_TURFS),
  getTurfDetails: (id) => api.get(API_ENDPOINTS.GET_TURF_DETAILS(id)),
};

// Slot Services
export const slotService = {
  getAvailableSlots: (turfId, date) => 
    api.get(API_ENDPOINTS.GET_AVAILABLE_SLOTS, { params: { turf_id: turfId, date } }),
};

// Booking Services
export const bookingService = {
  getBookings: (params) => api.get(API_ENDPOINTS.GET_BOOKINGS, { params }),
  createBooking: (slotIds) => api.post(API_ENDPOINTS.CREATE_BOOKING, { slot_ids: Array.isArray(slotIds) ? slotIds : [slotIds] }),
  confirmPayment: (bookingId, paymentMethod) => 
    api.post(API_ENDPOINTS.CONFIRM_PAYMENT(bookingId), { payment_method: paymentMethod }),
  cancelBooking: (bookingId) => api.post(API_ENDPOINTS.CANCEL_BOOKING(bookingId)),
};

// Review Services
export const reviewService = {
  getMyReviews: () => api.get(API_ENDPOINTS.GET_MY_REVIEWS),
  createReview: (bookingId, rating, comment) => 
    api.post(API_ENDPOINTS.CREATE_REVIEW, { booking_id: bookingId, rating, comment }),
};

// Notification Services
export const notificationService = {
  getNotifications: () => api.get(API_ENDPOINTS.GET_NOTIFICATIONS),
  markAsRead: (id) => api.post(API_ENDPOINTS.MARK_NOTIFICATION_READ(id)),
  markAllAsRead: () => api.post(API_ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ),
};

// Banner & FAQ Services
export const contentService = {
  getBanners: () => api.get(API_ENDPOINTS.GET_BANNERS),
  getFaqs: () => api.get(API_ENDPOINTS.GET_FAQS),
};

// Coupon Services
export const couponService = {
  getAvailableCoupons: () => api.get(API_ENDPOINTS.GET_AVAILABLE_COUPONS),
  validateCoupon: (code, amount) => 
    api.post(API_ENDPOINTS.VALIDATE_COUPON, { code, amount }),
};
