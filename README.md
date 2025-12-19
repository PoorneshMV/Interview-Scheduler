# 📧 Weekday Interview Scheduler

> A beautiful, modern web application for automated interview scheduling and email communication powered by Airtable

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18%2B-green.svg)
![Status](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)

## ✨ Features

- 🎨 **Beautiful Modern UI** - Responsive design with smooth animations and gradients
- 📊 **Airtable Integration** - Cloud database with zero setup
- 📤 **CSV Upload** - Automatic data splitting by interview rounds
- ✉️ **Email Automation** - MailerSend API integration
- ⏱️ **TAT Tracking** - Automatic turnaround time calculation
- 📈 **Real-time Dashboard** - Live statistics and data management
- 🔍 **Filtering & Search** - Filter by company, status, and more
- 📋 **Email Logging** - Complete history of all sent emails
- 🚀 **Bulk Operations** - Send multiple emails at once
- 💾 **Zero Database Setup** - Airtable handles everything

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Airtable account (free)
- MailerSend account (free)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
npm start
```

Server runs at: **http://localhost:3000**

### 3. Configure in App
1. Go to **Configure Airtable** tab
2. Add your Airtable Token and Base ID
3. Add your MailerSend API Key
4. Click **Test Connection**

**That's it!** ✅

## 📖 Complete Setup Guide

See [AIRTABLE_SETUP.md](./AIRTABLE_SETUP.md) for detailed step-by-step instructions on:
- Creating Airtable base and table
- Getting API keys
- Configuring the app
- Uploading and processing CSV
- Sending emails
- Tracking results

## 🎯 How It Works

### 1. Upload CSV
```
Company,Interviewer,Interviewer Email,Candidate,Candidate Email,Scheduling method,Added On
Amazon,Jeff,jeff@amazon.com,Rahul,rahul@email.com,"Round1: link1
Round2: link2",04 Nov
```

### 2. Automatic Splitting
CSV data is automatically split by interview rounds:
- 1 candidate with 3 rounds → 3 separate rows in Airtable
- Each row has its own Calendly link
- TAT is tracked per round

### 3. Send Emails
- Select pending emails
- Send bulk or individual emails
- Each gets personalized Calendly link
- TAT automatically calculated

### 4. Track Results
- View all records with status
- Check TAT in minutes
- Complete email logs
- Real-time Airtable sync

## 🎨 Beautiful UI Features

✅ Modern gradient design with smooth animations
✅ Responsive layout (mobile, tablet, desktop)
✅ Real-time statistics dashboard
✅ Smooth tab transitions and modals
✅ Color-coded status badges
✅ Professional email previews
✅ Loading states and visual feedback
✅ Accessible form controls

## 🛠️ Tech Stack

- **Backend**: Express.js + Node.js
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Database**: Airtable API
- **Email**: MailerSend API
- **Styling**: Modern CSS with gradients and animations
- **Icons**: Font Awesome 6

## 📁 Project Structure

```
weekday-interview-scheduler/
├── public/
│   ├── index.html          # Beautiful frontend UI
│   └── app.js              # Airtable integration logic
├── server.js               # Express backend
├── package.json            # Dependencies
├── .env.example            # Environment template
├── AIRTABLE_SETUP.md       # Detailed setup guide
├── README.md               # This file
└── uploads/                # Temporary CSV storage
```

## 🔧 Configuration

Set environment variables in `.env`:

```env
PORT=3000
NODE_ENV=development
MAILERSEND_API_KEY=your_key_here
```

Configure Airtable and MailerSend in the app UI:
- Save to browser localStorage
- No .env file needed for API keys (stored securely in browser)

## 🌐 Airtable Table Schema

| Column | Type | Purpose |
|--------|------|---------|
| Company | Text | Company name |
| Interviewer | Text | Interviewer name |
| Interviewer Email | Email | Interviewer email |
| Candidate | Text | Candidate name |
| Candidate Email | Email | Interview invite goes here |
| Round Number | Number | Interview round (1, 2, 3...) |
| Calendly Link | URL | Scheduling link |
| Added On | Text | Record creation time |
| Email Status | Select | pending / sent |
| Email Sent At | Date | When email was sent |
| TAT Minutes | Number | Turnaround time in minutes |

## 📧 Email Features

### Automatic Email Includes
- Personalized candidate greeting
- Company and interviewer info
- Interview round number
- Clickable Calendly button
- Professional signature

### Customization
Edit email template in `public/app.js`:
```javascript
function generateEmailHTML(record) {
  // Customize HTML template here
}
```

## 📊 CSV Format

Your CSV file should have these columns (exactly):
```
Company,Interviewer,Interviewer Email,Candidate,Candidate Email,Scheduling method,Added On
```

### Multiple Interview Rounds
```
Round1: https://calendly.com/interview/12345
Round2: https://calendly.com/interview/54321
Round3: https://calendly.com/interview/99999
```

The app automatically splits this into 3 separate Airtable records!

## 🚀 Deployment

### Heroku
```bash
git push heroku main
heroku config:set MAILERSEND_API_KEY=your_key
```

### Railway.app
1. Connect your GitHub repo
2. Add MAILERSEND_API_KEY variable
3. Deploy automatically on push

### Vercel
1. Import repository
2. Set environment variables
3. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for more options.

## 📊 API Endpoints

### Email Operations
- `POST /api/send-email` - Send email for record
- `GET /api/email-logs` - Get email history

### Airtable
All Airtable operations done client-side via JavaScript:
- Configuration stored in localStorage
- Direct API calls from frontend
- No server-side Airtable operations needed

## 🔐 Security

🔒 **API Keys**: Stored in browser localStorage
🔒 **Airtable Tokens**: Personal access tokens with minimal scopes
🔒 **MailerSend Keys**: Email sending scope only
🔒 **HTTPS Recommended**: For production deployment

### For Production
- Move API keys to server environment variables
- Add authentication layer
- Implement rate limiting
- Use Airtable Teams plan
- Enable CORS properly

## 🐛 Troubleshooting

### "Connection Failed"
- ✓ Verify Airtable token is correct
- ✓ Check Base ID format
- ✓ Ensure token has data access scopes
- ✓ Check browser console for errors (F12)

### CSV Not Processing
- ✓ Verify column names match exactly (case-sensitive)
- ✓ Check "Scheduling method" has proper format
- ✓ Ensure no extra spaces or blank rows
- ✓ Try with sample CSV first

### Emails Not Sending
- ✓ Verify MailerSend API key is correct
- ✓ Check email addresses are valid
- ✓ Verify MailerSend account is active
- ✓ Check browser network tab for API errors

### Data Not Showing
- ✓ Click Refresh in Data tab
- ✓ Verify Airtable configuration
- ✓ Check Airtable base directly
- ✓ Clear browser cache

## 📚 Resources

- **Airtable Setup**: [AIRTABLE_SETUP.md](./AIRTABLE_SETUP.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Airtable Docs**: https://airtable.com/developers
- **MailerSend Docs**: https://developers.mailersend.com

## 💡 Tips & Tricks

### Bulk Email Tips
1. Filter pending emails in Data tab first
2. Go to Emails tab and select all
3. Send at off-peak hours for better delivery
4. Check email logs after sending

### CSV Preparation
1. Export from Excel/Google Sheets as CSV
2. Verify column names before upload
3. Use sample CSV to test first
4. Check for empty rows at end

### TAT Optimization
1. Add emails immediately after creating records
2. Process emails in batches
3. Monitor TAT trends in dashboard
4. Adjust timing based on TAT data

## 🎓 Example Workflow

1. **Prepare Data**
   - Get interview data from recruiting team
   - Organize in CSV format
   - Test with sample records

2. **Configure App**
   - Set up Airtable base
   - Get API keys
   - Enter in Configure tab

3. **Upload & Split**
   - Upload CSV file
   - System automatically splits rounds
   - Verify data in Data tab

4. **Send Emails**
   - Go to Emails tab
   - Select pending emails
   - Send to all candidates

5. **Track Results**
   - Monitor Email Status
   - Check TAT calculations
   - Review Email Logs
   - Analyze in Airtable

## 📈 Next Steps

- ✅ Follow setup guide
- ✅ Test with sample CSV
- ✅ Send test emails
- ✅ Deploy to production
- ✅ Customize email template
- ✅ Set up scheduled tasks
- 🚀 Scale to full recruitment

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit improvements
- Share feedback

## 📄 License

MIT License - Use freely in personal and commercial projects

## 🙌 Support

- Check documentation files
- Review browser console (F12) for errors
- Test with sample data first
- Verify API keys and permissions

---

## 🎉 Ready to Get Started?

1. `npm install`
2. `npm start`
3. Open http://localhost:3000
4. Follow the **Configure Airtable** tab
5. Upload your CSV
6. Send emails!

**That's it!** You now have a beautiful, automated interview scheduling system. 🚀

---

**Built with ❤️ for seamless interview coordination**

*Weekday Interview Scheduler - Making recruitment beautiful and efficient*
