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
