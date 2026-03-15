'use client'

import "@/app/globals.css";

import { useState, useEffect, useRef } from 'react';

import { Model, QuestionHtmlModel, registerFunction } from 'survey-core';
import { Survey } from 'survey-react-ui';

import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import python from 'highlight.js/lib/languages/python';
import MarkdownIt from 'markdown-it';
import model from './model.json';

import '@/components/survey.css';


hljs.registerLanguage('python', python);

const GOOD_BACKGROUND = {
  'Previous AP IB Course': false,
  'Previous Course': true,
  'Previous Experience': true,
};
const HIGH_CONCEPTS = {
  vars: 'vars:4', datatypes: 'datatypes:4', conditionals: 'conditionals:4', loops: 'loops:4',
  lists: 'lists:4', 'functions and methods': 'functions and methods:4', 'file i/o': 'file i/o:4', dictionaries: 'dictionaries:4',
};
const LOW_CONCEPTS = {
  // vars/datatypes/conditionals comfortable (score 1 each = 3), rest unknown (0) → concepts_state = 3 (notempty, < 4)
  vars: 'vars:4', datatypes: 'datatypes:4', conditionals: 'conditionals:4',
  loops: 'loops:1', lists: 'lists:1', 'functions and methods': 'functions and methods:1', 'file i/o': 'file i/o:1', dictionaries: 'dictionaries:1',
};
const CORRECT_ANSWERS = {
  // Values must match model.json choice value strings so determineExamplesState can score them.
  // conditionals:1=1, for-loop:1=2, while-loop:0=2, dictionaries:1=1, return:1=1, advanced:1=1 → total 8
  'python_conditionals_answer': 'conditionals:1',
  'python_for loop_answer': 'for-loop:1',
  'python_while loop_answer': 'while-loop:0',
  'python_dictionaries_answer': 'dictionaries:1',
  'python_return values_answer': 'return:1',
  'python_advanced_answer': 'advanced:1',
};

// Holds the target page name during a debug jump so determine functions
// can return values that satisfy that specific page's visibleIf condition.
let _debugJump = null;


export default function SurveyComponent() {

  const [preliminaryState, setPreliminaryState] = useState(null);
  const [conceptsState, setConceptsState] = useState(null);
  const [examplesState, setExamplesState] = useState(null);
  const [examplesFeelingsState, setExamplesFeelingsState] = useState(null);

  const [debugOpen, setDebugOpen] = useState(true);
  const [survey] = useState(() => new Model(model));

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

            value.rootRef.current.querySelectorAll("pre code").forEach((block) => {
              delete block.dataset.highlighted;
            });

            const node = value.rootRef.current.querySelector("pre code");
            if (node) {
              setTimeout(() => {
                hljs.highlightElement(value.rootRef.current.querySelector("pre code"));
              }, 10);
            }

          } catch (error) {
            // silent
          }
        }
      });
    });

    survey.onValueChanged.add(saveData);
    survey.onUIStateChanged.add(saveData);

    window.survey = survey;

  }, [survey]);

  function calculateConceptsScore(data) {
    console.log(data);
    let totalScore = 0;
    data.forEach((item) => {
      if (item > 2)
        totalScore += +item;
    });

    if (totalScore >= 10)
      return true;

    return false;
  }

  function calculatePreliminaryState(data) {
    const [previousAPIBCourse, apScore, ibScore, previousCourse, previousExperience] = data;

    let state = 0;

    // a point if they took an AP/IB course
    if (previousAPIBCourse === true) {
      state += 1;
      // two points if they score well
      if ((+apScore || 0) + (+ibScore || 0) > 3) {
        state += 2; // <= 2
      }
    }

    // a point if they took a previous course
    if (previousCourse === true) {
      state += 2;
    }

    // a point if they have previous experience
    if (previousExperience === true) {
      state += 2;
    }

    setPreliminaryState(state);
    return state;
  }

  // Returns average comfort score (0–4) across the 8 topic self-ratings.
  // concepts_state >= 3 gates the Code Assessment page.
  function determineConceptsState(data) {
    if (_debugJump) {
      // Refresher: notempty and < 4. Everything else needing code pages: >= 4.
      return _debugJump === 'Refresher' ? 3 : 8;
    }
    // {vars}, {datatypes}, {conditionals}, {loops}, {lists}, {functions and methods}, {file i/o}, {dictionaries}

    const map = {
      vars: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 1
      },
      datatypes: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 1
      },
      conditionals: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 1
      },
      loops: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0.5,
        "4": 1
      },
      lists: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0.5,
        "4": 1
      },
      "functions and methods": {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0.5,
        "4": 1
      },
      "file i/o": {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0.5,
        "4": 1
      },
      dictionaries: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0.5,
        "4": 1
      }
    };
    let score = 0;
    data.forEach((v) => {
      if (v != null && v !== undefined && typeof v === 'string') {
        const [q, a] = v.split(":");
        score += map[q][a] || 0;
      }
    });

    setConceptsState(score);
    return score;
  }

  // Returns sum of correct answers (each worth 2, max 12).
  // Ignores non-numeric (alpha) wrong-answer values.
  function determineExamplesState(data) {
    if (_debugJump) {
      // Advanced: >= 8. All other pages don't need examples_state set.
      return _debugJump === 'Advanced' ? 12 : 0;
    }

    // {python-conditionals-answer}, {python-for loop-answer}, {python-while loop-answer}, {python-dictionaries-answer}, {python-return values-answer}, {python-advanced-answer}
    const map = {
      "conditionals": {
        "0": 0,
        "1": 1,
        "2": 0
      },
      'for-loop': {
        "0": 0,
        "1": 2,
        "2": 0
      },
      'while-loop': {
        "0": 2,
        "1": 0,
        "2": 0
      },
      'dictionaries': {
        "0": 0,
        "1": 1,
        "2": 0
      },
      'return': {
        "0": 0,
        "1": 1,
        "2": 0
      },
      'advanced': {
        "0": 0,
        "1": 1,
        "2": 0
      }
    }

    let score = 0;

    data.forEach((v) => {
      console.log(data, v)
      if (v != null && v !== undefined && typeof v === 'string') {
        const [q, a] = v.split(":");
        score += map[q][a] || 0;
      }
    });

    setExamplesState(score);
    return score;
  }

  // Returns sum of reaction scores across the 6 code problems (0/1/2 each, max 12).
  // Higher = student felt more confident solving the examples.
  function determineExamplesFeelingsState(data) {
    console.log(data)
    const score = data.reduce((sum, v) => sum + (v && Number(v.split(":")[1]) || 0), 0);
    setExamplesFeelingsState(score);
    return score;
  }

  registerFunction({
    name: "calculateConceptsScore",
    func: calculateConceptsScore
  });

  registerFunction({
    name: "calculatePreliminaryState",
    func: calculatePreliminaryState
  });

  registerFunction({
    name: "determineConceptsState",
    func: determineConceptsState
  });

  registerFunction({
    name: "determineExamplesState",
    func: determineExamplesState
  });

  registerFunction({
    name: "determineExamplesFeelingsState",
    func: determineExamplesFeelingsState
  });

  // Data presets that satisfy each page's visibleIf condition.
  // Keys match question `name` fields in model.json.
  const PAGE_PRESETS = {
    'Introduction': {},
    'Background': {},
    'Advanced Placement Courses': {},
    'Previous Course': {},
    'Previous Experience': {},
    // preliminary_state > 1 → course + experience = true
    'topics': {
      'Previous AP IB Course': false,
      'Previous Course': true,
      'Previous Experience': true,
    },
    // concepts_state >= 3 → all topics 'entirely comfortable' (4)
    'code-conditionals': { ...GOOD_BACKGROUND, ...HIGH_CONCEPTS },
    'code-for-loop': { ...GOOD_BACKGROUND, ...HIGH_CONCEPTS, python_conditionals_reaction: 'reaction:4' },
    'code-while-loop': { ...GOOD_BACKGROUND, ...HIGH_CONCEPTS },
    'code-dictionaries': { ...GOOD_BACKGROUND, ...HIGH_CONCEPTS },
    'code-return-values': { ...GOOD_BACKGROUND, ...HIGH_CONCEPTS },
    'code-advanced': { ...GOOD_BACKGROUND, ...HIGH_CONCEPTS },
    // preliminary_state == 0: no AP/IB, no course, no experience
    'No Experience': {
      'Previous AP IB Course': false,
      'Previous Course': false,
      'Previous Experience': false,
    },
    // preliminary_state == 1: AP/IB taken but score 0 (≤3), no course, no experience
    'Limited Experience': {
      'Previous AP IB Course': true,
      'AP CS A Score': 0,
      'IB Score': 0,
      'Previous Course': false,
      'Previous Experience': false,
    },
    // preliminary_state >= 2, concepts_state notempty and < 4
    'Refresher': {
      preliminary_state: '2',
      concepts_state: 3,
    },
    // examples_state >= 8
    'Advanced': {
      preliminary_state: '4',
      concepts_state: 8,
      examples_state: 8,
    },
    'Thank You': {},
  };

  function jumpToPage(pageName) {
    const preset = PAGE_PRESETS[pageName] || {};
    _debugJump = pageName;
    survey.data = { ...survey.data, ...preset };
    const page = survey.getPageByName(pageName);
    if (!page) {
      _debugJump = null;
      return;
    }
    // Temporarily clear visibleIf so we can force navigation
    const savedVisibleIf = page.visibleIf;
    if (!page.isVisible) {
      page.visibleIf = '';
    }
    survey.currentPage = page;

    survey.currentPage.elementsValue.forEach(async (el) => {
      // make sure the code questions get a fresh highlight when visible
      if (el instanceof QuestionHtmlModel) {
        try {
          const value = await waitForProperty(el, 'react');
          const node = value.rootRef.current.querySelector("pre code");
          if (node) {
            setTimeout(() => {
              hljs.highlightElement(value.rootRef.current.querySelector("pre code"));
            }, 10);
          }
        } catch (error) {
          // silent
        }
      }
    });
    // Restore after navigation so the condition still tracks normally
    if (savedVisibleIf) {
      page.visibleIf = savedVisibleIf;
    }
    // Defer reset so SurveyJS finishes all synchronous expression
    // evaluations (visibleIf / determineConceptsState etc.) before clearing.
    setTimeout(() => { _debugJump = null; }, 0);
  }


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

  const isDev = true; //process.env.NODE_ENV === 'development';

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    right: debugOpen ? 0 : '-220px',
    width: '220px',
    height: '100vh',
    background: '#1e1e2e',
    color: '#cdd6f4',
    fontFamily: 'monospace',
    fontSize: '12px',
    zIndex: 9999,
    transition: 'right 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-2px 0 8px rgba(0,0,0,0.5)',
  };

  const toggleBtnStyle = {
    position: 'fixed',
    top: '50%',
    right: debugOpen ? '220px' : '0',
    transform: 'translateY(-50%)',
    background: '#89b4fa',
    color: '#1e1e2e',
    border: 'none',
    borderRadius: '4px 0 0 4px',
    padding: '8px 4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '11px',
    zIndex: 10000,
    writingMode: 'vertical-rl',
    transition: 'right 0.2s ease',
  };

  const pageNames = survey.pages.map(p => p.name);

  return (
    <>
      <Survey model={survey} className="survey" />
      {isDev && (
        <>
          <button style={toggleBtnStyle} onClick={() => setDebugOpen(o => !o)}>
            DEBUG
          </button>
          <div style={sidebarStyle}>
            <div style={{ padding: '12px 10px 6px', fontWeight: 'bold', borderBottom: '1px solid #313244', color: '#89b4fa' }}>
              🐛 Debug Pages
            </div>
            <div style={{ overflowY: 'auto', flex: 1, padding: '6px 0' }}>
              {pageNames.map(name => (
                <button
                  key={name}
                  onClick={() => jumpToPage(name)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: survey.currentPage?.name === name ? '#313244' : 'transparent',
                    color: '#cdd6f4',
                    border: 'none',
                    borderLeft: survey.currentPage?.name === name ? '3px solid #89b4fa' : '3px solid transparent',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
            <div style={{ padding: '6px 10px', borderTop: '1px solid #313244', fontSize: '10px' }}>
              <div style={{ color: '#6c7086', marginBottom: '4px' }}>Sets prerequisite data then navigates.</div>
              {[
                ['preliminary', preliminaryState],
                ['concepts', conceptsState],
                ['examples', examplesState],
                ['feelings', examplesFeelingsState],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6c7086' }}>{label}</span>
                  <span style={{ color: val == null ? '#45475a' : '#a6e3a1', fontWeight: 'bold' }}>
                    {val == null ? '—' : String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
