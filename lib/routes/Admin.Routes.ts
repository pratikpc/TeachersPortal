import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
export const Admin = Router();

Admin.get("/" , RoutesCommon.IsAdmin, (req, res) => {
    res.render("admin.ejs");
});
Admin.get("/createuser" , RoutesCommon.IsAdmin, (req, res) => {
    res.render("createuser.ejs");
});
