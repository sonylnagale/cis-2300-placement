'use client'

import 'survey-core/survey-core.css';
import dynamic from 'next/dynamic';

import logo from '@/app/Baruch_College_Zicklin_lockup.svg';
import CUNY from '@/app/cuny.svg';

const SurveyComponent = dynamic(() => import("@/components/Survey"), {
  ssr: false
});

export default function Home() {
  return (
    <>
      <div className="header">
        <img src={logo.src} alt="Baruch College Logo" className="logo" width={"300px"} />
        <div className="headline">
          <h1 className="headline">Paul H. Chook Department of<br/> Information Systems and Statistics</h1>
        </div>
      </div>
      
      <SurveyComponent />

      <div className="footer">
        <img src={CUNY.src} alt="CUNY Logo" width={"200px"} />
      </div>
    </>

  );
}
