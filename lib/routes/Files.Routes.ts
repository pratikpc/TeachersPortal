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
