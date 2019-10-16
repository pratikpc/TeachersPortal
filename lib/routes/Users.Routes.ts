import { Router } from "express";
import * as Model from "../Models/Users.Model";
import { randomBytes } from "crypto";
import passport from "passport";
import { RoutesCommon } from "./Common.Routes";

export const Users = Router();

Users.get("/login/", (req, res) => {
  if (req.isUnauthenticated()) return res.render("login.html");
  return res.redirect("/");
});
// This is the Uri
// By default when Post Request is Made
// Authenticate if this is an actual user
// If not, Perform Redirection
Users.post(
  "/login/",
  passport.authenticate("app", { failureRedirect: "/" }),
  (req, res) => {
    return res.redirect("/");
  }
);

// Uri for Logout
Users.all("/logout/", RoutesCommon.IsAuthenticated, (req, res) => {
  req.logout();
  return res.redirect("/");
});

// Users.get("/list/", RoutesCommon.IsAdmin, async (req, res) => {
//   return RoutesCommon.NoCaching(res).render("userlist.html");
// });

// This is the Uri for Registration of a new user
Users.post("/add/", RoutesCommon.IsAdmin, async (req, res) => {
  try {
    const params = RoutesCommon.GetParameters(req);

    const name = String(params.name);
    if (name == null) return res.json({ success: false, password: null });
    if (name === "") return res.json({ success: false, password: null });


    const count_users = await Model.Users.count({ where: { Name: name } });

    if (count_users !== 0) return res.json({ success: false, password: null });

    // Generate Random Pass Key
    const pass_key = randomBytes(10).toString("hex");
    const authority = "NORMAL";
    const new_user = await Model.Users.create({
      Name: name,
      Password: pass_key,
      Authority: authority
    });

    if (!new_user) return res.json({ success: false, password: null });

    return res.json({ success: true, password: pass_key });
  } catch (error) {
    return res.json({ success: false, password: null });
  }
});

// This is Uri to access List of Non Admin Users
Users.get("/", RoutesCommon.IsAdmin, async (req, res) => {
  try {
    const users = await Model.Users.findAll({
      attributes: ["id", "Name"],
      where: { Authority: "NORMAL" }
    });
    const list: any[] = [];
    users.forEach(user => {
      list.push({ id: user.id, name: user.Name });
    });
    return res.json(list);
  } catch (error) {
    return res.json([]);
  }
});
Users.delete("/:id", RoutesCommon.IsAdmin, async (req, res) => {
  try {
    const params = RoutesCommon.GetParameters(req);
    const id = Number(params.id);
    const count = await Model.Users.destroy({
      where: { id: id, Authority: "NORMAL" }
    });
    if (count !== 0)
      return res.json({ success: true });
  } catch (error) {
  }
  return res.json({
    success: false
  });
});
Users.get("/:id", RoutesCommon.IsAdmin, async (req, res) => {
  try {
    const params = RoutesCommon.GetParameters(req);
    const id = Number(params.id);
    const user = await Model.Users.findOne({
      attributes: ["id", "Name"],
      where: { id: id, Authority: "NORMAL" }
    });
    if (!user)
      return res.json({
        success: false,
        data: { id: null, name: null }
      });
    return res.json({
      success: true,
      data: { id: user.id, name: user.Name }
    });
  } catch (error) {
    return res.json({
      success: false,
      data: { id: null, name: null }
    });
  }
});

