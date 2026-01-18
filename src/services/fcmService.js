// FCM Service removed - no notification functionality
export const fcmService = {
  initialize: () => {},
  requestPermission: () => {},
  getToken: () => null,
  onMessage: () => {},
  onNotificationOpenedApp: () => {},
  getInitialNotification: () => null,
}

export default fcmService