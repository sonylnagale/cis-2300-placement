'use client';

import logo from '@/app/Baruch_College_Zicklin_lockup.svg';
import CUNY from '@/app/cuny.svg';
import '@/components/survey.css';
import '@/app/globals.css';

export default function PrivacyPolicy() {
  return (
    <>
      <div className="header">
        <a
          href="https://zicklin.baruch.cuny.edu/faculty-research/academic-departments/information-technology-statistics/"
          target="_blank"
          rel="noreferrer"
        >
          <img src={logo.src} alt="Baruch College Logo" className="logo" />
        </a>
        <div className="headline">
          <h1 className="headline">Paul H. Chook Department of<br /> Information Systems and Statistics</h1>
        </div>
      </div>

      <div className="intro">
        <div>&nbsp;</div>
        <div>
          <h2>Privacy Policy</h2>
          <p><em>Effective date: March 2026</em></p>

          <h3>What we collect</h3>
          <p>
            When you complete the CIS 2300 Self-Placement Survey, we collect your
            name, email address, and your responses to the survey questions. We also
            record a placement score derived from your responses.
          </p>

          <h3>How we use it</h3>
          <p>
            Your information is used solely to help the Department of Information
            Systems and Statistics recommend an appropriate section of CIS 2300 for
            you. Your name and email are used to communicate your placement
            recommendation and are not shared with third parties.
          </p>

          <h3>Data storage</h3>
          <p>
            Responses are stored in a secured database hosted on Amazon Web Services
            (AWS) in the United States. Access is restricted to authorized department
            staff only.
          </p>

          <h3>Data retention</h3>
          <p>
            Survey responses are retained for one academic year and then deleted.
          </p>

          <h3>Your rights</h3>
          <p>
            You may request deletion of your data at any time by emailing{' '}
            <a href="mailto:informationsystemsandstatistics@baruch.cuny.edu?subject=CIS 2300 Data Deletion Request">
              informationsystemsandstatistics@baruch.cuny.edu
            </a>
            .
          </p>

          <h3>Contact</h3>
          <p>
            Questions about this policy can be directed to the same address above.
          </p>

          <p style={{ marginTop: '2rem' }}>
            <a href="/" style={{ color: 'var(--baruch)', textDecoration: 'underline' }}>
              &larr; Back to the survey
            </a>
          </p>
        </div>
      </div>

      <div className="footer">
        <img src={CUNY.src} alt="CUNY Logo" />
        <p>
          <a href="mailto:informationsystemsandstatistics@baruch.cuny.edu?subject=CIS 2300 Self-Placement Question">
            informationsystemsandstatistics@baruch.cuny.edu
          </a>
          {' | '}
          <a href="/privacy" className="privacy">Privacy Policy</a>
        </p>
      </div>
    </>
  );
}
