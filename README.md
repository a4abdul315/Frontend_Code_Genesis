# Social Support Application (Front-End)

A government social support portal front-end that lets citizens apply for financial assistance via a 3-step form wizard, with optional AI-assisted writing for situation descriptions (OpenAI GPT).

## Features

- **3-step application wizard**: Personal Information → Family & Financial Info → Situation Descriptions
- **Progress bar** showing current step
- **Responsive layout** (mobile, tablet, desktop)
- **English + Arabic** with RTL support (language switcher in header)
- **Accessibility**: ARIA roles, labels, keyboard navigation, focus management
- **LocalStorage**: Form progress is saved automatically so users can continue later
- **Mock submit**: Final step submits to a simulated API; success screen with option to start a new application
- **AI “Help Me Write”**: In Step 3, each text area has a button that calls the OpenAI GPT API to suggest text; user can Accept, Edit & Use, or Discard in a modal. Errors (timeout, API failure, missing API key) are handled with clear messages

## Tech Stack

- **React 18** + **Create React App**
- **Tailwind CSS** for styling
- **React Hook Form** for form state and validation
- **React Context** for wizard/form state and persistence
- **i18next** + **react-i18next** for English/Arabic
- **Fetch** for OpenAI API and mock submit

## How to Run the Project

### Prerequisites

- Node.js 14+ (16+ recommended)
- npm or yarn

### Install and run

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

The built files will be in the `build/` folder.

## How to Set Up the OpenAI API Key

The “Help Me Write” feature in Step 3 uses the OpenAI Chat Completions API (e.g. `gpt-3.5-turbo`). You must provide an API key so the app can call the API.

1. **Get an API key**  
   - Sign in at [OpenAI](https://platform.openai.com/)  
   - Go to [API Keys](https://platform.openai.com/api-keys)  
   - Create a new secret key and copy it  

2. **Configure the app**  
   - In the project root, copy the example env file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and set your key:
     ```
     REACT_APP_OPENAI_API_KEY=sk-your-actual-key-here
     ```
   - Restart the dev server (`npm start`) so Create React App picks up the new env.  


If the key is missing or invalid, clicking “Help Me Write” will show an error message (e.g. “OpenAI API key is not configured” or the API error).

## Project Structure (overview)

- `src/`
  - `App.jsx` – Wizard steps, success screen, layout
  - `index.js` – Entry, i18n and app mount
  - `i18n/` – i18next config and `en` / `ar` locale files
  - `context/FormWizardContext.jsx` – Form data and LocalStorage persistence
  - `components/` – ProgressBar, Step1Form, Step2Form, Step3Form, AISuggestionModal, LanguageSwitcher
  - `services/openai.js` – OpenAI API call and timeout handling
  - `services/mockSubmit.js` – Mock application submit
- `.env.example` – Example env with `REACT_APP_OPENAI_API_KEY`
- `README.md` – This file

## License

MIT (or as required by your organization).
