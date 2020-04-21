import * as dotenv from "dotenv";
import { existsSync } from "fs";

if (existsSync(".env")) {
  console.log("Using .env file to supply config environment variables");
  dotenv.config({ path: ".env" });
}
import * as config from './config/server'
import { App } from "./app";

App().then(app => app.listen(config.Server.Port, () => {
  console.log("Default Login Screen at", config.Server.Port);
})
);

process.on("SIGINT", function () {
  console.log("App Shutting Down");
});

