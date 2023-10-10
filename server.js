const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3000;

// Your Google Cloud Console credentials
const CLIENT_ID = '739614979663-9l7pom80ij3m4td6ntaksbrkpr6e2rld.apps.googleusercontent.com'; // Replace with your actual client ID
const CLIENT_SECRET = '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'; // Replace with your actual client secret
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback'; // Must match your Google Cloud Console settings

// Create an OAuth2 client
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.use(bodyParser.json());

// Redirect to Google OAuth2 login page
app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
  res.redirect(url);
});

// Handle the callback after Google OAuth2 authentication
app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;

    // Store tokens (access token, refresh token) securely
    // You can save these tokens in a database for future use

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    res.send('Authentication successful!');
  } catch (error) {
    console.error('Error fetching access token:', error);
    res.status(500).send('Error');
  }
});

// Create an instance of the Google Calendar API
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Implement routes for updating, listing, and deleting events here

// Create a new event in Google Calendar
app.post('/create-event', async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  try {
    // Use the access token obtained during OAuth2 authentication
    // You should retrieve the access token from your database or user session

    const accessToken = 'ya29.c.b0Aaekm1KrWZDLJApRu5X4ZZcYQoQD4QsuddnpPtb2ECH_MsVe3ujoywoJC1ef2BqMwraLq4bYVNF_IYponFftcccjX4EtWvylKNEhnuViROWF8wg4VFA6vH3YGWvYl2hHEeqNDE--eu8Mg1oYyJUkU8uq1hPgV_R1_E8KuXg2o6xCj39-aeHgfHXD1TGe5zjLfxM7hnuRvSCuU6ZEPtwUwlAy4q1Nuyhs2dsl_UFhOjsrDQpR7rGyWFvl6TpBLu-r9wbHiX6W_Y4GEpXmBjUAU2wRb_hY932kOIBX1X_b_ydebZYE9kV6WfquO-4qq9QNuR_TFutDQpH4Mpxz0VDePzbb1QorE357A1a-9aQZr3v2b8awWZUBimI7eMfpf6OVMr0wFlMwc86qno54Y0r-MhxOZdIhkbJcrQr9jjzhbdvRF5lB39RzpyZVxuJUycpjBWZO0c09XuIuFU5bl4pIqJz5zbYgMlFjMSjJFRZrxM08u8tXa34V5yBZVwO5_7JXmsjsMkddaWXV5vQs7mpiReXzFiv7zMm9Bn31fdy4Ypqdjwmxqufja1x-ybgwd363at9z2tjzwwfBIqq4frRrXUVqdiQQtvjYBcBV3Zxl6QOfFp1Bc0UjoffzS7VZ0zQW-6m1FVuer8J7Isrmb3x5xvSijX5SSZWbnnyidxFxhJmRYQnV3ll2U77I4dYtcYM36J4y5t-vXR45aRwlrFV4l6vveIgZrv-03qe16eUqxy8qs5Qe-dQaF4W3hx8yVF0jWmcaWbScktsu-s44uy0X8WI-8m0w-xO4b5e1v9vrWOd2VOk6JJtn753034l6edBa6rVxZUS-uyQl1Bt3OWhmtndajuZgcryBavtnlj7oWBwV61bsa3uWcM25n6Z2nzIyYQFn7xmq7_uokJIVkY68jcZn8r97Yt25lU8gs3JjI_dlmcZfX2BjMg_5wZOXrh6wm7q-kt9reJwl6sImaOzi_39us5t7eeWZw9Wzl915qyRleBOvive0ish';

    oauth2Client.setCredentials({ access_token: accessToken });

    const event = {
      summary: title,
      description: description,
      start: {
        dateTime: startDate,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endDate,
        timeZone: 'UTC',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary', // Use 'primary' for the user's primary calendar
      resource: event,
    });

    console.log('Event created:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Error creating event' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
