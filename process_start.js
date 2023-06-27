const { spawn } = require("child_process");

function startServer() {
  const serverProcess = spawn("node", ["server.js"]);

  serverProcess.stdout.on("data", (data) => {
    console.log(`Server stdout: ${data}`);
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(`Server stderr: ${data}`);
  });

  serverProcess.on("close", (code) => {
    console.log(`Server process exited with code ${code}`);
  });
}

// Example: Start the server
startServer();
