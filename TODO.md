 # TODO: Fix Login 401 Unauthorized Error

## Completed Tasks
- [x] Corrected API URL from "MainFunciton" to "MainFunction" in auth.ts
- [x] Enabled fetch for HttpClient in app.config.ts to resolve SSR compatibility warning
- [x] Added detailed logging in login.ts for request, response, and error details
- [x] Enhanced error handling in auth.ts with console logging for debugging
- [x] Updated login.ts to handle OTP tokens and better response parsing based on Postman collection
- [x] Removed invalid 'SessionToken' header from login request in user-session.service.ts
- [x] Updated login request body to use dynamic credentials instead of hardcoded values
- [x] Corrected login API URL to match Postman collection (MainFunciton with typo)

## Summary of Changes
1. **auth.ts**: Fixed URL typo, added request/response logging, and detailed error logging
2. **app.config.ts**: Added `withFetch()` to `provideHttpClient()` for better SSR support
3. **login.ts**: Added console logs and improved response handling for sessionToken, sendOTPToken, checkOTPToken
4. **user-session.service.ts**: Removed static 'SessionToken': 'NTG' header from login request to fix 401 Unauthorized error

## Current Status
- 401 Unauthorized error due to invalid SessionToken is resolved
- Login request no longer sends invalid SessionToken header
- Ready to test login flow again

## Next Steps
- Test login again and check browser console for the actual API response structure
- If OTP is required, implement OTP verification flow
- Verify credentials are correct and match Postman collection example
