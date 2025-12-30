const fs = require('fs');
const path = require('path');

// GDPR metnini modern, sade HTML'e çevirir.
const newBodyHtml = `
<h2>Data Protection and Privacy Notice</h2>

<p>
  This section contains fundamental information regarding the protection of
  personal data transferred to AVR Global Oy. AVR Global Oy, in accordance
  with the General Data Protection Regulation (GDPR), provides the following
  explanations to inform our clients and third parties who use our website.
</p>

<h3>1. What is the legal basis for AVR Global Oy collecting personal data?</h3>

<p>
  Your personal data is processed in accordance with Article 6(1) of the GDPR.
</p>

<h3>2. What methods does AVR Global Oy use to collect personal data?</h3>

<p>
  Your personal data is processed through data provided by clients operating in
  call centers and electronic environments (appointment request form, contact
  form, etc.), in accordance with the clients' consent and legislative
  provisions.
</p>

<p>
  We would like to remind you that the website
  <a href="https://almanyavizerehberi.com" target="_blank" rel="noreferrer">
    https://almanyavizerehberi.com
  </a>
  owned by AVR Global Oy uses cookies. A cookie is a file consisting of letters
  and numbers that is stored on the browser or hard drive of the device in use,
  allowing the device to be identified. You can find detailed explanations
  about the cookies used on the website on our homepage.
</p>

<p>
  It is essential that personal data shared with AVR Global Oy is shared
  directly by the service recipient, with explicit consent.
</p>

<h3>3. For what purposes does AVR Global Oy use personal data?</h3>

<p>
  AVR Global Oy may record, store, update, disclose to third parties, transfer,
  classify, and process your personal data to the extent permitted by the
  legislation.
</p>

<p>Your personal data is used for the following purposes:</p>

<ul>
  <li>To confirm the identity of the person performing or commissioning the transaction,</li>
  <li>To record address and other necessary information for communication,</li>
  <li>
    To contact our clients regarding the terms or current status of their
    service contracts,
  </li>
  <li>To inform our clients about changes in their contracts,</li>
  <li>
    To organize all records and documents that will be the basis of processing
    in electronic (internet/mobile, etc.) or paper environments,
  </li>
  <li>To fulfill the obligations undertaken in accordance with the service contract,</li>
  <li>To provide insurance usage information to organizations that insure their employees,</li>
</ul>

<p>
  With the explicit consent of our clients, to offer special campaigns and
  other benefits, to send any commercial electronic and written communication,
  to perform customer segmentation based on obtained data, to conduct surveys
  and tele-sales applications, to perform data mining and other statistical
  analyses, to improve customer data quality, to design and manage loyalty
  actions for customer management, to create and manage cross-selling and
  customer recovery actions, and to offer benefits and sales proposals related
  to our products and services using customer information (demographic,
  personal, shopping, visit, offer, survey responses, social media
  information, browsing on sites, actions in mobile applications, location
  information, and all other information collected through all channels), to
  contact clients through any means including phone, SMS, MMS, email, letter,
  fax, cookies on web pages, location information in mobile applications,
  instant notifications, and automatic calling systems.
</p>

<p>
  To evaluate customer complaints and suggestions regarding our products and
  services,
</p>

<p>
  To fulfill our obligations arising from GDPR and to exercise our rights
  arising from legislation.
</p>

<h3>4. How does AVR Global Oy protect your personal data?</h3>

<p>
  Personal data shared with AVR Global Oy is under the supervision and control
  of AVR Global Oy. AVR Global Oy, in accordance with applicable legislation,
  undertakes the responsibility as a data controller to establish and implement
  the necessary organization and technical measures to protect the
  confidentiality and integrity of the information. We inform you that we
  continuously update our data processing policies in accordance with
  international and national technical standards related to data
  confidentiality.
</p>

<h3>5. Does AVR Global Oy share your personal data?</h3>

<p>
  The sharing of personal data belonging to our clients with third parties is
  carried out within the clients' consent and, as a rule, personal data is not
  transferred to third parties without the clients' approval.
</p>

<p>
  However, personal data is shared with courts and other public institutions to
  fulfill our legal obligations and within the scope of these limitations.
  Additionally, personal data is transferred to contracted third parties to
  provide the services we commit to and to perform quality control of the
  provided services.
</p>

<p>
  During the transfer of data to third parties, necessary technical and legal
  measures are taken to prevent rights violations. However, AVR Global Oy is
  not responsible for violations occurring in the risk area under the
  responsibility of the third party receiving the personal data due to the
  data protection policies of the third party.
</p>

<h3>6. Does AVR Global Oy share your personal data with third parties abroad?</h3>

<p>
  Your personal data may be shared with AVR Global Oy (referring to AVR Global
  Oy and/or its subsidiaries, affiliates, joint ventures, and all its branches
  and offices), with program partner institutions and organizations with which
  we cooperate to carry out our visa and passport services, with domestic and
  international reinsurance companies, with persons and institutions from whom
  we receive cloud storage services, with domestic and international
  organizations with which we have agreements to send commercial electronic
  messages to our clients, and within the scope of providing better service and
  ensuring customer satisfaction, with insurance companies and other third
  parties at home and abroad.
</p>

<h3>7. What are your rights under the General Data Protection Regulation (GDPR)?</h3>

<p>Under GDPR, you have the right to:</p>

<ul>
  <li><strong>a-</strong> Learn whether your personal data is being processed,</li>
  <li><strong>b-</strong> Request information if your personal data has been processed,</li>
  <li>
    <strong>c-</strong> Learn the purpose of processing your personal data and
    whether they are used in accordance with the purpose,
  </li>
  <li>
    <strong>d-</strong> Know the third parties to whom your personal data is
    transferred domestically or abroad,
  </li>
  <li><strong>e-</strong> Request the correction of incomplete or inaccurate data,</li>
  <li>
    <strong>f-</strong> Request the deletion or destruction of your personal
    data under the conditions set forth in Article 17 of GDPR,
  </li>
  <li>
    <strong>g-</strong> Request the notification of the transactions made
    pursuant to subparagraphs (e) and (f) to third parties to whom your
    personal data has been transferred,
  </li>
  <li>
    <strong>h-</strong> Object to the processing of your personal data
    exclusively by automated systems resulting in an adverse outcome for you,
  </li>
  <li>
    <strong>i-</strong> Request compensation if you suffer damage due to
    unlawful processing of your personal data.
  </li>
</ul>

<h3>8. How can I stay informed about changes in personal data legislation?</h3>

<p>
  The rights you have under GDPR are obligations for AVR Global Oy. We process
  your personal data with this awareness and to the extent required by
  legislation. In the event of legal changes, we will update the information on
  this page in line with the new regulations, and you can always easily follow
  these updates on this page.
</p>

<h3>9. How can I ensure my data is kept accurate and up-to-date?</h3>

<p>
  According to Article 5 of GDPR, AVR Global Oy has an obligation to keep your
  personal data accurate and up-to-date. In this context, in order for AVR
  Global Oy to fulfill its obligations arising from the applicable legislation,
  our clients must share their accurate and up-to-date data with AVR Global Oy.
  If your data is changed in any way, please contact us through the
  communication channels listed below to update your data.
</p>

<h3>10. Do you have any questions about your personal data for AVR Global Oy?</h3>

<p>
  For applications regarding your rights under GDPR, you can send an email with
  the subject "GDPR Application" to the contact section on our website
  (<a href="mailto:info@almanyavizerehberi.com">
    info@almanyavizerehberi.com
  </a>
  ).
</p>
`.trim();

function updateGdprBody() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'gdpr.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);

  json.bodyHtml = newBodyHtml;

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  console.log('Updated bodyHtml for gdpr.json');
}

updateGdprBody();

