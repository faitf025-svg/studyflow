# StudyFlow Code Guide

This guide explains the application source files and project configuration in
StudyFlow. It focuses on files maintained for this app; installed packages in
`node_modules` are third-party code and are not covered here.

## How the app fits together

`index.html` provides the page shell and the `#root` element. `src/main.jsx`
mounts React there, enables client-side routing, and loads the stylesheets.
`src/App.jsx` owns the routes and shared task state. It passes task data and
callbacks to the page components in `src/pages/`. `src/App.css` and
`src/index.css` style those components and the overall page.

Task information is stored in the browser's local storage under the
`studyflow-tasks` key, so it is available again when the app is reopened in the
same browser.

## Application entry and routing

### `index.html`

- `<!doctype html>` tells the browser to use standards mode.
- `<html lang="en">` identifies the document language for browsers and
  assistive technologies.
- The `<head>` sets UTF-8 text encoding, links the favicon, configures the
  viewport for mobile-sized screens, and sets the browser-tab title.
- `<div id="root"></div>` is the mount point into which React renders the app.
- The module script loads `src/main.jsx`, which starts the JavaScript
  application.

### `src/main.jsx`

- Imports React's `StrictMode`, React DOM's `createRoot`, and the router's
  `BrowserRouter`.
- Imports the top-level `App` component and both application stylesheets.
- Finds the HTML element with the `root` ID and renders the application into
  it.
- `StrictMode` enables additional development-time checks. `BrowserRouter`
  provides URL-based navigation to `App` and its child pages.

### `src/App.jsx`

- Imports React state/effect hooks and router components used for links,
  navigation, route rendering, and reading the current URL.
- Imports each page component: `AddTask`, `Calendar`, `Dashboard`, `MyTasks`,
  and `Progress`.
- `TASKS_STORAGE_KEY` names the local-storage entry containing saved tasks.
- `navigationLinks` is the list used to build the header navigation. Each item
  pairs a route with its visible label.
- `isStoredTask(task)` checks that a saved value has the expected task shape:
  an ID, title, optional subject and due date, allowed priority, and a boolean
  completion value.
- `loadSavedTasks()` reads the saved JSON, parses and validates it, and fills
  absent optional fields with empty strings. When the data is absent it starts
  with an empty list. If reading, parsing, or validation fails, it logs the
  error and returns an empty list plus a message for the interface to display.
- `WelcomePage()` renders the introductory screen and its link to the
  dashboard.
- `App()` initializes task state from `loadSavedTasks()`, tracks any storage
  error, and checks whether the current route is the welcome page.
- Its `useEffect` saves task changes to local storage unless there is already
  a storage error. A save failure is logged and shown to the user.
- `addTask(taskDetails)` adds a unique ID and an initial `completed: false`
  value to a new task, then appends it to the task list.
- `toggleTask(taskId)` changes the completion state of the task with the
  matching ID without mutating the existing array or task object.
- `deleteTask(taskId)` removes the task with the matching ID.
- On the root URL, `App()` renders the welcome page. On other URLs it renders
  the navigation, any storage alert, and the matching page route.
- The route table connects each URL to its page and passes the task data or
  callbacks that page needs. Unknown URLs redirect to the welcome page.
- `export default App` makes the component available to `main.jsx`.

## Page components

Each page is a React function that receives data and callbacks from `App.jsx`.
The page components render content; shared task state stays in `App.jsx`.

### `src/pages/Dashboard.jsx`

- Imports `Link` so buttons can navigate without a full page reload.
- `Dashboard({ tasks = [] })` accepts the task list and defaults to an empty
  list if none is supplied.
- It counts completed tasks with `filter`, then calculates pending tasks by
  subtracting the completed count from the total.
- The JSX renders the dashboard heading, summary cards, shortcuts to adding
  or viewing tasks, and a recent-task section.
- When there are no tasks, it shows an empty-state message. Otherwise
  `slice(-3).reverse()` selects the latest three items and displays them with
  their completion status. `key={task.id}` gives each rendered row a stable
  React key.
- The default export lets `App.jsx` use the page in its route.

### `src/pages/AddTask.jsx`

- Imports `useState` for form values and `useNavigate` to change routes after
  a successful submission.
- The component stores the title, subject, due date, priority, and title
  validation message as state. Priority begins as `Medium`.
- `handleSubmit(event)` prevents the browser's normal form submission. It
  checks that the trimmed title is not empty; if it is empty, it sets an
  error and stops. Otherwise it clears the error, sends the cleaned form
  values to the `onAdd` callback, and navigates to the task list.
- Each form control is controlled by React: its `value` comes from state and
  its `onChange` handler updates that state.
- The title field also clears its validation error when the user edits it.
  `aria-invalid`, `aria-describedby`, and the alert role expose the validation
  state to assistive technology.
- The subject and due date are optional. The priority select offers Low,
  Medium, and High options. Submitting the form invokes `handleSubmit`.

### `src/pages/MyTasks.jsx`

- Receives the task list, an `onToggle` callback, and an `onDelete` callback.
- Shows an empty-state card when there are no tasks. Otherwise it maps each
  task to a card with its title, subject, due date, priority, and completion
  status.
- Optional subject and date values are replaced with explanatory text when
  absent.
- A completed title gets the `completed-title` class, and the status text and
  class reflect whether the task is complete.
- The completion button calls `onToggle(task.id)` and uses `aria-pressed` to
  communicate the current state. Its label changes between “Undo” and “Mark
  Complete”.
- The delete button calls `onDelete(task.id)` and gives its accessible label
  the task's title.

### `src/pages/Calendar.jsx`

- Receives the task list and makes a shallow copy before filtering and sorting,
  so the original array is not reordered.
- `upcomingTasks` includes only incomplete tasks that have a due date, sorted
  by the date string from earliest to latest.
- `formatDate(dueDate)` converts a stored date into a localized readable date
  with a year, full month name, and day.
- The page shows an empty-state explanation when no qualifying tasks exist.
  Otherwise, it renders each task's name, subject, formatted due date, and
  priority.

### `src/pages/Progress.jsx`

- `Progress({ tasks = [] })` receives the task list and falls back to an empty
  list if needed.
- `completed` counts tasks whose `completed` value is true.
- `total` is the number of tasks; `pending` is the difference between total
  and completed.
- `percentage` is zero when there are no tasks. Otherwise, it is the rounded
  percentage of completed tasks.
- The first group of cards displays total, completed, pending, and completion
  percentage.
- The completion bar uses a `.progress-track` container and a
  `.progress-fill` child. The child's inline width is set to the calculated
  percentage, so it grows as tasks are completed.
- `role="progressbar"` and its `aria-valuenow`, `aria-valuemin`,
  `aria-valuemax`, and `aria-label` describe the bar to assistive technologies.
- The accompanying text reports the completed count and changes its
  encouragement message based on whether there are no tasks, all tasks are
  completed, or some work remains.

## Stylesheets

### `src/index.css`

- The `:root` rule sets the base font, page text and background colours, and
  browser text-rendering options.
- The universal `*` rule applies `border-box` sizing, making declared element
  widths include padding and borders.
- The `html` and `body` rules set minimum page dimensions; the body margin is
  reset to remove the browser's default outer gap.
- Buttons and form controls inherit the surrounding font.
- Links inherit their text colour from their parent.

### `src/App.css`

- The `:root` custom properties define reusable theme colours. Components use
  these variables so common colour choices stay consistent.
- The universal selector applies `border-box` sizing. The `body` rule sets
  the base font, background, and text colour; `#root` fills at least the
  viewport height.
- The welcome-page rules style the full-height introduction, centered card,
  heading, tagline, and supporting text.
- The navigation rules arrange the logo and links in a flexible header and
  style normal, hovered, and active links.
- The page-layout rules set the content's maximum width, centering, padding,
  heading colours, paragraph treatment, and storage-error alert.
- The card and statistics rules arrange the dashboard counters and progress
  cards into grids, then give cards their surface, border, padding, and
  shadow. `.content-card` also adds vertical spacing.
- The button rules share shape, padding, font weight, and cursor behavior
  across button types, then define the primary, secondary, and delete
  appearances and hover states.
- The `:focus-visible` rule adds a visible keyboard-focus outline to
  interactive controls.
- The form rules constrain the form width, lay out labels and fields, apply
  field borders and surfaces, and highlight a focused field. `.form-error`
  styles validation text.
- The task-list rules lay out each task and its actions, style task details,
  cross out completed titles, draw row separators, and align deadline text.
- The progress-bar rules define the track and fill dimensions, rounded ends,
  clipping, and the animated width transition.
- The media query at 800 pixels stacks the navigation, changes statistics to
  one column, and reduces selected spacing and heading size for smaller
  screens.
- The media query at 450 pixels stacks task rows and left-aligns the deadline
  on narrow screens.

## Project configuration and assets

### `package.json`

- `name`, `version`, and `private` identify the package and prevent accidental
  publication.
- `"type": "module"` enables JavaScript ES module syntax for project config
  and tooling.
- The scripts provide commands for starting the Vite development server,
  building production assets, linting, and previewing a production build.
- `dependencies` lists the runtime libraries: React, React DOM, and React
  Router.
- `devDependencies` lists the build, lint, React plugin, and supporting
  packages used during development.

### `package-lock.json`

This generated lockfile records the exact dependency versions and nested
dependency graph installed for the project. Package managers use it to
reproduce installs consistently; it is not application logic and normally
should be updated by the package manager rather than edited manually.

### `vite.config.js`

- Imports Vite's `defineConfig` helper and the React plugin.
- Exports Vite configuration that enables the React plugin, allowing Vite to
  process the app's React and JSX source.

### `eslint.config.js`

- Imports ESLint's recommended JavaScript rules, browser global definitions,
  React Hooks rules, React Refresh rules, and configuration helpers.
- Ignores the generated `dist` directory.
- Applies the configurations to JavaScript and JSX files, enables JSX parsing,
  and makes browser globals available to lint checks.
- The result is the project's lint configuration, used by the `npm run lint`
  script.

### `vercel.json`

The rewrite sends incoming paths to `/`. This lets the client-side router load
the app for routes such as `/dashboard` and `/progress` instead of requiring
each route to exist as a separate server file.

### `src/assets/react.svg` and `src/assets/vite.svg`

These are static SVG vector images for the React and Vite logos. SVG markup
describes scalable shapes and colours. They are assets rather than executable
application logic; the current page components do not import them.
