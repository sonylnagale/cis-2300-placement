'use client'

import "@/app/globals.css";

import { useState, useEffect, useRef } from 'react';

import { Model, QuestionHtmlModel, registerFunction, Serializer } from 'survey-core';
import { Survey } from 'survey-react-ui';

import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import python from 'highlight.js/lib/languages/python';
import MarkdownIt from 'markdown-it';
import model from './model.json';

import 'bootstrap/dist/css/bootstrap.min.css';


hljs.registerLanguage('python', python);

export default function SurveyComponent() {

  function calculateConceptsScore(data) {
    if (data[0] !== "Concepts")
      return;

    data.shift(); // remove the "Concepts" label

    let totalScore = 0;
    data.forEach((item) => {
      if (item > 2)
        totalScore += +item;
    });

    if (totalScore >= 10)
      return true;

    return false;
  }

  function calculateExamplesScore(data) {
    if (data[0] !== "Examples")
      return;

    data.shift(); // remove the "Examples" label

    let totalScore = 0;
    let totalComfort = 0;
    data.forEach((item, i) => {
      if (i % 2 === 0) {
        totalScore += +item;
      } else {
        totalComfort += +item;
      }
    });

    totalScore += totalComfort;
    if (totalScore >= 10)
      return true;

    return false;
  }

  function determineState(data) {
    const [course, apcourse, previousExperience, apScore, ibScore, conceptsScore, examplesScore] = data;

    let state = 0;
    let AP_or_IB = false;
    let courseTaken = false;

    if (course === true) {
      state = 1;
      courseTaken = true;
    }

    if (apcourse !== false) {
      if ((+apScore || 0) + (+ibScore || 0) > 3) {
        state += 2; // <= 2
      } else {
        state += 1;
      }
      AP_or_IB = true;
    }

    if (previousExperience === true) {
      if (AP_or_IB) {
        state += 2; // >= 3
      } else {
        state = 3; // 3
      }
    }

    if (conceptsScore === true) {
      state += 2; // >= 2
    } else {
      state += 1;
    }

    if (examplesScore === true) {
      state += 1; // >= 3
    }


    console.log("Determined state: ", state);

    return `${state}`;

    // if (conceptsScore === true && examplesScore === true) {
    //   return '2';
    // }
    // return false;
  }

  registerFunction({
    name: "calculateConceptsScore",
    func: calculateConceptsScore
  });

  registerFunction({
    name: "calculateExamplesScore",
    func: calculateExamplesScore
  });

  registerFunction({
    name: "determineState",
    func: determineState
  });

  const [survey] = useState(new Model(model));

  useEffect(() => {
    const converter = MarkdownIt({
      html: true,
    });

    survey.onTextMarkdown.add((_, options) => {
      options.html = converter.renderInline(options.text);

    });

    survey.onUpdateQuestionCssClasses.add((_, options) => {
      if (options.question.getType() === "html" && (options.question.getPlainData().name !== "Introduction" && options.question.getPlainData().name !== "Background" && options.question.getPlainData().title !== "2300")) {
        options.cssClasses.root = "question-root";
      }
    });

    survey.onCurrentPageChanged.add((_, options) => {
      // window.location.hash = options.newCurrentPage.jsonObj.name;
      survey.currentPage.elementsValue.forEach(async (el) => {
        // make sure the code questions get a fresh highlight when visible
        if (el instanceof QuestionHtmlModel) {
          try {
            const value = await waitForProperty(el, 'react');
            hljs.highlightElement(value.rootRef.current.querySelector("pre code"));
          } catch (error) {
            // silent
          }
        }
      });
    });

    survey.onValueChanged.add(saveData);
    survey.onUIStateChanged.add(saveData);

  }, []);

  function waitForProperty(obj, propName, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const check = () => {
        if (propName in obj) {
          resolve(obj[propName]);
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error(`Timeout waiting for property "${propName}"`));
        } else {
          setTimeout(check, 10);
        }
      };

      check();
    });
  }

  function saveData(survey) {
    window.localStorage.setItem(
      STORAGE_ITEM_DATA_KEY,
      JSON.stringify(survey.data),
    );
    window.localStorage.setItem(
      STORAGE_ITEM_UI_STATE_KEY,
      JSON.stringify(survey.uiState),
    );
  }

  const STORAGE_ITEM_DATA_KEY = "baruch-cis-self-placement";
  const STORAGE_ITEM_UI_STATE_KEY = "baruch-cis-self-placement-ui";


  const prevData =
    window.localStorage.getItem(STORAGE_ITEM_DATA_KEY) || null;
  const prevState =
    window.localStorage.getItem(STORAGE_ITEM_UI_STATE_KEY) || null;

  function saveData(survey) {
    window.localStorage.setItem(
      STORAGE_ITEM_DATA_KEY,
      JSON.stringify(survey.data),
    );
    window.localStorage.setItem(
      STORAGE_ITEM_UI_STATE_KEY,
      JSON.stringify(survey.uiState),
    );
  }

  function restoreSurvey(survey) {
    if (prevData) {
      const data = JSON.parse(prevData);
      survey.data = data;
    }
    if (prevState) {
      const state = JSON.parse(prevState);
      survey.uiState = state;
    }
  }

  return <Survey model={survey} className="survey"></Survey>;
}
