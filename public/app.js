let allData = [];
let selectedIds = new Set();
let config = {
  airtableToken: localStorage.getItem('airtableToken') || '',
  airtableBaseId: localStorage.getItem('airtableBaseId') || '',
  airtableTableName: localStorage.getItem('airtableTableName') || 'Interviews',
  mailersendKey: localStorage.getItem('mailersendKey') || '',
  fromEmail: localStorage.getItem('fromEmail') || 'noreply@weekday.com'
};

// Airtable API Base URL
const AIRTABLE_API = 'https://api.airtable.com/v0';

// Tab switching
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(tabName).classList.add('active');
  event.target.closest('.tab-btn').classList.add('active');

  if (tabName === 'data') loadData();
  if (tabName === 'emails') loadEmailsTab();
  if (tabName === 'logs') loadLogs();
}

// Configuration
function saveConfiguration() {
  const token = document.getElementById('airtableToken').value;
  const baseId = document.getElementById('airtableBaseId').value;
  const tableName = document.getElementById('airtableTableName').value;
  const mailersend = document.getElementById('mailersendKey').value;
  const email = document.getElementById('fromEmail').value;

  if (!token || !baseId || !tableName || !mailersend || !email) {
    showMessage('configMessage', 'error', '❌ Please fill all fields');
    return;
  }

  localStorage.setItem('airtableToken', token);
  localStorage.setItem('airtableBaseId', baseId);
  localStorage.setItem('airtableTableName', tableName);
  localStorage.setItem('mailersendKey', mailersend);
  localStorage.setItem('fromEmail', email);

  config = { airtableToken: token, airtableBaseId: baseId, airtableTableName: tableName, mailersendKey: mailersend, fromEmail: email };
  
  showMessage('configMessage', 'success', '✅ Configuration saved!');
  loadConfigValues();
}

function loadConfigValues() {
  document.getElementById('airtableToken').value = config.airtableToken;
  document.getElementById('airtableBaseId').value = config.airtableBaseId;
  document.getElementById('airtableTableName').value = config.airtableTableName;
  document.getElementById('mailersendKey').value = config.mailersendKey;
  document.getElementById('fromEmail').value = config.fromEmail;
}

function testConfiguration() {
  if (!config.airtableToken || !config.airtableBaseId) {
    showMessage('configMessage', 'error', '❌ Configuration incomplete. Save first.');
    return;
  }

  const btn = event.target;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';

  axios.get(`/api/airtable/test`, {
    params: {
      token: config.airtableToken,
      baseId: config.airtableBaseId,
      tableId: config.airtableTableName
    }
  })
  .then(() => {
    showMessage('configMessage', 'success', '✅ Connection successful!');
  })
  .catch(err => {
    showMessage('configMessage', 'error', `❌ Connection failed: ${err.response?.data?.error || err.message}`);
  })
  .finally(() => {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-flask"></i> Test Connection';
  });
}

// File handling
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const fileLabel = document.querySelector('.upload-icon').parentElement;
    fileLabel.innerHTML = `<i class="fas fa-check" style="color: var(--success);"></i><div style="font-weight: 600;">${file.name}</div>`;
  }
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  document.querySelector('.file-upload-area').classList.remove('dragover');
  
  if (event.dataTransfer.files[0]) {
    document.getElementById('fileInput').files = event.dataTransfer.files;
    handleFileSelect({ target: document.getElementById('fileInput') });
  }
}

function handleDragOver(event) {
  event.preventDefault();
  document.querySelector('.file-upload-area').classList.add('dragover');
}

function handleDragLeave() {
  document.querySelector('.file-upload-area').classList.remove('dragover');
}

// CSV Upload and Processing
function uploadAndProcess() {
  const fileInput = document.getElementById('fileInput');
  if (!fileInput.files[0]) {
    showMessage('uploadMessage', 'error', '❌ Select a CSV file first');
    return;
  }

  if (!config.airtableToken || !config.airtableBaseId) {
    showMessage('uploadMessage', 'error', '❌ Configure Airtable first');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const csv = e.target.result;
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });

      const schedulingMethod = row['Scheduling method'] || '';
      const rounds = parseRounds(schedulingMethod);

      if (rounds.length === 0) {
        records.push({
          Company: row.Company,
          Interviewer: row.Interviewer,
          'Interviewer Email': row['Interviewer Email'],
          Candidate: row.Candidate,
          'Candidate Email': row['Candidate Email'],
          'Round Number': 1,
          'Calendly Link': schedulingMethod,
          'Added On': row['Added On'],
          'Email Status': 'Pending'
        });
      } else {
        rounds.forEach(round => {
          records.push({
            Company: row.Company,
            Interviewer: row.Interviewer,
            'Interviewer Email': row['Interviewer Email'],
            Candidate: row.Candidate,
            'Candidate Email': row['Candidate Email'],
            'Round Number': round.roundNumber,
            'Calendly Link': round.link,
            'Added On': row['Added On'],
            'Email Status': 'Pending'
          });
        });
      }
    }

    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

    // Create records in Airtable
    const batches = [];
    for (let i = 0; i < records.length; i += 10) {
      batches.push(records.slice(i, i + 10));
    }

    let completed = 0;
    batches.forEach(batch => {
      axios.post(`/api/airtable/records`, {
        baseId: config.airtableBaseId,
        tableId: config.airtableTableName,
        token: config.airtableToken,
        records: batch.map(record => ({ fields: record }))
      })
      .then(() => {
        completed++;
        if (completed === batches.length) {
          showMessage('uploadMessage', 'success', `✅ Successfully uploaded ${records.length} records!`);
          loadData();
          fileInput.value = '';
          document.querySelector('.upload-icon').parentElement.innerHTML = `<i class="fas fa-cloud-upload-alt"></i><div style="font-weight: 600; margin-bottom: 8px;">Drop file here or click</div>`;
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-rocket"></i> Upload & Split';
        }
      })
      .catch(err => {
        showMessage('uploadMessage', 'error', `❌ Upload failed: ${err.response?.data?.error || err.message}`);
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-rocket"></i> Upload & Split';
      });
    });
  };

  reader.readAsText(file);
}

function parseRounds(schedulingMethod) {
  const rounds = [];
  const roundRegex = /Round(\d+):\s*(https?:\/\/[^\s]+)/gi;
  let match;

  while ((match = roundRegex.exec(schedulingMethod)) !== null) {
    rounds.push({
      roundNumber: parseInt(match[1]),
      link: match[2]
    });
  }

  if (rounds.length === 0) {
    const urlRegex = /(https?:\/\/[^\n]+)/g;
    const matches = schedulingMethod.match(urlRegex);
    if (matches) {
      matches.forEach((url, idx) => {
        rounds.push({ roundNumber: idx + 1, link: url.trim() });
      });
    }
  }

  return rounds;
}

// Load data
function loadData() {
  if (!config.airtableToken || !config.airtableBaseId) {
    document.getElementById('dataContainer').innerHTML = '<div style="text-align: center; color: #a0aec0;">Configure Airtable first</div>';
    return;
  }

  axios.get(`/api/airtable/records`, {
    params: {
      token: config.airtableToken,
      baseId: config.airtableBaseId,
      tableId: config.airtableTableName
    }
  })
  .then(res => {
    allData = res.data.records.map(r => ({ ...r.fields, id: r.id }));
    renderData(allData);
    loadStats();
    updateFilters(allData);
  })
  .catch(err => {
    document.getElementById('dataContainer').innerHTML = `<div style="text-align: center; color: #f56565;">Error loading data: ${err.response?.data?.error || err.message}</div>`;
  });
}

function loadStats() {
  const stats = {
    total: allData.length,
    sent: allData.filter(d => d['Email Status'] === 'sent').length,
    pending: allData.filter(d => d['Email Status'] === 'pending').length,
    avgTat: (allData.filter(d => d['TAT Minutes']).reduce((sum, d) => sum + parseFloat(d['TAT Minutes']), 0) / allData.filter(d => d['TAT Minutes']).length).toFixed(2)
  };

  document.getElementById('statsContainer').innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Total Records</div>
      <div class="stat-value">${stats.total}</div>
    </div>
    <div class="stat-card" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);">
      <div class="stat-label">Sent</div>
      <div class="stat-value">${stats.sent}</div>
    </div>
    <div class="stat-card" style="background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);">
      <div class="stat-label">Pending</div>
      <div class="stat-value">${stats.pending}</div>
    </div>
    <div class="stat-card" style="background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);">
      <div class="stat-label">Avg TAT</div>
      <div class="stat-value">${isNaN(stats.avgTat) ? 'N/A' : stats.avgTat + 'm'}</div>
    </div>
  `;
}

function renderData(data) {
  if (data.length === 0) {
    document.getElementById('dataContainer').innerHTML = '<div style="text-align: center; padding: 40px; color: #a0aec0;">No data yet. Upload a CSV to get started.</div>';
    return;
  }

  let html = `
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Candidate</th>
            <th>Email</th>
            <th>Round</th>
            <th>Status</th>
            <th>TAT (min)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  `;

  data.forEach(row => {
    const status = row['Email Status'] || 'pending';
    const tat = row['TAT Minutes'] ? parseFloat(row['TAT Minutes']).toFixed(2) : '—';
    const badgeClass = status === 'sent' ? 'badge-success' : 'badge-warning';
    
    html += `
      <tr>
        <td>${row.Company}</td>
        <td>${row.Candidate}</td>
        <td>${row['Candidate Email']}</td>
        <td>Round ${row['Round Number']}</td>
        <td><span class="badge ${badgeClass}">${status}</span></td>
        <td>${tat}</td>
        <td>
          <div class="action-buttons">
            ${status === 'pending' ? `<button class="btn btn-secondary" onclick="sendEmail('${row.id}')">Send</button>` : ''}
            <button class="btn btn-secondary" onclick="previewEmail('${row.id}')">Preview</button>
          </div>
        </td>
      </tr>
    `;
  });

  html += '</tbody></table></div>';
  document.getElementById('dataContainer').innerHTML = html;
}

function updateFilters(data) {
  const companies = [...new Set(data.map(d => d.Company).filter(Boolean))];
  const select = document.getElementById('companyFilter');
  select.innerHTML = '<option value="">All</option>';
  companies.forEach(company => {
    const option = document.createElement('option');
    option.value = company;
    option.textContent = company;
    select.appendChild(option);
  });
}

function filterData() {
  let filtered = allData;
  const company = document.getElementById('companyFilter').value;
  const status = document.getElementById('statusFilter').value;

  if (company) filtered = filtered.filter(d => d.Company === company);
  if (status) filtered = filtered.filter(d => d['Email Status'] === status);

  renderData(filtered);
}

// Email sending
function sendEmail(recordId) {
  const btn = event.target;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

  const record = allData.find(r => r.id === recordId);
  if (!record) return;

  const emailBody = generateEmailHTML(record);

  axios.post('/api/send-email', {
    to: record['Candidate Email'],
    candidate: record.Candidate,
    subject: `Interview Invitation - Round ${record['Round Number']} at ${record.Company}`,
    html: emailBody,
    recordId: recordId,
    airtableTableName: config.airtableTableName,
    airtableBaseId: config.airtableBaseId,
    airtableToken: config.airtableToken,
    mailersendKey: config.mailersendKey,
    fromEmail: config.fromEmail
  }, {
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => {
    showMessage('dataContainer', 'success', `✅ Email sent! TAT: ${res.data.tat} min`);
    loadData();
  })
  .catch(err => {
    showMessage('dataContainer', 'error', `❌ ${err.response?.data?.error || err.message}`);
  })
  .finally(() => {
    btn.disabled = false;
    btn.innerHTML = 'Send';
  });
}

function generateEmailHTML(record) {
  return `
    <h2>Interview Invitation</h2>
    <p>Dear ${record.Candidate},</p>
    <p>We are pleased to invite you for <strong>Round ${record['Round Number']}</strong> of the interview process with <strong>${record.Company}</strong>.</p>
    <p><strong>Interview Details:</strong></p>
    <ul>
      <li>Company: ${record.Company}</li>
      <li>Interviewer: ${record.Interviewer}</li>
      <li>Round: ${record['Round Number']}</li>
    </ul>
    <p><a href="${record['Calendly Link']}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Schedule Interview</a></p>
    <p>Best regards,<br/>Weekday Team</p>
  `;
}

function loadEmailsTab() {
  if (!config.airtableToken) {
    document.getElementById('emailsContainer').innerHTML = '<div style="text-align: center; color: #a0aec0;">Configure Airtable first</div>';
    return;
  }

  const pending = allData.filter(d => d['Email Status'] === 'pending');
  if (pending.length === 0) {
    document.getElementById('emailsContainer').innerHTML = '<div style="text-align: center; padding: 40px; color: #a0aec0;">No pending emails</div>';
    return;
  }

  let html = `<div class="table-responsive"><table><thead><tr><th></th><th>Candidate</th><th>Company</th><th>Round</th></tr></thead><tbody>`;
  pending.forEach(row => {
    html += `
      <tr>
        <td><input type="checkbox" value="${row.id}" onchange="toggleSelect('${row.id}')"></td>
        <td>${row.Candidate}</td>
        <td>${row.Company}</td>
        <td>Round ${row['Round Number']}</td>
      </tr>
    `;
  });
  html += '</tbody></table></div>';
  document.getElementById('emailsContainer').innerHTML = html;
}

function toggleSelect(id) {
  if (selectedIds.has(id)) selectedIds.delete(id);
  else selectedIds.add(id);
}

function selectAllPending() {
  allData.filter(d => d['Email Status'] === 'pending').forEach(d => selectedIds.add(d.id));
  loadEmailsTab();
}

function sendSelectedEmails() {
  if (selectedIds.size === 0) {
    showMessage('bulkEmailMessage', 'error', '❌ Select at least one email');
    return;
  }

  const btn = event.target;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  let completed = 0;
  const total = selectedIds.size;

  selectedIds.forEach(id => {
    sendEmail(id);
    completed++;
  });

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
}

function previewEmail(recordId) {
  const record = allData.find(r => r.id === recordId);
  if (!record) return;

  document.getElementById('previewContent').innerHTML = `
    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0;">
      <strong>From:</strong> ${config.fromEmail}<br>
      <strong>To:</strong> ${record['Candidate Email']}<br>
      <strong>Subject:</strong> Interview Invitation - Round ${record['Round Number']} at ${record.Company}
    </div>
    <div style="font-size: 14px; line-height: 1.8; color: #2d3748;">
      ${generateEmailHTML(record)}
    </div>
  `;
  document.getElementById('previewModal').classList.add('show');
}

function closePreview() {
  document.getElementById('previewModal').classList.remove('show');
}

function loadLogs() {
  // Load from API
  axios.get('/api/email-logs')
  .then(res => {
    if (res.data.length === 0) {
      document.getElementById('logsContainer').innerHTML = '<div style="text-align: center; padding: 40px; color: #a0aec0;">No email logs yet</div>';
      return;
    }

    let html = `<div class="table-responsive"><table><thead><tr><th>Email</th><th>Name</th><th>Round</th><th>Sent At</th><th>Status</th></tr></thead><tbody>`;
    res.data.forEach(log => {
      html += `
        <tr>
          <td>${log.candidate_email}</td>
          <td>${log.candidate_name}</td>
          <td>Round ${log.round_number}</td>
          <td>${new Date(log.sent_at).toLocaleString()}</td>
          <td><span class="badge badge-success">${log.status}</span></td>
        </tr>
      `;
    });
    html += '</tbody></table></div>';
    document.getElementById('logsContainer').innerHTML = html;
  })
  .catch(err => {
    document.getElementById('logsContainer').innerHTML = `<div style="text-align: center; color: #f56565;">Error: ${err.message}</div>`;
  });
}

function showMessage(containerId, type, message) {
  const container = document.getElementById(containerId);
  const div = document.createElement('div');
  div.className = `message message-${type}`;
  div.textContent = message;
  container.insertBefore(div, container.firstChild);
  setTimeout(() => div.remove(), 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadConfigValues();
  loadData();
});

document.getElementById('previewModal').addEventListener('click', (e) => {
  if (e.target.id === 'previewModal') closePreview();
});
