const fs = require("fs");
const path = "credenziali.csv";
let usr = "brugnir33";
let psw = 123;

// Read the CSV file
fs.readFile(path, "utf8", (err, data) => {
  if (err) {
    console.error("Error while reading:", err);
    return;
  }
  const lines = data.split("\n");
  let found = false; // Initialize a variable to track if a match is found

  lines.forEach((line) => {
    line = line.trim().replace(/\r$/, "");
    const [lineUsr, linePsw] = line.split(","); // Assuming CSV format is user,password

    if (lineUsr === usr && Number(linePsw) === psw) {
      found = true; // Set found to true when a match is found
      console.log("User and password found:", lineUsr, linePsw);
    }

    if (found) {
      // If a match is found, break out of the loop
      return;
    }
  });
});