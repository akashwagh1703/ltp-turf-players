// API Endpoints for Player App
export const API_ENDPOINTS = {
  // Auth
  SEND_OTP: '/auth/send-otp',
  VERIFY_OTP: '/auth/verify-otp',
  LOGOUT: '/auth/logout',
  GET_PROFILE: '/me',
  UPDATE_PROFILE: '/auth/profile',

  // Turfs
  GET_TURFS: '/turfs',
  GET_FEATURED_TURFS: '/turfs/featured',
  GET_TURF_DETAILS: (id) => `/turfs/${id}`,

  // Slots
  GET_AVAILABLE_SLOTS: '/slots/available',

  // Bookings
  GET_BOOKINGS: '/bookings',
  CREATE_BOOKING: '/bookings',
  CONFIRM_PAYMENT: (id) => `/bookings/${id}/confirm-payment`,
  CANCEL_BOOKING: (id) => `/bookings/${id}/cancel`,

  // Reviews
  GET_MY_REVIEWS: '/reviews/my',
  CREATE_REVIEW: '/reviews',

  // Notifications
  GET_NOTIFICATIONS: '/notifications',
  MARK_NOTIFICATION_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_NOTIFICATIONS_READ: '/notifications/read-all',

  // Banners & FAQs
  GET_BANNERS: '/banners',
  GET_FAQS: '/faqs',

  // Coupons
  GET_AVAILABLE_COUPONS: '/coupons/available',
  VALIDATE_COUPON: '/coupons/validate',
};
