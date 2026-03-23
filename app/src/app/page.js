'use client';

import { useState } from 'react';

import 'survey-core/survey-core.css';
import dynamic from 'next/dynamic';

import logo from '@/app/Baruch_College_Zicklin_lockup.svg';
import CUNY from '@/app/cuny.svg';

import '@/components/survey.css';
import '@/app/globals.css';
import Form from '@/components/Form';

const SurveyComponent = dynamic(() => import("@/components/Survey"), {
  ssr: false
});

export default function Home() {
  const [surveyData, setSurveyData] = useState(null);

  return (
    <>
      <div className="header">
        <a href="https://zicklin.baruch.cuny.edu/faculty-research/academic-departments/information-technology-statistics/" target="_blank"><img src={logo.src} alt="Baruch College Logo" className="logo" /></a>
        <div className="headline">
          <h1 className="headline">Paul H. Chook Department of<br /> Information Systems and Statistics</h1>
        </div>
      </div>
      {!surveyData && <Form setSurveyData={setSurveyData} />}
      {surveyData && <SurveyComponent submissionId={surveyData.id} />}

      <div className="footer">
        <img src={CUNY.src} alt="CUNY Logo" />
        <p><a href="mailto:informationsystemsandstatistics@baruch.cuny.edu?subject=CIS 2300 Self-Placement Question">informationsystemsandstatistics@baruch.cuny.edu</a> | <a href="/privacy" className="privacy">Privacy Policy</a></p>
      </div>
    </>

  );
}
