
// Generated using generate.py
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
export const Sttp = Router();

function GetUploadJson(file: any) {
	if (file==null)
		return {
			id:"nullish",
			sttpdate: "",
			sttpt: "",
			sttpcol: "",
			sttpnw: "",
			sttptype: ""
		};
	return {
			id:file.id,
			sttpdate: file.sttpdate,
			sttpt: file.sttpt,
			sttpcol: file.sttpcol,
			sttpnw: file.sttpnw,
			sttptype: file.sttptype
		};
}


Sttp.post("/sttp", RoutesCommon.IsNotAdmin,
RoutesCommon.upload.array('sttpcerti'), async (req, res) => {
    try {
        const curUser = RoutesCommon.GetUser(req);
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(curUser.id);
        const id = String(params.id);
        const files = req.files as any[];
        // ID Nullish is Used for First time Upload
        if (id === "nullish" && (files == null || files.length === 0))
            return res.status(422).send("Upload Failed");
         const sttpdate = String(params.sttpdate);
         const sttpt = String(params.sttpt);
         const sttpcol = String(params.sttpcol);
         const sttpnw = String(params.sttpnw);
         const sttptype = String(params.sttptype);

        let pathToFiles = null;
        // ID Nullish is Used for First time Upload
        if (files != null && files.length !== 0)
            pathToFiles = RoutesCommon.FilesToPathString(files);
        if (id === "nullish" && pathToFiles != null){
            await Models.Sttp.create({
                UserID: userId,
                Location: pathToFiles,
                sttpdate:sttpdate,
                sttpt:sttpt,
                sttpcol:sttpcol,
                sttpnw:sttpnw,
                sttptype:sttptype,
            });
        }
        else{
            await Models.Sttp.update({
                    sttpdate:sttpdate,
                    sttpt:sttpt,
                    sttpcol:sttpcol,
                    sttpnw:sttpnw,
                    sttptype:sttptype,
                },
                { where: { id: id, UserID: userId } }
            );
            if (pathToFiles != null)
                    await Models.Sttp.update({
                        Location: pathToFiles
                    },
                    { where: { id: id, UserID: userId } }
                    );
            }
    return res.status(200).redirect('/');
}
catch (error) {
    console.error(error);
    return res.status(422).send("Upload Failed");
}
});
Sttp.get("/sttp", RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render('sttp.ejs', GetUploadJson(null));
});
Sttp.get("/sttp/files", RoutesCommon.IsNotAdmin, async (req, res) => {
    const curUser = RoutesCommon.GetUser(req);
    const userId = Number(curUser!.id);
    const files = await Models.Sttp.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Sttp.get("/sttp/files/:userId", RoutesCommon.IsAdmin, async (req, res) => {
    const params = RoutesCommon.GetParameters(req);
    if (params == null)
        return res.json([]);
    const userId = params.userId;
    const files = await Models.Sttp.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Sttp.get("/sttp/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    const curUser = RoutesCommon.GetUser(req);
    const userId = Number(curUser!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Sttp.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('sttp.ejs', GetUploadJson(file));
});
Sttp.get("/sttp/file-viewer/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const curUser = RoutesCommon.GetUser(req);
        const userId = Number(curUser!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Sttp.findOne({
            where: { UserID: userId, id: id }
        });
        if (!file)
            return res.sendStatus(404);
        const filesToDownload: string[] = file.FileLocationsAsArray();

        if (filesToDownload.length === 0)
            return res.sendStatus(404);

        if (filesToDownload.length === 1)
            return res.download(filesToDownload[0]);

        await RoutesCommon.ZipFileGenerator(res, filesToDownload);
    }
    catch (err) { console.log(err); }
    return res.status(404);
});
Sttp.get("/admin/sttp/file-viewer/:id", RoutesCommon.IsAdmin, async (req, res) => {
    try {
        const params = RoutesCommon.GetParameters(req);
        const id = Number(params.id);
        const file = await Models.Sttp.findOne({
            where: { id: id }
        });
        if (!file)
            return res.sendStatus(404);
        const filesToDownload: string[] = file.FileLocationsAsArray();

        if (filesToDownload.length === 0)
            return res.sendStatus(404);

        if (filesToDownload.length === 1)
            return res.download(filesToDownload[0]);

        await RoutesCommon.ZipFileGenerator(res, filesToDownload);
    }
    catch (err) { console.log(err); }
    return res.status(404);
});
Sttp.delete("/sttp/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const curUser = RoutesCommon.GetUser(req);
        const userId = Number(curUser!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Sttp.destroy({
            where: { UserID: userId, id: id }
        });
        const success = (file !== 0);
        return res.json({ success: success });
    }
    catch (err) { 
        return res.json({ success: false });
    }
});
