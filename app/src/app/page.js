'use client';

import 'survey-core/survey-core.css';
import dynamic from 'next/dynamic';

import logo from '@/app/Baruch_College_Zicklin_lockup.svg';
import CUNY from '@/app/cuny.svg';

import '@/components/survey.css';
import '@/app/globals.css';

const SurveyComponent = dynamic(() => import("@/components/Survey"), {
  ssr: false
});

export default function Home() {
  return (
    <>
      <div className="header">
        <a href="https://zicklin.baruch.cuny.edu/faculty-research/academic-departments/information-technology-statistics/" target="_blank"><img src={logo.src} alt="Baruch College Logo" className="logo" /></a>
        <div className="headline">
          <h1 className="headline">Paul H. Chook Department of<br /> Information Systems and Statistics</h1>
        </div>
      </div>

      <SurveyComponent />

      <div className="footer">
        <img src={CUNY.src} alt="CUNY Logo" />
        <p><a href="mailto:informationsystemsandstatistics@baruch.cuny.edu?subject=CIS 2300 Self-Placement Question">informationsystemsandstatistics@baruch.cuny.edu</a></p>
      </div>
    </>

  );
}
