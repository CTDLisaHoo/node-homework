const os = require('os');
const path = require('path');
const fs = require('fs');

const sampleFilesDir = path.join(__dirname, "sample-files");
if (!fs.existsSync(sampleFilesDir)) {
  fs.mkdirSync(sampleFilesDir, { recursive: true });
}

// Joined Path
const joinedPath = path.join(__dirname, "sample-files", "folder", "file.txt");

//fs.promise API path
const demoFile = path.join(sampleFilesDir, "demo.txt");

//Streams for Large Files
const largeFile = path.join(sampleFilesDir, "largefile.txt");

// OS module
console.log('Platform:', os.platform());
console.log('CPU:', os.cpus()[0].model);
console.log('Total Memory:', os.totalmem());

// Path module
console.log('Joined path:', joinedPath);

// fs.promises API
fs.promises
  .writeFile(demoFile, "Hello from fs.promises!")
  .then(() => {
    return fs.promises.readFile(demoFile, "utf8");
  })
  .then((content) => {
    console.log("fs.promises read:", content);
  })
  .catch((err) => {
    console.log("Something went wrong:", err.message);
  });

// Streams for large files- log first 40 chars of each chunk

//Write with Stream
const writeStream = fs.createWriteStream(largeFile);

for (let i = 0; i < 100; i++) {
  writeStream.write(`Hello, this is line ${i}\n`);
}

writeStream.end();

writeStream.on("finish", () => {
  // The file now exists and writing is complete

  // Read with stream
  const readStream = fs.createReadStream(largeFile, {
    encoding: "utf8",
    highWaterMark: 1024,
  });

  readStream.on("data", (chunk) => {
    console.log("Read chunk:", chunk.slice(0, 40));
  });

  readStream.on("end", () => {
    console.log("Finished reading large file with streams");
  });

  readStream.on("error", (err) => {
    console.error("Error reading file:", err.message);
  });
});