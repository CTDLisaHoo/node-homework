const fs = require('fs');
const path = require('path');

const sampleFilesDir = path.join(__dirname, "sample-files");

if (!fs.existsSync(sampleFilesDir)) {
  fs.mkdirSync(sampleFilesDir, { recursive: true });
}

const filePath = path.join(sampleFilesDir, "sample.txt");

// Write a sample file for demonstration
fs.writeFile(filePath, "Hello, async world!", (err) => {
  if (err) {
    console.log("Error writing file:", err.message);
    return;
  }
});

// 1. Callback style
fs.readFile(filePath, "utf8", (err, content) => {
  if (err) {
    console.log("File read failed:", err.message);
    return;
  }

  console.log('Callback:', content);
});

// Callback hell example (test and leave it in comments):
// Multiple asynchronous operations can become deeply nested,
// making the code difficult to read and maintain.
//
//     fs.readFile("file1.txt", "utf8", (err, data1) => {
//     fs.readFile("file2.txt", "utf8", (err, data2) => {
//     fs.writeFile("file3.txt", data1 + data2, (err) => {
//         console.log("Finished");
//      });
//   });
// });

// 2. Promise style
fs.promises
  .readFile(filePath, "utf8")
  .then((content) => {
    console.log('Promise:', content);
  })
  .catch((err) => {
    console.log("Something went wrong:", err.message);
  });

// 3. Async/Await style
async function run() {
  try {
    const result = await fs.promises.readFile(
      filePath,
      "utf8"
    );

    console.log('Async/Await:', result);
  } catch (err) {
    console.log("Something went wrong:", err.message);
  }
}
run();
