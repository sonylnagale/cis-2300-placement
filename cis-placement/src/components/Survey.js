'use client'

import "@/app/globals.css";

import { useState, useEffect } from 'react';
import { Model, Serializer, settings, QuestionHtmlModel, registerFunction } from 'survey-core';
import { Survey } from 'survey-react-ui';

import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import python from 'highlight.js/lib/languages/python';
import MarkdownIt from 'markdown-it';

import model from './model.json';

import "@/components/survey.css";


hljs.registerLanguage('python', python);

export default function SurveyComponent() {
  const [survey] = useState(new Model(model));

  function calculateExamScore(data) {
    let totalScore = 0;
    data.forEach((item) => {
      if (item !== undefined) {
        totalScore += item;
      }
    });

    return totalScore;
  }

  function calculateConcepts(data) {
    let totalScore = 0;
    data.forEach((item) => {
      if (item == undefined) {
        return -1;
      }

      totalScore += item;
    });

    console.log(totalScore)

    return totalScore;
  }

  registerFunction({
    name: "calculateExamScore",
    func: calculateExamScore
  });

  registerFunction({
    name: "calculateConcepts",
    func: calculateConcepts
  });

  settings.triggers.executeSkipOnValueChanged = false;

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


    // if (window.location.hash !== '') {
    //   const pageIndex = survey.pages.findIndex(p => p.name === window.location.hash.replace('#', ''));
    //   survey.currentPageNo = pageIndex;

    //   if (prevData) {
    //     const data = JSON.parse(prevData);
    //     survey.data = data;
    //   }
    //   if (prevState) {
    //     const state = JSON.parse(prevState);
    //     survey.uiState = state;
    //   }
    // }

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



  return <Survey model={survey} className="survey" />;
}