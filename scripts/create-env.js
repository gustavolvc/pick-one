const fs = require("fs");

fs.writeFileSync("./.env", `API=${process.env.API_KEY}\n`);
