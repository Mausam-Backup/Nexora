/**
 * Universal Client-Side Export Utilities for PS-6 ERP Compliance
 * Supports CSV generation via Blob and Print-to-PDF formatting
 */

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const sanitize = (val: string | number) => {
    const str = String(val ?? '')
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const csvRows: string[] = []
  csvRows.push(headers.map(sanitize).join(','))

  for (const row of rows) {
    csvRows.push(row.map(sanitize).join(','))
  }

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export interface PrintableReportOptions {
  title: string
  subtitle?: string
  studentInfo?: {
    name: string
    rollNumber: string
    department: string
    semester: number | string
  }
  metaDetails?: Record<string, string | number>
  columns: string[]
  rows: (string | number)[][]
  summaryStats?: { label: string; value: string | number }[]
  statusBadge?: { text: string; variant?: 'success' | 'warning' | 'danger' }
}

export function generatePrintableReport(options: PrintableReportOptions) {
  const printWindow = window.open('', '_blank', 'width=900,height=750')
  if (!printWindow) {
    alert('Please allow popups to generate printable report')
    return
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const badgeColor = options.statusBadge?.variant === 'danger' 
    ? '#dc2626' 
    : options.statusBadge?.variant === 'warning' 
    ? '#d97706' 
    : '#16a34a'

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${options.title}</title>
        <style>
          * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          body { 
            padding: 40px; 
            color: #1e293b; 
            line-height: 1.5; 
            font-size: 13px; 
            position: relative;
            background: #ffffff;
          }
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-35deg);
            font-size: 56px;
            font-weight: 900;
            color: rgba(2, 132, 199, 0.04);
            letter-spacing: 0.25em;
            pointer-events: none;
            z-index: 0;
            white-space: nowrap;
            text-transform: uppercase;
          }
          .content-layer { position: relative; z-index: 1; }
          .header { border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-start; }
          .institution { display: flex; align-items: center; gap: 15px; }
          .logo { width: 50px; height: 50px; background: #0284c7; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; }
          .inst-name { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; }
          .inst-sub { font-size: 12px; color: #64748b; margin: 0; }
          .doc-title { font-size: 22px; font-weight: bold; color: #0284c7; margin-bottom: 4px; }
          .doc-sub { font-size: 13px; color: #64748b; margin-bottom: 20px; }
          .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 25px; }
          .meta-item { display: flex; justify-content: space-between; font-size: 13px; }
          .meta-label { color: #64748b; }
          .meta-val { font-weight: 600; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; border-bottom: 1px solid #cbd5e1; }
          td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          tr:nth-child(even) { background: #f8fafc; }
          .stats-bar { display: flex; gap: 20px; margin-bottom: 30px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 18px; border-radius: 8px; }
          .stat-box { flex: 1; }
          .stat-label { font-size: 11px; text-transform: uppercase; color: #15803d; font-weight: bold; }
          .stat-val { font-size: 18px; font-weight: 800; color: #14532d; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; color: white; background: ${badgeColor}; }
          .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .verification-stamp { display: flex; align-items: center; gap: 10px; }
          .qr-placeholder { width: 44px; height: 44px; background: #0f172a; color: white; font-size: 8px; display: flex; align-items: center; justify-content: center; text-align: center; border-radius: 4px; font-family: monospace; }
          .sig-line { width: 180px; border-top: 1px solid #94a3b8; text-align: center; padding-top: 5px; font-size: 12px; color: #64748b; font-weight: 600; }
          @media print {
            body { padding: 15px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="watermark">NEXORA UNIVERSITY • OFFICIAL</div>
        <div class="content-layer">
        <div class="header">
          <div class="institution">
            <div class="logo">NX</div>
            <div>
              <h1 class="inst-name">NEXORA UNIVERSITY</h1>
              <p class="inst-sub">Autonomous Institute • Accredited Grade 'A+'</p>
              <p class="inst-sub">Office of Academic Administration & Records</p>
            </div>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 12px; color: #64748b; margin: 0;">Date of Issue:</p>
            <p style="font-weight: 600; margin: 0;">${currentDate}</p>
            <p style="font-size: 10px; color: #94a3b8; font-family: monospace; margin: 2px 0 0 0;">NX-AUTH-${Date.now().toString().slice(-6)}</p>
            ${options.statusBadge ? `<div style="margin-top: 8px;"><span class="badge">${options.statusBadge.text}</span></div>` : ''}
          </div>
        </div>

        <div>
          <div class="doc-title">${options.title}</div>
          ${options.subtitle ? `<div class="doc-sub">${options.subtitle}</div>` : ''}
        </div>

        ${options.studentInfo ? `
          <div class="meta-grid">
            <div class="meta-item"><span class="meta-label">Student Name:</span><span class="meta-val">${options.studentInfo.name}</span></div>
            <div class="meta-item"><span class="meta-label">Roll Number:</span><span class="meta-val">${options.studentInfo.rollNumber}</span></div>
            <div class="meta-item"><span class="meta-label">Department:</span><span class="meta-val">${options.studentInfo.department}</span></div>
            <div class="meta-item"><span class="meta-label">Current Semester:</span><span class="meta-val">Semester ${options.studentInfo.semester}</span></div>
          </div>
        ` : ''}

        ${options.metaDetails ? `
          <div class="meta-grid">
            ${Object.entries(options.metaDetails).map(([k, v]) => `
              <div class="meta-item"><span class="meta-label">${k}:</span><span class="meta-val">${v}</span></div>
            `).join('')}
          </div>
        ` : ''}

        ${options.summaryStats ? `
          <div class="stats-bar">
            ${options.summaryStats.map(s => `
              <div class="stat-box">
                <div class="stat-label">${s.label}</div>
                <div class="stat-val">${s.value}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <table>
          <thead>
            <tr>
              ${options.columns.map(c => `<th>${c}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${options.rows.map(row => `
              <tr>
                ${row.map((cell, idx) => `<td style="${idx === 0 ? 'font-weight: 600;' : ''}">${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <div class="verification-stamp">
            <div class="qr-placeholder">[QR PASS]<br/>VERIFIED</div>
            <div>
              <p style="font-size: 11px; font-weight: 700; color: #0f172a; margin: 0;">Institutional Verified Document</p>
              <p style="font-size: 10px; color: #64748b; margin: 0;">Anti-Spreadsheet Unified Ledger</p>
            </div>
          </div>
          <div class="sig-line">
            Controller of Examinations / Registrar
          </div>
        </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}

export interface PrintableIDCardOptions {
  type?: 'student' | 'faculty' | 'admin'
  name: string
  id: string
  rollNumber?: string
  department: string
  course?: string
  year?: string
  section?: string
  validUntil: string
  bloodGroup?: string
  emergencyContact?: string
  avatar?: string
  libraryId?: string
  officeRoom?: string
  joiningYear?: string
}

export function generatePrintableIDCard(options: PrintableIDCardOptions) {
  const printWindow = window.open('', '_blank', 'width=800,height=900')
  if (!printWindow) {
    alert('Please allow popups to download/print your official ID Card')
    return
  }

  const roleTitle = options.type === 'faculty' 
    ? 'FACULTY IDENTITY CARD' 
    : options.type === 'admin' 
    ? 'ADMINISTRATIVE IDENTITY CARD' 
    : 'STUDENT IDENTITY CARD'

  const badgeColor = options.type === 'faculty' ? '#0d9488' : options.type === 'admin' ? '#7c3aed' : '#0284c7'

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>NEXORA ID Card - ${options.name} (${options.id})</title>
        <style>
          * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; }
          body {
            background: #f1f5f9;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
          }
          .actions {
            margin-bottom: 20px;
            display: flex;
            gap: 12px;
          }
          .btn {
            background: #0f172a;
            color: #ffffff;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 600;
            border-radius: 6px;
            cursor: pointer;
          }
          .btn-outline {
            background: #ffffff;
            color: #0f172a;
            border: 1px solid #cbd5e1;
          }
          .card-container {
            width: 350px;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e2e8f0;
            position: relative;
          }
          .card-header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 4px solid ${badgeColor};
          }
          .univ-logo {
            width: 36px;
            height: 36px;
            background: ${badgeColor};
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 16px;
            color: white;
          }
          .univ-info h1 {
            font-size: 15px;
            font-weight: 800;
            letter-spacing: 0.05em;
          }
          .univ-info p {
            font-size: 9px;
            color: #94a3b8;
            letter-spacing: 0.08em;
          }
          .card-type-tag {
            background: ${badgeColor};
            color: white;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-align: center;
            padding: 4px 0;
            text-transform: uppercase;
          }
          .card-body {
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .photo-wrapper {
            position: relative;
            margin-bottom: 14px;
          }
          .photo {
            width: 96px;
            height: 96px;
            border-radius: 50%;
            border: 4px solid #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            object-fit: cover;
            background: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: bold;
            color: #64748b;
          }
          .photo img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
          .name {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 2px;
            text-align: center;
          }
          .designation {
            font-size: 12px;
            color: ${badgeColor};
            font-weight: 700;
            margin-bottom: 12px;
            text-align: center;
          }
          .details-grid {
            width: 100%;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px 16px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 16px;
          }
          .detail-item {
            display: flex;
            flex-direction: column;
          }
          .detail-label {
            font-size: 9px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.05em;
          }
          .detail-val {
            font-size: 11px;
            font-weight: 700;
            color: #1e293b;
            font-family: monospace;
          }
          .card-footer {
            width: 100%;
            border-top: 1px dashed #cbd5e1;
            padding-top: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .barcode-box {
            font-family: monospace;
            font-size: 8px;
            letter-spacing: 2px;
            color: #475569;
            background: #f1f5f9;
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid #cbd5e1;
          }
          .qr-box {
            width: 44px;
            height: 44px;
            background: #0f172a;
            color: white;
            font-size: 7px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            border-radius: 6px;
            font-family: monospace;
          }
          .hologram {
            position: absolute;
            top: 60px;
            right: 16px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffd700, #ff8c00, #00ffff, #ff00ff);
            opacity: 0.85;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 6px;
            font-weight: 900;
            color: #000;
          }
          @media print {
            body { background: #ffffff; padding: 0; min-height: auto; }
            .actions { display: none; }
            .card-container { box-shadow: none; border: 1px solid #94a3b8; page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="actions">
          <button class="btn" onclick="window.print()">Print / Save PDF</button>
          <button class="btn btn-outline" onclick="window.close()">Close</button>
        </div>

        <div class="card-container">
          <div class="hologram">NX-SEC</div>
          <div class="card-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="univ-logo">NX</div>
              <div class="univ-info">
                <h1>NEXORA UNIVERSITY</h1>
                <p>INSTITUTION OF EXCELLENCE</p>
              </div>
            </div>
          </div>
          
          <div class="card-type-tag">${roleTitle}</div>

          <div class="card-body">
            <div class="photo-wrapper">
              <div class="photo">
                ${options.avatar && !options.avatar.includes('placeholder')
                  ? `<img src="${options.avatar}" alt="${options.name}" />`
                  : `<span>${options.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>`
                }
              </div>
            </div>

            <div class="name">${options.name}</div>
            <div class="designation">${options.course || options.department}</div>

            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">ID Number</span>
                <span class="detail-val">${options.id}</span>
              </div>
              ${options.rollNumber ? `
                <div class="detail-item">
                  <span class="detail-label">Roll Number</span>
                  <span class="detail-val">${options.rollNumber}</span>
                </div>
              ` : ''}
              ${options.year ? `
                <div class="detail-item">
                  <span class="detail-label">Batch / Section</span>
                  <span class="detail-val">${options.year} • Sec ${options.section || 'A'}</span>
                </div>
              ` : ''}
              ${options.officeRoom ? `
                <div class="detail-item">
                  <span class="detail-label">Office Room</span>
                  <span class="detail-val">${options.officeRoom}</span>
                </div>
              ` : ''}
              ${options.bloodGroup ? `
                <div class="detail-item">
                  <span class="detail-label">Blood Group</span>
                  <span class="detail-val" style="color: #dc2626;">${options.bloodGroup}</span>
                </div>
              ` : ''}
              <div class="detail-item">
                <span class="detail-label">Valid Through</span>
                <span class="detail-val">${options.validUntil}</span>
              </div>
              ${options.emergencyContact ? `
                <div class="detail-item" style="grid-column: span 2;">
                  <span class="detail-label">Emergency Helpline</span>
                  <span class="detail-val">${options.emergencyContact}</span>
                </div>
              ` : ''}
            </div>

            <div class="card-footer">
              <div class="barcode-box">||| | |||| ||| || | |</div>
              <div class="qr-box">
                <div>QR PASS</div>
                <div style="font-size: 6px; opacity: 0.8;">AUTH-OK</div>
              </div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}
