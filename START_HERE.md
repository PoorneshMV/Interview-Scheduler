# 🚀 Quick Start Guide

Get your beautiful Weekday Interview Scheduler running in **5 minutes**!

## Step 1: Start Server (30 seconds)

```bash
cd /Users/poorneshmv/Documents/Weekday
npm install   # First time only
npm start
```

Open: **http://localhost:3000**

## Step 2: Get API Keys (2 minutes)

### Airtable Token
- Go to https://airtable.com/account
- Personal Access Tokens → Create Token
- Copy the token

### MailerSend Key  
- Go to https://app.mailersend.com
- Settings → API Tokens → Create
- Copy the token

## Step 3: Setup Airtable Base (1 minute)

1. Create new Airtable base: "Weekday"
2. Create table: "Interviews"
3. Add columns:
   - Company, Interviewer, Candidate, Candidate Email
   - Round Number, Calendly Link
   - Email Status (Select: pending/sent)
   - Email Sent At, TAT Minutes

4. Copy your Base ID from URL

## Step 4: Configure App (1 minute)

In app, go to **Configure Airtable** tab:
- Airtable Token
- Base ID
- MailerSend Key
- From Email

Click **Save & Test Connection**

## Step 5: Upload CSV

1. Go to **Upload CSV** tab
2. Select your CSV file
3. Click **Upload & Split**

Data automatically splits by interview rounds!

## Step 6: Send Emails

1. Go to **Send Emails** tab
2. Click **Select All**
3. Click **Send**

Each candidate gets their Calendly link!

## Step 7: Check Results

- **View Data**: See status and TAT
- **Email Logs**: Complete history
- **Airtable**: Data in real-time

---

## 📋 CSV Format

```
Company,Interviewer,Interviewer Email,Candidate,Candidate Email,Scheduling method,Added On
Amazon,Jeff,jeff@amazon.com,Rahul,rahul@email.com,"Round1: link1
Round2: link2",04 Nov
```

Multiple rounds → Multiple rows automatically!

---

## ✨ Features

✅ Beautiful modern UI with animations
✅ Airtable cloud database (no setup)
✅ MailerSend email integration
✅ Automatic data splitting
✅ TAT calculation
✅ Real-time dashboard
✅ Email logs & tracking
✅ Responsive design

---

## 🆘 Help

- **Setup Issues**: See [AIRTABLE_SETUP.md](./AIRTABLE_SETUP.md)
- **Full Docs**: See [README.md](./README.md)
- **Errors**: Check browser console (F12)
- **API Keys**: See resources above

---

## 🎉 You're Ready!

```bash
npm start
# Open http://localhost:3000
# Follow Configure tab
# Start sending emails! 🚀
```

Enjoy your beautiful interview scheduler! ✨
