import { Router } from "express";
import { RoutesCommon, upload } from "./Common.Routes";
import * as Models from "../Models/Models";
import * as fs from "fs";

export const Files = Router();

Files.post(
  "/upload",
  RoutesCommon.IsAuthenticated,
  upload.array("files"),
  async (req, res) => {
    try {
      const files = req.files as any[];
      if (files.length === 0) return res.status(422).send("Upload Failed");

      const params = RoutesCommon.GetParameters(req);
      if (params == null) return res.status(422).send("Upload Failed");

      const userId = Number(req.user!.id);

      // Iterate over all the files
      files.forEach(async file => {

        await Models.Files.create({
          UserID: userId,
          Location: file.filename
        });

      });

      return res.status(200).redirect("/files/upload");
    } catch (error) {
      console.error(error);
      return res.status(422).send("Upload Failed");
    }
  }
);

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

Files.get("/upload/", RoutesCommon.IsAuthenticated, async (req, res) => {
  return RoutesCommon.NoCaching(res).render("random=file.html");
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
