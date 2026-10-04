# Node.js Fundamentals

## What is Node.js?
Node.js is a **runtime environment for JavaScript**. 

## How does Node.js differ from running JavaScript in the browser?
Node.js is it allows us to run JavaScript **outside of a web browser**. While JavaScript in the browser runs inside a **sandbox for security**. This means a website cannot normally access files on my computer directly.

## What is the V8 engine, and how does Node use it?
Node.js uses the **V8 JavaScript engine**. V8 was created by Google and is used by Chrome to execute JavaScript. Node.js also uses V8 to execute JavaScript, and Node.js provides additional APIs for things like files and networking.

## What are some key use cases for Node.js?
Some common uses of Node.js are **web servers, web APIs, backend applications, command-line tools, and real-time applications**.

## Explain the difference between CommonJS and ES Modules. Give a code example of each.
**CommonJS:**
CommonJS uses `require()` to import code and `module.exports` to export code.

For example, in `mathUtils.js`:
```js
function add(a, b) {
  return a + b;
}

module.exports = { add };
```
Then, in another file such as `app.js`, we can import the function:
```js
const { add } = require("./mathUtils");

console.log(add(2, 3));
```
Here, `module.exports` makes the `add` function available, and `require("./mathUtils")` imports it into `app.js`.

**ES Modules:**
ES Modules use `import` and `export`.

For example, in `mathUtils.js`:
```js
export function add(a, b) {
  return a + b;
}
```
Then, in another file such as `app.js`, we can import the function:
```js
import { add } from "./mathUtils.js";

console.log(add(2, 3));
```
Here, `export` makes the `add` function available, and `import` brings it into `app.js`.

The easy way to remember is:
- CommonJS uses **`require` and `module.exports`**.
- ES Modules use **`import` and `export`**.
    
CommonJS is used in this course and is still used in many existing Node.js projects. ES Modules are commonly used in modern JavaScript projects.
