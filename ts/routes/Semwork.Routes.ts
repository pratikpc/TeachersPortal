
// Generated using generate.py
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
export const Semwork = Router();

function GetUploadJson(file: any) {
	if (file==null)
		return {
			id:"nullish",
			swdate: "",
			swt: "",
			swcol: "",
			swnd: "",
			swtype: ""
		};
	return {
			id:file.id,
			swdate: file.swdate,
			swt: file.swt,
			swcol: file.swcol,
			swnd: file.swnd,
			swtype: file.swtype
		};
}


Semwork.post("/semwork", RoutesCommon.IsNotAdmin,
RoutesCommon.upload.array('swcerti'), async (req, res) => {
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
         const swdate = String(params.swdate);
         const swt = String(params.swt);
         const swcol = String(params.swcol);
         const swnd = String(params.swnd);
         const swtype = String(params.swtype);

        let pathToFiles = null;
        // ID Nullish is Used for First time Upload
        if (files != null && files.length !== 0)
            pathToFiles = RoutesCommon.FilesToPathString(files);
        if (id === "nullish" && pathToFiles != null){
            await Models.Semwork.create({
                UserID: userId,
                Location: pathToFiles,
                swdate:swdate,
                swt:swt,
                swcol:swcol,
                swnd:swnd,
                swtype:swtype,
            });
        }
        else{
            await Models.Semwork.update({
                    swdate:swdate,
                    swt:swt,
                    swcol:swcol,
                    swnd:swnd,
                    swtype:swtype,
                },
                { where: { id: id, UserID: userId } }
            );
            if (pathToFiles != null)
                    await Models.Semwork.update({
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
Semwork.get("/semwork", RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render('semwork.ejs', GetUploadJson(null));
});
Semwork.get("/semwork/files", RoutesCommon.IsNotAdmin, async (req, res) => {
    const curUser = RoutesCommon.GetUser(req);
    const userId = Number(curUser!.id);
    const files = await Models.Semwork.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Semwork.get("/semwork/files/:userId", RoutesCommon.IsAdmin, async (req, res) => {
    const params = RoutesCommon.GetParameters(req);
    if (params == null)
        return res.json([]);
    const userId = params.userId;
    const files = await Models.Semwork.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Semwork.get("/semwork/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    const curUser = RoutesCommon.GetUser(req);
    const userId = Number(curUser!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Semwork.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('semwork.ejs', GetUploadJson(file));
});
Semwork.get("/semwork/file-viewer/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const curUser = RoutesCommon.GetUser(req);
        const userId = Number(curUser!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Semwork.findOne({
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
Semwork.get("/admin/semwork/file-viewer/:id", RoutesCommon.IsAdmin, async (req, res) => {
    try {
        const params = RoutesCommon.GetParameters(req);
        const id = Number(params.id);
        const file = await Models.Semwork.findOne({
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
Semwork.delete("/semwork/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const curUser = RoutesCommon.GetUser(req);
        const userId = Number(curUser!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Semwork.destroy({
            where: { UserID: userId, id: id }
        });
        const success = (file !== 0);
        return res.json({ success: success });
    }
    catch (err) { 
        return res.json({ success: false });
    }
});
