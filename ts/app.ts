import express from "express";
import * as bodyParser from "body-parser";
import * as Models from "./Models/Sequelize";
import * as Routes from "./routes/Routes";
import * as cors from "cors";
import { PassportModelsGenerate } from "./Models/Passport.Models";

export const app = express();
// app.use(bodyParser.json());
// middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Use this to Render HTML

// Specify Path of Website Static Contents
app.engine('.html', require('ejs').renderFile);
app.set("views", "./Views");
app.set('view engine', 'ejs');
app.use("/", express.static("./Website"));

Models.RunSynchronisation().then(() => { });
PassportModelsGenerate(app);

app.use(cors.default());
// middleware for json body parsing
app.use(bodyParser.json());
// middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// middleware for json body parsing
app.use(bodyParser.json({ limit: "20mb" }));

// Route via this as Path to Users
app.use("/user", Routes.Users);
// Route via this as Path to Admin
app.use("/admin", Routes.Admin);

// Route via this as Path to Updation
app.use("/", Routes.Updation);
// Route via this as Path to Conference
app.use("/", Routes.Conference);
app.use("/", Routes.Fdp);
app.use("/", Routes.Sttp);
app.use("/", Routes.Journal);
app.use("/", Routes.Progatt);
app.use("/", Routes.Semwork);
app.use("/", Routes.Mrg);

app.get("/", (req, res) => {
  if (req.isUnauthenticated()) return res.render("login.html");
  if (req.user.Authority === "ADMIN")
    return res.redirect("/admin");
  else if (req.user.Authority === "NORMAL")
    return res.redirect("/index");
});