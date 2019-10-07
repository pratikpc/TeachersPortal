import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";

export const Upload = Router();

Upload.get("/upload", RoutesCommon.IsAuthenticated, (req, res) => {
    console.log("Pednekar is Here")
    return res.render("documents.ejs");
});
function GetUploadJson(file: any) {
    return { id: file.id, Category: file.Category, sdptitle: file.sdptitle, year: file.year };
}
Upload.post("/upload", RoutesCommon.IsAuthenticated, RoutesCommon.upload.array("file"), async (req, res) => {
    try {
        const files = req.files as any[];
        if (files == null || files.length === 0)
            return res.status(422).send("Upload Failed");
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(req.user!.id);
        const year = Number(params.year);
        const sdptitle = String(params.sdptitle);
        const Category = String(params.Category);
        // Iterate over all the files
        files.forEach(async (file) => {
            await Models.Files.create({
                UserID: userId,
                Location: file.path,
                year: year,
                sdptitle: sdptitle,
                Category: Category
            });
        });
        return res.status(200).redirect("/upload");
    }
    catch (error) {
        console.error(error);
        return res.status(422).send("Upload Failed");
    }
});
Upload.get("/upload/files", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const files = await Models.Files.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Upload.get("/upload/file-viewer/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Files.findOne({
            where: { UserID: userId, id: id }
        });
        if (!file)
            return res.sendStatus(404);
        const path = file.Location;
        return res.download(path);
    }
    catch (err) { }
    return res.sendStatus(404);
});
Upload.get("/upload/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Files.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render("documents.ejs", GetUploadJson(file));
});
