# Wallaround Take Home Assignment

## Goal
- A reusable, dataset‑agnostic Filter Builder UI library that allows users to
construct arbitrary nested conditions (and / or groups) and serialize them into a
JSON structure.
- The library must be schema‑driven (fields, types, operators provided via config)
and support sending filters to a server via: GET (as a query string parameter) & POST (as JSON body)


## Project structure

The application is structured using a monorepo architecture, which includes the filter builder library `(/libs/filter-builder)` and a demo application `(/apps/demo)`.

## Installation
``
 npm install
``

## Running the Project
Go to the demo folder

``
cd apps/demo
``

Run the start command

``
 npm run dev
``

Project will start running on port 3000

``
 http://localhost:3000/
``

## Available Scripts 

### 1. Running test

`` npm run test``

### 2. Running test coverage

`` npm run test:coverage``

### 3. Format code  styling

`` npm run format``

### 4. Code Type check

`` npm run type-check``

## Configuration API

### The FilterBuilder Library accept the following Props
```js
const props = {
    schema, // Available fields for the Filter builder. Each field consist of the label, type and value
    operator, // This consists of all the operators available for each field type
    initial, // optional initial value for the Filter builder library
    api, // holds the Request action type and endpoint the library can use to send filters to a server
    onSubmit // this calback is fired when the submit button is clicked
}
```

### onSubmit Action
1. The submit button is enabled when all the rules in the group are valid based on the operator
2. The library returns the filter JSON data and serialized query string 

## Architecture Decisions

1. I structured the library around two main components: `GroupEditor` and `ConditionRow`. GroupEditor recursively renders child groups or conditions, while ConditionRow handles individual conditions, enabling support for infinitely nested AND/OR groups.
2. Extensibility: The filter builder’s props are fully configurable, allowing the library to adapt flexibly to diverse domains and use cases.
3. I implemented a monorepo architecture to host both the library and its demo application in a single repository, enhancing development efficiency and maintaining consistent tooling.
4. I selected Material-UI as the design system due to its built-in accessibility features and comprehensive library of reusable components, enabling faster development and a consistent, user-friendly interface.
5. I ensured 100% test coverage for the library codebase, through thorough validation of all logic and supporting long-term reliability.

## Filter Builder UI

<img width="2291" height="1440" alt="Screenshot 2025-09-26 at 14 51 20" src="https://github.com/user-attachments/assets/1cfaf01b-7e9b-4862-99da-5935746ff1a0" />
