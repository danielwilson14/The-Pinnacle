import React from "react";
import "../styles/ProfessionalHelpPage.css";

const ProfessionalHelpPage = () => {
  return (
    <div className="help-container">
      <h1>You're Not Alone – Help is Available</h1>
      <p>
        Seeking professional help is a **strong** and **important** step towards better mental well-being. 
        Below are some resources to guide you in finding the right support.
      </p>

      {/* 🚀 Emergency Section */}
      <div className="help-section emergency">
        <h2>🚨 Immediate Help</h2>
        <p>If you or someone you know is in danger or needs urgent support, please reach out to emergency services:</p>
        <ul>
          <li><strong>📞 999 (UK)</strong> – Emergency Services</li>
          <li><strong>📞 988 (USA)</strong> – Suicide & Crisis Lifeline</li>
          <li><strong>📞 112 (EU)</strong> – European Emergency Number</li>
        </ul>
      </div>

      {/* 🧒 Childline Support */}
      <div className="help-section">
        <h2>🧒 Support for Children & Young People</h2>
        <p>Children and young people facing abuse, bullying, or struggling with emotions can reach out to:</p>
        <ul>
          <li><strong>📞 Childline (UK): 0800 1111</strong> – Confidential 24/7 support for young people</li>
          <li><strong>📞 NSPCC (UK): 0808 800 5000</strong> – For children at risk of harm</li>
          <li><strong>📞 Kids Helpline (Australia): 1800 55 1800</strong> – Free support for kids & teens</li>
        </ul>
      </div>

      {/* ☎️ Domestic Violence & Sexual Assault Support */}
      <div className="help-section">
        <h2>🛡️ Domestic Violence & Sexual Assault Support</h2>
        <p>Support is available for those facing domestic abuse or sexual violence.</p>
        <ul>
          <li><strong>📞 National Domestic Abuse Helpline (UK): 0808 2000 247</strong> – 24/7 support for women</li>
          <li><strong>📞 Refuge (UK): 0808 2000 247</strong> – Support for women in abusive situations</li>
          <li><strong>📞 Rape Crisis (UK): 0808 802 9999</strong> – Support for survivors of sexual violence</li>
          <li><strong>📞 National Sexual Assault Hotline (USA): 800-656-4673</strong> – RAINN confidential support</li>
          <li><strong>📞 Women’s Aid (Ireland): 1800 341 900</strong> – Help for women experiencing abuse</li>
        </ul>
      </div>

      {/* 🧑‍⚕️ Professional Therapy */}
      <div className="help-section">
        <h2>🧑‍⚕️ Speaking to a Therapist</h2>
        <p>
          A therapist can help you **navigate emotions, stress, and mental health challenges**. Consider reaching out to:
        </p>
        <ul>
          <li><strong><a href="https://www.bacp.co.uk" target="_blank" rel="noopener noreferrer">BACP (UK)</a></strong> – British Association for Counselling and Psychotherapy</li>
          <li><strong><a href="https://www.nhs.uk/mental-health" target="_blank" rel="noopener noreferrer">NHS Mental Health Services</a></strong> – Free mental health support in the UK</li>
          <li><strong><a href="https://www.psychologytoday.com" target="_blank" rel="noopener noreferrer">Psychology Today</a></strong> – Find a therapist globally</li>
        </ul>
      </div>

      {/* ☎️ General Mental Health Helplines */}
      <div className="help-section">
        <h2>☎️ Mental Health Helplines</h2>
        <p>Need someone to talk to? These helplines offer **anonymous & confidential** support:</p>
        <ul>
          <li><strong>📞 Samaritans (UK): 116 123</strong> – 24/7 listening service</li>
          <li><strong>📞 Mind (UK): 0300 123 3393</strong> – Mental health support</li>
          <li><strong>📞 Crisis Text Line: Text HOME to 741741</strong> – Free 24/7 support via text</li>
        </ul>
      </div>

      {/* 🏠 Community Support */}
      <div className="help-section">
        <h2>🏠 Community & Peer Support</h2>
        <p>
          Connecting with others who understand can be **incredibly helpful**. Try:
        </p>
        <ul>
          <li><strong><a href="https://www.mentalhealthforum.net" target="_blank" rel="noopener noreferrer">Mental Health Forum</a></strong> – Peer-to-peer discussions</li>
          <li><strong><a href="https://www.reddit.com/r/depression" target="_blank" rel="noopener noreferrer">Reddit r/depression</a></strong> – Supportive online community</li>
        </ul>
      </div>

      <div className="help-footer">
        <p>💙 Remember: Seeking help is **a sign of strength**. You're not alone. 💙</p>
      </div>
    </div>
  );
};

export default ProfessionalHelpPage;
