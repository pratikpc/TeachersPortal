import { Router } from "express";
import { RoutesCommon } from "./Common.Routes";
import * as Models from "../Models/Models";

export const Files = Router();

Files.delete("/", RoutesCommon.IsAuthenticated, async (req, res) => {
  const params = RoutesCommon.GetParameters(req);
  const fileId = Number(params.file);
  const userId = Number(req.user!.id);

  const count = await Models.Files.destroy({
    where: { id: fileId, UserID: userId }
  });

  if (count === 0) return res.json({ success: false });

  return res.json({ success: true });
});

Files.get("/", RoutesCommon.IsAuthenticated, async (req, res) => {
  try {
    const userId = Number(req.user!.id);

    const data: any[] = [];
    const files = await Models.Files.findAll({
      where: { UserID: userId },
      order: [["id", "ASC"]]
    });

    files.forEach(file => {
      data.push({
        file: file.id
      });
    });

    return res.json({ success: true, data: data });
  } catch (err) {
    console.error(err);
  }
  return res.json({
    success: false,
    data: null
  });
});

Files.post(
  "/conference",
  RoutesCommon.IsAuthenticated,
  RoutesCommon.upload.array("ccerti"),
  async (req, res) => {
    try {
      const files = req.files as any[];
      if (files == null || files.length === 0) return res.status(422).send("Upload Failed");

      const params = RoutesCommon.GetParameters(req);
      if (params == null) return res.status(422).send("Upload Failed");

      const userId = Number(req.user!.id);
      const ci = String(params.ci);
      const cissn = String(params.cissn);
      const ct = String(params.ct);
      const crpt = String(params.crpt);
      const cma = String(params.cma);
      const cdate = String(params.cdate);
      const curl = String(params.curl);

      // Iterate over all the files
      files.forEach(async file => {
        await Models.Conference.create({
          UserID: userId,
          ci: ci,
          cissn: cissn,
          ct: ct,
          crpt: crpt,
          cma: cma,
          cdate: cdate,
          curl: curl,
          Location: file.path
        });
      });

      return res.status(200).redirect("/upload");
    } catch (error) {
      console.error(error);
      return res.status(422).send("Upload Failed");
    }
  }
);
function GetConference(file: any) {
  return {
    id: file.id,
    ci: file.ci, ct: file.ct, crpt: file.crpt, cma: file.cma, cissn: file.cissn, cdate: file.cdate,
    curl: file.curl
  }
}

Files.get("/conference", RoutesCommon.IsAuthenticated, async (req, res) => {
  const userId = Number(req.user!.id);
  const params = RoutesCommon.GetParameters(req);
  const id = Number(params.id);

  const file = await Models.Conference.findOne({
    where: { UserID: userId, id: id }
  });

  return res.render("conference.ejs", GetConference(file));
});

Files.get("/conference/all", RoutesCommon.IsAuthenticated, async (req, res) => {
  const userId = Number(req.user!.id);
  const files = await Models.Conference.findAll({
    where: { UserID: userId }
  });
  console.log(files);
  const files_json: any[] = [];
  files.forEach(file => {
    console.log(file);
    files_json.push(GetConference(file));
  })

  return res.json(files_json);
});

Files.get("/conference/file-viewer", RoutesCommon.IsAuthenticated, async (req, res) => {
  try {
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;

    const file = await Models.Files.findOne({
      where: { UserID: userId, id: id }
    });
    if (!file) return res.sendStatus(404);

    const path = file.Location;
    return res.download(path);
  } catch (err) { }
  return res.sendStatus(404);
});

Files.get("/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
  try {
    const params = RoutesCommon.GetParameters(req);
    const fileId = Number(params.id);
    const userId = Number(req.user!.id);

    const file = await Models.Files.findOne({
      where: { id: fileId, UserID: userId }
    });
    if (!file) return res.sendStatus(404);

    const path = file.Location;
    return res.download(path);
  } catch (err) {
    console.error(err);
  }
  return res.sendStatus(404);
});