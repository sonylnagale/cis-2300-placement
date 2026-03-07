/**
 * We applaud your curiosity! However, looking at the HTML or JavaScript source isn't all that helpful. 
 * This quiz is only intended to help you, so gaming the answers defeats the purpose. 
 */

import json from "./form.json" with { type: "json" }; // make this standard JS import later

const STORAGE_ITEM_DATA_KEY = "baruch-cis-self-placement";
const STORAGE_ITEM_UI_STATE_KEY = "baruch-cis-self-placement-ui";

const btn = document.getElementById("resetQuizBtn");

btn.addEventListener("click", function () {
    try {
        localStorage.removeItem(STORAGE_ITEM_DATA_KEY);
        localStorage.removeItem(STORAGE_ITEM_UI_STATE_KEY);
    } catch (e) {
        console.warn("Could not clear localStorage", e);
    }
    window.location = '/';
});

const prevData =
    window.localStorage.getItem(STORAGE_ITEM_DATA_KEY) || null;
const prevState =
    window.localStorage.getItem(STORAGE_ITEM_UI_STATE_KEY) || null;

const survey = new Survey.Model(json);

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

// if continuing
if ((prevData || prevState)) {
    document.querySelector("#bottomToolbar").classList.remove('hidden');
    restoreSurvey(survey);
    survey.render(document.querySelector("#surveyContainer"));
}

// if returning to a specific page
if (window.location.hash !== '') {
    survey.currentPage = survey.getPageByName(window.location.hash.slice(1));
}

survey.onValueChanged.add(saveData);
survey.onUIStateChanged.add(saveData);
survey.onCurrentPageChanged.add((survey, options) => {
    document.querySelector("#bottomToolbar").classList.remove('hidden');
    console.log(survey, options);
    window.location.hash = options.newCurrentPage.jsonObj.name;
});

/// rendering methods
const converter = markdownit({
    html: true,
});

survey.onTextMarkdown.add((_, options) => {
    options.html = converter.renderInline(options.text);
});

survey.onTextMarkdown.add(() => {
    hljs.highlightAll();
});

survey.render(document.querySelector("#surveyContainer"));


// debug
window.survey = survey;
