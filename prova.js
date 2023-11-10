const fs = require("fs");
const path = "credenziali.csv";
let lines;
let found=false;

function carica(){
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error("Error while reading:", err);
      return;
    }
    lines = data.split("\n");
  }
)};

function esiste(nome,password){
  lines.forEach((line) => {
    line = line.trim();
    const [lineUsr, linePsw] = line.split(",");
    console.log(line);
    if (lineUsr === nome && Number(linePsw) === password) {
      found = true; 
      console.log("Trovati:", lineUsr, linePsw);
    }
    if (found) {
      return;
    }
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


async function init() {
  carica();
  await sleep(1000);
  esiste("manci",123);
}

init();

// Leggi file CSV

/*
fs.readFile(path, "utf8", (err, data) => {
  if (err) {
    console.error("Error while reading:", err);
    return;
  }
  const lines = data.split("\n");
  let found = false; 

  lines.forEach((line) => {
    line = line.trim().replace(/\r$/, "");
    const [lineUsr, linePsw] = line.split(",");

    if (lineUsr === usr && Number(linePsw) === psw) {
      found = true; 
      console.log("User and password found:", lineUsr, linePsw);
    }

    if (found) {
      return;
    }
  });
});
*/