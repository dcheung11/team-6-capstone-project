## Frontend Structure

### `components/`
This folder contains **reusable UI components** that make up the building blocks of the application. Each component represents a specific part of the user interface, such as buttons, forms, or headers. Components are typically small, self-contained, and can be used throughout the application. They are sub-organized by the type of component (Table, Card, etc.)

Ex: `ScheduleTable.jsx`

### `views/`
The `views/` folder contains **higher-level components** that represent entire pages or container of the application. Views typically combine multiple components to form the complete layout of a page.

Ex: `HomePage.jsx`

### `api/`
The `api/` folder holds the logic for interacting with the backend API. It contains functions to **send HTTP requests** to the backend, such as getting, posting, updating, or deleting league data. This abstraction helps keep the code modular and ensures easier communication between the frontend and backend.

### `assets/`
The `assets/` folder contains **static files** used in the application, such as images, icons, and other media.

### `context/`
The `context/` folder defines **React Contexts** for global state management. Contexts provide a way to share user auth values across different components without needing to pass props manually at each level of the component tree.

### `hooks/`
The `hooks/` folder contains custom **React hooks** that encapsulate reusable logic for various tasks (providing auth) These hooks can be used across components to keep the code clean and maintainable.

### `utils/`
The `utils/` folder holds **utility functions** that assist with common tasks in the application, such as formatting.

#### `utils/Constants.js`
A constants file is used to store commonly repeating variables to avoid repetitive code. We are still in the process of removing some values and reusing them as a Constant.

```
export const MCMASTER_COLOURS = {
  maroon: "#7A003C",
  grey: "#5E6A71",
  gold: "#FDBF57",
  lightGrey: "#F5F5F5",
};
```

### `App.js`
`App.js` is the main entry point for the frontend application. It defines the overall structure of the UI and sets up the routing system.

### `routes.js`
`routes.js` defines the **client-side routes** for the application using React Router (or a similar routing library). It maps each route to its corresponding view, allowing users to navigate between different pages of the application.
