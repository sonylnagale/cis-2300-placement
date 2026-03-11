'use client'

import 'survey-core/survey-core.css';
import dynamic from 'next/dynamic';

import logo from '@/app/BC-zicklin-stacked-PMS288.png';

const SurveyComponent = dynamic(() => import("@/components/Survey"), {
  ssr: false
});

export default function Home() {
  return (
    <>
      <div className="header">
        <img src={logo.src} alt="Baruch College Logo" className="logo" style={{width: "200px"}}/>
        <h1>Baruch College Department of Information Systems and Statistics</h1>
        <h2>Programming Self-Assessment</h2>
      </div>
      <SurveyComponent />
    </>

  );
}
