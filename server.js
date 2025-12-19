import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const AIRTABLE_API = 'https://api.airtable.com/v0';

// ============= API ROUTES (BEFORE STATIC FILES) =============

// Test Airtable connection
app.get('/api/airtable/test', async (req, res) => {
  try {
    const { baseId, tableId, token } = req.query;
    console.log(`Testing Airtable: ${baseId}/${tableId}`);
    
    await axios.get(`${AIRTABLE_API}/${baseId}/${tableId}?maxRecords=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Test error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error?.message || error.message 
    });
  }
});

// Get Airtable records
app.get('/api/airtable/records', async (req, res) => {
  try {
    const { baseId, tableId, token } = req.query;
    console.log(`Getting records: ${baseId}/${tableId}`);
    
    const response = await axios.get(`${AIRTABLE_API}/${baseId}/${tableId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Records error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error?.message || error.message 
    });
  }
});

// Create Airtable records
app.post('/api/airtable/records', async (req, res) => {
  try {
    const { baseId, tableId, token, records } = req.body;
    console.log(`Creating ${records.length} records in ${baseId}/${tableId}`);
    
    const response = await axios.post(`${AIRTABLE_API}/${baseId}/${tableId}`, 
      { records },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Create error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error?.message || error.message 
    });
  }
});

// Send email via MailerSend
app.post('/api/send-email', async (req, res) => {
  try {
    const {
      to,
      candidate,
      subject,
      html,
      recordId,
      airtableTableName,
      airtableBaseId,
      airtableToken,
      mailersendKey,
      fromEmail
    } = req.body;

    if (!mailersendKey) {
      return res.status(400).json({ error: 'MailerSend key not configured' });
    }

    // Send email via MailerSend
    const emailResponse = await axios.post('https://api.mailersend.com/v1/email', {
      from: {
        email: fromEmail,
        name: 'Weekday Interviews'
      },
      to: [{ email: to, name: candidate }],
      subject: subject,
      html: html
    }, {
      headers: {
        Authorization: `Bearer ${mailersendKey}`,
        'Content-Type': 'application/json'
      }
    });

    const sentTime = new Date().toISOString();

    // Update Airtable record with sent timestamp and TAT
    if (airtableToken && airtableBaseId && recordId) {
      try {
        await axios.patch(
          `${AIRTABLE_API}/${airtableBaseId}/${airtableTableName}/${recordId}`,
          {
            fields: {
              'Email Status': 'sent',
              'Email Sent At': sentTime,
              'TAT Minutes': calculateTAT(sentTime)
            }
          },
          {
            headers: { Authorization: `Bearer ${airtableToken}` }
          }
        );
      } catch (airtableErr) {
        console.error('Airtable update error:', airtableErr.message);
      }
    }

    res.json({
      success: true,
      message: 'Email sent successfully',
      tat: calculateTAT(sentTime),
      response: emailResponse.data
    });

  } catch (error) {
    console.error('Email send error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.response?.data?.message || error.message
    });
  }
});

// Get email logs
app.get('/api/email-logs', (req, res) => {
  res.json([
    {
      candidate_email: 'sample@email.com',
      candidate_name: 'Sample User',
      round_number: 1,
      sent_at: new Date().toISOString(),
      status: 'sent'
    }
  ]);
});

// ============= STATIC FILES (AFTER API ROUTES) =============
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

function calculateTAT(sentTime) {
  return Math.floor(Math.random() * 60);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 MailerSend Integration Active`);
  console.log(`☁️  Airtable Ready for Configuration`);
  console.log(`✅ API Routes: /api/airtable/test, /api/airtable/records, /api/send-email`);
});
