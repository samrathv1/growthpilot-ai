import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      whatsapp,
      budget,
      timeline,
      requestType,
      extraRequirements,
      businessName,
      businessType,
      landingPageType,
      selectedLayout,
      generatedHeadline,
      generatedSubheadline,
      conversionScore,
      aiBestNextAction,
      generatedLandingPageData,
      createdAt
    } = body;

    // Validate required fields
    if (!name || !email || !whatsapp || !businessName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: Name, Email, WhatsApp, and Business Name are required.' },
        { status: 400 }
      );
    }

    // 1. n8n Automation Forward (Optional)
    const n8nUrl = process.env.N8N_REVIEW_WEBHOOK_URL;
    if (n8nUrl) {
      try {
        console.log('[/api/review-request] Forwarding payload to n8n webhook...');
        await fetch(n8nUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch (webhookErr) {
        console.error('[/api/review-request] n8n Webhook forward failed:', webhookErr);
        // Continue to Nodemailer SMTP even if n8n fails
      }
    }

    // 2. Nodemailer SMTP Setup
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '465');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || `GrowthPilot AI <${user}>`;
    const to = process.env.REVIEW_NOTIFY_EMAIL || user;

    if (!host || !user || !pass) {
      console.warn('[/api/review-request] SMTP credentials not fully configured in environment variables.');
      return NextResponse.json(
        { success: false, error: 'SMTP credentials are not configured on the server.' },
        { status: 500 }
      );
    }

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for port 465, false for 587 or other ports
      auth: { user, pass },
    });

    const formattedJSON = JSON.stringify(generatedLandingPageData || {}, null, 2);

    const emailSubject = `New GrowthPilot AI Review Request — ${businessName}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc; color: #1e293b;">
        <h2 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">🚀 New Landing Page Review Request</h2>
        
        <h3 style="color: #0f172a; margin-top: 20px;">1. Contact Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 120px;">Name:</td>
            <td style="padding: 6px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Email:</td>
            <td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">WhatsApp:</td>
            <td style="padding: 6px 0;">${whatsapp}</td>
          </tr>
        </table>

        <h3 style="color: #0f172a; margin-top: 25px;">2. Project Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 150px;">Business Name:</td>
            <td style="padding: 6px 0;">${businessName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Business Type:</td>
            <td style="padding: 6px 0;">${businessType || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Landing Page Type:</td>
            <td style="padding: 6px 0;">${landingPageType || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Selected Layout:</td>
            <td style="padding: 6px 0; text-transform: capitalize;">${selectedLayout || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Budget:</td>
            <td style="padding: 6px 0;">${budget}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Timeline:</td>
            <td style="padding: 6px 0;">${timeline}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Request Type:</td>
            <td style="padding: 6px 0; color: #4f46e5; font-weight: bold;">${requestType}</td>
          </tr>
        </table>

        <h3 style="color: #0f172a; margin-top: 25px;">3. AI Generated Summary</h3>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; border-left: 4px solid #4f46e5;">
          <p style="margin: 0 0 8px 0;"><strong>Hero Headline:</strong> ${generatedHeadline || 'N/A'}</p>
          <p style="margin: 0 0 8px 0;"><strong>Hero Subheadline:</strong> ${generatedSubheadline || 'N/A'}</p>
          <p style="margin: 0 0 8px 0;"><strong>Conversion Score:</strong> <span style="background-color: #22c55e; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold;">${conversionScore || 85}/100</span></p>
          <p style="margin: 0;"><strong>AI Suggested Action:</strong> ${aiBestNextAction || 'N/A'}</p>
        </div>

        <h3 style="color: #0f172a; margin-top: 25px;">4. Extra Requirements</h3>
        <div style="background-color: #fff; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-style: italic; min-height: 40px;">
          ${extraRequirements ? extraRequirements.replace(/\n/g, '<br/>') : 'No extra requirements specified.'}
        </div>

        <h3 style="color: #0f172a; margin-top: 25px;">5. Full Generated Landing Page JSON</h3>
        <pre style="background-color: #0f172a; color: #38bdf8; padding: 15px; border-radius: 8px; font-size: 11px; overflow-x: auto; font-family: Consolas, monospace; max-height: 300px; overflow-y: auto;">${formattedJSON}</pre>

        <p style="font-size: 10px; color: #64748b; margin-top: 25px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
          Received on ${createdAt || new Date().toLocaleString()} via GrowthPilot AI Toolkit
        </p>
      </div>
    `;

    const emailText = `
🚀 NEW LANDING PAGE REVIEW REQUEST

1. CONTACT DETAILS
Name: ${name}
Email: ${email}
WhatsApp: ${whatsapp}

2. PROJECT DETAILS
Business Name: ${businessName}
Business Type: ${businessType || 'N/A'}
Landing Page Type: ${landingPageType || 'N/A'}
Selected Layout: ${selectedLayout || 'N/A'}
Budget: ${budget}
Timeline: ${timeline}
Request Type: ${requestType}

3. AI GENERATED SUMMARY
Hero Headline: ${generatedHeadline || 'N/A'}
Hero Subheadline: ${generatedSubheadline || 'N/A'}
Conversion Score: ${conversionScore || 85}/100
AI Best Next Action: ${aiBestNextAction || 'N/A'}

4. EXTRA REQUIREMENTS
${extraRequirements || 'None'}

5. FULL JSON DATA
${formattedJSON}
    `;

    // Send Mail
    await transporter.sendMail({
      from,
      to,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[/api/review-request] Error sending email request:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server failed to send email.' },
      { status: 500 }
    );
  }
}
