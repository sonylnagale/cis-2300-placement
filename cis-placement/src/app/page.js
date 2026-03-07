'use client'

import 'survey-core/survey-core.css';
import dynamic from 'next/dynamic';

const SurveyComponent = dynamic(() => import("@/components/Survey"), {
  ssr: false
});

export default function Home() {
  return (
    <>
      <div className="header">
        <h1>Baruch College Department of Information Systems and Statistics</h1>
        <h2>Programming Self-Assessment</h2>
      </div>
      <SurveyComponent />
    </>

  );
}
