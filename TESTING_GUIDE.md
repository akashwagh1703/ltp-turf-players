# LTP Player App - Testing Guide

## Prerequisites
1. Backend running: `php artisan serve --host=0.0.0.0 --port=8000`
2. Phone and PC on same WiFi
3. Expo Go installed on phone

## Start App
```bash
cd ltp-turf-players
npm start -- --tunnel
```

## Test Checklist

### 1. Authentication (Login Screen)
- [ ] Enter phone number (10 digits)
- [ ] Tap "Send OTP" - should show success message
- [ ] Enter OTP: **999999**
- [ ] Tap "Verify & Login" - should navigate to home

**Expected API Calls:**
- POST `/api/v1/player/auth/send-otp` - Status 200
- POST `/api/v1/player/auth/verify-otp` - Status 200, returns token

**Common Issues:**
- Network error: Check backend is running on 0.0.0.0
- 404 error: Check API routes exist
- 400 error: Check OTP is 999999

### 2. Home Screen
- [ ] Shows "Find Your Turf" title
- [ ] Shows 4 sport cards (Football, Cricket, Badminton, Basketball)
- [ ] Shows "Featured Turfs" section
- [ ] Can tap sport card to filter turfs
- [ ] Can tap "See All" to view all turfs

**Expected API Calls:**
- GET `/api/v1/player/turfs/featured` - Status 200

**Common Issues:**
- Empty list: No turfs in database
- Loading forever: API not responding
- Error: Check backend logs

### 3. Turfs Screen
- [ ] Shows list of turfs
- [ ] Each turf shows: name, location, sport, price
- [ ] Can tap turf to view details
- [ ] Pull to refresh works

**Expected API Calls:**
- GET `/api/v1/player/turfs` - Status 200
- GET `/api/v1/player/turfs?sport_type=Football` - Status 200 (filtered)

**Common Issues:**
- No turfs: Add turfs via admin panel
- Wrong data: Check TurfResource fields

### 4. Bookings Screen
- [ ] Shows "My Bookings" title
- [ ] Shows list of bookings
- [ ] Each booking shows: turf name, date, time, amount, status
- [ ] Can cancel confirmed bookings
- [ ] Pull to refresh works

**Expected API Calls:**
- GET `/api/v1/player/bookings` - Status 200
- POST `/api/v1/player/bookings/{id}/cancel` - Status 200

**Common Issues:**
- Empty list: No bookings for this player
- Can't cancel: Check booking status

### 5. Profile Screen
- [ ] Shows user name and phone
- [ ] Shows menu items
- [ ] Can tap "Logout"
- [ ] Logout redirects to login screen

**Expected API Calls:**
- GET `/api/v1/player/me` - Status 200
- POST `/api/v1/player/auth/logout` - Status 200

## API Endpoints to Test

### Auth
```
POST /api/v1/player/auth/send-otp
Body: { "phone": "9876543210" }

POST /api/v1/player/auth/verify-otp
Body: { "phone": "9876543210", "otp": "999999" }

POST /api/v1/player/auth/logout
Headers: Authorization: Bearer {token}

GET /api/v1/player/me
Headers: Authorization: Bearer {token}
```

### Turfs
```
GET /api/v1/player/turfs
GET /api/v1/player/turfs/featured
GET /api/v1/player/turfs/{id}
GET /api/v1/player/turfs?sport_type=Football
```

### Bookings
```
GET /api/v1/player/bookings
Headers: Authorization: Bearer {token}

POST /api/v1/player/bookings
Headers: Authorization: Bearer {token}
Body: {
  "turf_id": 1,
  "booking_date": "2025-12-15",
  "slot_time": "10:00-11:00",
  "amount": 500,
  "payment_method": "cash"
}

POST /api/v1/player/bookings/{id}/cancel
Headers: Authorization: Bearer {token}
```

## Common Errors & Solutions

### 1. "Network Error"
**Cause:** Can't reach backend
**Solution:**
- Check backend running: `php artisan serve --host=0.0.0.0`
- Check IP address matches in api.js
- Check firewall not blocking port 8000

### 2. "401 Unauthorized"
**Cause:** Token expired or invalid
**Solution:**
- Logout and login again
- Check token stored in AsyncStorage
- Check backend sanctum configuration

### 3. "404 Not Found"
**Cause:** Route doesn't exist
**Solution:**
- Check routes in `ltp-apis/routes/api.php`
- Check URL in service files
- Check API prefix is correct

### 4. "500 Internal Server Error"
**Cause:** Backend error
**Solution:**
- Check Laravel logs: `ltp-apis/storage/logs/laravel.log`
- Check database connection
- Check missing columns/tables

### 5. Empty Lists
**Cause:** No data in database
**Solution:**
- Add turfs via admin panel
- Create test bookings
- Check database has data

### 6. App Crashes
**Cause:** Code error
**Solution:**
- Check Metro bundler logs
- Check Expo Go error message
- Check component imports

## Database Setup

Ensure these tables have data:

### Turfs
```sql
SELECT * FROM turfs WHERE status = 'approved';
```
Should have at least 3-5 turfs for testing

### Players
```sql
SELECT * FROM players;
```
Will auto-create on first login

### Bookings
```sql
SELECT * FROM bookings WHERE player_id = ?;
```
Create via app or admin panel

## Performance Testing

- [ ] App loads in < 3 seconds
- [ ] Navigation is smooth
- [ ] Images load properly
- [ ] Pull to refresh works
- [ ] No memory leaks
- [ ] Works on slow network

## Security Testing

- [ ] Can't access protected routes without token
- [ ] Token expires after logout
- [ ] Can't access other players' data
- [ ] OTP is validated properly

## Success Criteria

✅ All screens load without errors
✅ All API calls return expected data
✅ Authentication flow works
✅ Can view turfs and bookings
✅ Can logout successfully
✅ No crashes or freezes

## Report Issues

If you find issues, note:
1. Screen where error occurred
2. Steps to reproduce
3. Error message
4. API endpoint called
5. Expected vs actual behavior
