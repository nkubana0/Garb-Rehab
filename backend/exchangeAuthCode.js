require('dotenv').config();
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// The code you received from the redirect
const authorizationCode = '4/0AcvDMrBPNlrt_pk-EPLFZO6iv2MwncllN70LK2goTHEh48TqGl3BN9hPX7S6Gu3T6N4vRw';

oauth2Client.getToken(authorizationCode, (err, tokens) => {
  if (err) {
    console.error('Error retrieving access token', err);
    return;
  }

  // Set the credentials
  oauth2Client.setCredentials(tokens);

  // Log the tokens
  console.log('Access Token:', tokens.access_token);
  console.log('Refresh Token:', tokens.refresh_token);

  // You can store the tokens in your database or file system for future use
});
