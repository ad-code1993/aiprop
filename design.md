# 📘 Frontend Requirements: AI-Powered Proposal Generator

---

## 🏠 1. HomePage – `/`

### 🔍 Purpose:

Acts as the landing page introducing the app and directing users into the proposal generation process.

### ✅ Features:

* **Headline**:
  `“AI-Powered Proposal Generator”`
  A bold, central heading to immediately convey the purpose of the tool.

* **Subheading / Intro**:
  `“Answer a few smart questions — we’ll generate a complete proposal.”`
  Helps the user understand the simplicity and value of the app.

* **Call-to-Action (CTA)**:

  * A single primary button:
    `➕ Start Interactive Proposal → /proposal/new`
  * This directs users into the interactive Q&A flow to begin the proposal process.

---

## 💬 2. InteractiveProposalPage – `/proposal/new`

### 🔍 Purpose:

This is the core experience where users interact with the AI agent in a chat-like format to build their proposal step-by-step.

### ✅ API Integration:

* `POST /start_proposal`: Automatically called when the page loads to initialize a new session.
* `POST /continue_proposal/{session_id}`: Called every time the user responds to a question.

### 🧩 Components:

* **Chat Interface**:

  * Display the AI-generated question with a brief reasoning.
  * User types an answer in an input box.
  * A "Submit" button sends the response to the backend.

* **Progress Indicator**:

  * Visual feedback like `Step 3 of 6` or a progress bar.

* **Contextual Info (optional)**:

  * Tooltip or sidebar message showing why each question is important (e.g., “This helps define your project scope”).

* **Auto-scroll & smooth UX**:

  * Automatically scroll to the latest question and answer.
  * Disable input temporarily while waiting for the AI response.

* **Completion State**:

  * After all questions are answered, show a summary preview of the draft proposal.
  * Offer navigation to preview/edit the proposal.

---

## 🧾 3. ProposalPreviewPage – `/proposal/view/:session_id`

### 🔍 Purpose:

Displays the full proposal text in a readable format after the interactive session is completed.

### ✅ API Integration:

* `GET /proposal/{session_id}`: Fetches the full proposal text.
* `GET /proposal/{session_id}/pdf`: Fetches a downloadable PDF version.

### 🧩 Components:

* **Formatted Proposal Viewer**:

  * Nicely styled sections (e.g., project title, goals, timeline, etc.)
  * Optionally collapsible sections for easy navigation.

* **Action Buttons**:

  * 🔄 `Regenerate Proposal`: Redirects to the editing page.
  * ✏️ `Edit Specific Section`: Takes user to section editor.
  * 🧠 `Rewrite with Prompt`: Opens prompt rewrite tool.

* **Download Options**:

  * Button to download the proposal as a PDF.

---

## 🛠️ 4. EditProposalPage – `/proposal/edit/:session_id`

### 🔍 Purpose:

Allows the user to edit individual sections of the proposal using custom instructions.

### ✅ API Integration:

* `POST /proposal/{session_id}/update_section`: For regenerating a specific section.
* `POST /proposal/{session_id}/regenerate`: For regenerating the entire proposal with slight modifications.

### 🧩 Components:

* **Sidebar Navigation**:

  * Lists all editable sections (e.g., `project_goals`, `technologies`, `timeline`).

* **Editable Panel**:

  * Rich text area pre-filled with the section content.
  * Regenerate button below each section.

* **Prompt Input (optional)**:

  * Field to add custom instructions like “make this more concise” or “rewrite for a non-technical client.”

---

## 🧠 5. PromptRewritePage – `/proposal/rewrite/:session_id`

### 🔍 Purpose:

Allows the user to rewrite the full proposal using a custom prompt or instruction.

### ✅ API Integration:

* `POST /proposal/{session_id}/custom_prompt`: Sends prompt and returns a rewritten version of the proposal.

### 🧩 Components:

* **TextArea for Prompt**:

  * Allows freeform input like:

    * “Make it suitable for investors”
    * “Rewrite to be more technical and concise”

* **Submit Button**:

  * Triggers regeneration of the entire proposal using the prompt.

* **Proposal Preview**:

  * Displays the newly generated version alongside the original (optional split-view).

---

## 📂 6. ProposalListPage – `/dashboard`

### 🔍 Purpose:

Dashboard to view, manage, and reuse past proposals.

### ✅ API Integration:

* `GET /sessions`: Retrieves all past sessions linked to the user account.

### 🧩 Components:

* **Proposal List Table/Grid**:

  * Shows proposal title, creation date, and session status.

* **Actions per Proposal**:

  * 👁 View
  * ✏️ Edit
  * 🔄 Regenerate
  * 🗑 Delete
  * ⬇️ Download PDF

* **Search/Filter** (optional):

  * Filter proposals by keyword, date, or client name.

---

## Optional Global UI Components

| Component       | Description                                                 |
| --------------- | ----------------------------------------------------------- |
| 🔒 Auth System  | Login/Register modals or pages for authenticated dashboards |
| 🧭 Navbar       | Links to Home, Dashboard, Help, Profile                     |
| 🎨 Theme Toggle | Light/dark mode support                                     |
| 💬 Toasts       | Success or error notifications for API calls                |

---

Let me know if you'd like:

* Folder structure for React or Next.js
* UI mockups (Tailwind or Figma style)
* Sample `axios` calls or `zustand` store for session state management.