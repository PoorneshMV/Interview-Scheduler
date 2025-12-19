# Airtable Setup Guide 📊

This beautiful Weekday Interview Scheduler now uses **Airtable** as the database! Here's how to set it up.

## Step 1: Create Airtable Base

1. Go to [airtable.com](https://airtable.com)
2. Sign up or login
3. Click **Create a workspace**
4. Click **Create Base**
5. Choose **Start from scratch**
6. Name it: **"Weekday Interview Scheduler"**

## Step 2: Create Table Structure

In your new base, create a table called **"Interviews"** with these columns:

| Column Name | Type | Required |
|------------|------|----------|
| Company | Single line text | Yes |
| Interviewer | Single line text | Yes |
| Interviewer Email | Email | Yes |
| Candidate | Single line text | Yes |
| Candidate Email | Email | Yes |
| Round Number | Number | Yes |
| Calendly Link | URL | Yes |
| Added On | Single line text | Yes |
| Email Status | Single select | Yes* |
| Email Sent At | Date | No |
| TAT Minutes | Number | No |

### Single Select Values for "Email Status":
- pending
- sent

## Step 3: Get Airtable API Key

1. Go to [airtable.com/account](https://airtable.com/account)
2. Click **Personal Access Tokens**
3. Click **Create Token**
4. Name it: **"Weekday Scheduler"**
5. Add these scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
6. Select your workspace
7. Click **Create Token**
8. **Copy the token** (you'll need it in the app)

## Step 4: Get Base ID

1. Open your Weekday base
2. Look at the URL: `https://airtable.com/base/appXXXXXXXXXXXXXX`
3. The part after `/base/` is your Base ID
4. **Copy it**

## Step 5: Configure in App

1. Open the Weekday Scheduler website
2. Go to **Configure Airtable** tab
3. Fill in:
   - **Airtable Token**: Paste your token
   - **Base ID**: Paste your base ID
   - **Table Name**: `Interviews`
   - **MailerSend API Key**: Your MailerSend key
   - **From Email**: Your email address
4. Click **Save Configuration**
5. Click **Test Connection** to verify

## Step 6: Prepare Your CSV

Your CSV should have these columns:
```
Company,Interviewer,Interviewer Email,Candidate,Candidate Email,Scheduling method,Added On
```

Example:
```
Company,Interviewer,Interviewer Email,Candidate,Candidate Email,Scheduling method,Added On
Amazon,Jeff Bezoz,jeff@amazon.com,Rahul Verma,rahul@email.com,"Round1: https://calendly.com/interview/41540
Round2: https://calendly.com/interview/97428",04 Nov 1:18
Google,Sundar Pichai,sundar@google.com,Vivaan Bose,vivaan@email.com,"Round1: https://calendly.com/interview/85790
Round2: https://calendly.com/interview/85510
Round3: https://calendly.com/interview/84686",04 Nov 0:50
```

## Step 7: Upload CSV

1. Go to **Upload CSV** tab
2. Select your CSV file
3. Click **Upload & Split**
4. Your data will be automatically split by interview rounds and uploaded to Airtable!

## Step 8: Send Emails

1. Go to **Send Emails** tab
2. Click **Select All** to choose all pending emails
3. Click **Send** to send all emails
4. Each email will have:
   - Personalized candidate name
   - Company and round information
   - Individual Calendly link
   - Professional formatting

## Step 9: Track Results

1. **View Data Tab**: See all records with status and TAT
2. **Email Logs Tab**: Complete history of sent emails
3. **Airtable Dashboard**: See all data updated in real-time

## Features Included

✅ **Beautiful Modern UI** - Responsive design with smooth animations
✅ **Automatic Data Splitting** - CSV rows split by interview rounds
✅ **Email Integration** - Send via MailerSend API
✅ **TAT Calculation** - Automatic turnaround time tracking
✅ **Real-time Updates** - Airtable syncs instantly
✅ **Email Logging** - Complete email history
✅ **Filtering & Search** - Filter by company, status, etc.
✅ **Email Preview** - Preview before sending
✅ **Bulk Operations** - Send multiple emails at once

## How Data Splitting Works

When you upload a CSV with multiple interview rounds:

**Input (1 row):**
```
Google, Sundar, sundar@google.com, Vivaan, vivaan@email.com, "Round1: link1
Round2: link2
Round3: link3", 04 Nov
```

**Output (3 rows in Airtable):**
```
Google, Sundar, sundar@google.com, Vivaan, vivaan@email.com, 1, link1, 04 Nov, pending
Google, Sundar, sundar@google.com, Vivaan, vivaan@email.com, 2, link2, 04 Nov, pending
Google, Sundar, sundar@google.com, Vivaan, vivaan@email.com, 3, link3, 04 Nov, pending
```

Each row gets its own Calendly link and can be tracked separately!

## TAT Calculation

TAT = Email Sent Time - Added On Time

**Example:**
- Record Added: Nov 4, 1:18 PM
- Email Sent: Nov 4, 1:35 PM
- TAT: 17 minutes

This is automatically calculated and stored in Airtable!

## MailerSend Setup

1. Go to [app.mailersend.com](https://app.mailersend.com)
2. Create a free account
3. Go to **Settings** → **API Tokens**
4. Create a token with **email sending** scope
5. Copy the token to the app configuration

## Email Customization

Emails include:
- Personalized greeting with candidate name
- Company and interviewer information
- Interview round number
- Clickable Calendly button
- Professional signature

Edit in `app.js` function `generateEmailHTML()` to customize template.

## Security Notes

🔒 Never commit your `.env` file to Git
🔒 API keys are stored in browser localStorage (for this setup)
🔒 For production, use secure environment variables
🔒 Use personal access tokens with minimal required scopes

## Troubleshooting

### "Connection Failed"
- Verify Airtable token is correct
- Check Base ID format
- Ensure token has proper scopes

### CSV Not Processing
- Verify column names match exactly
- Check "Scheduling method" format
- Ensure no blank rows

### Emails Not Sending
- Verify MailerSend API key
- Check email addresses are valid
- Check MailerSend account status

### Records Not Appearing
- Click Refresh in Data tab
- Check Airtable base directly
- Verify token has write permissions

## Production Deployment

For production use:

1. Set up environment variables in your hosting platform
2. Add authentication to the app
3. Use Airtable Teams plan for better features
4. Set up email domain verification in MailerSend
5. Enable HTTPS
6. Add rate limiting
7. Implement proper error handling

## API Structure

### Airtable Fields

```javascript
{
  "Company": "Amazon",
  "Interviewer": "Jeff Bezos",
  "Interviewer Email": "jeff@amazon.com",
  "Candidate": "John Doe",
  "Candidate Email": "john@email.com",
  "Round Number": "1",
  "Calendly Link": "https://calendly.com/...",
  "Added On": "04 Nov 1:18",
  "Email Status": "sent",
  "Email Sent At": "2024-11-04T13:35:00Z",
  "TAT Minutes": 17
}
```

## Next Steps

1. ✅ Set up Airtable base
2. ✅ Get API keys
3. ✅ Configure in app
4. ✅ Upload CSV
5. ✅ Send emails
6. ✅ Track results
7. 🚀 Deploy to production

## Need Help?

- Airtable Support: https://support.airtable.com
- MailerSend Docs: https://developers.mailersend.com
- Check browser console (F12) for detailed errors

---

**You're all set!** 🎉 Your beautiful Weekday Interview Scheduler is ready to use!
