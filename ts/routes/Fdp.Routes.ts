
// Generated using generate.py
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
export const Fdp = Router();

function GetUploadJson(file: any) {
	if (file==null)
		return {
			id:"nullish",
			fdpdate: "",
			fdpt: "",
			fdpcol: "",
			fdpnd: "",
			fdptype: ""
		};
	return {
			id:file.id,
			fdpdate: file.fdpdate,
			fdpt: file.fdpt,
			fdpcol: file.fdpcol,
			fdpnd: file.fdpnd,
			fdptype: file.fdptype
		};
}


Fdp.post("/fdp", RoutesCommon.IsNotAdmin,
RoutesCommon.upload.array('fdpcerti'), async (req, res) => {
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
         const fdpdate = String(params.fdpdate);
         const fdpt = String(params.fdpt);
         const fdpcol = String(params.fdpcol);
         const fdpnd = String(params.fdpnd);
         const fdptype = String(params.fdptype);

        let pathToFiles = null;
        // ID Nullish is Used for First time Upload
        if (files != null && files.length !== 0)
            pathToFiles = RoutesCommon.FilesToPathString(files);
        if (id === "nullish" && pathToFiles != null){
            await Models.Fdp.create({
                UserID: userId,
                Location: pathToFiles,
                fdpdate:fdpdate,
                fdpt:fdpt,
                fdpcol:fdpcol,
                fdpnd:fdpnd,
                fdptype:fdptype,
            });
        }
        else{
            await Models.Fdp.update({
                    fdpdate:fdpdate,
                    fdpt:fdpt,
                    fdpcol:fdpcol,
                    fdpnd:fdpnd,
                    fdptype:fdptype,
                },
                { where: { id: id, UserID: userId } }
            );
            if (pathToFiles != null)
                    await Models.Fdp.update({
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
Fdp.get("/fdp", RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render('fdp.ejs', GetUploadJson(null));
});
Fdp.get("/fdp/files", RoutesCommon.IsNotAdmin, async (req, res) => {
    const curUser = RoutesCommon.GetUser(req);
    const userId = Number(curUser!.id);
    const files = await Models.Fdp.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Fdp.get("/fdp/files/:userId", RoutesCommon.IsAdmin, async (req, res) => {
    const params = RoutesCommon.GetParameters(req);
    if (params == null)
        return res.json([]);
    const userId = params.userId;
    const files = await Models.Fdp.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Fdp.get("/fdp/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    const curUser = RoutesCommon.GetUser(req);
    const userId = Number(curUser!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Fdp.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('fdp.ejs', GetUploadJson(file));
});
Fdp.get("/fdp/file-viewer/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const curUser = RoutesCommon.GetUser(req);
        const userId = Number(curUser!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Fdp.findOne({
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
Fdp.get("/admin/fdp/file-viewer/:id", RoutesCommon.IsAdmin, async (req, res) => {
    try {
        const params = RoutesCommon.GetParameters(req);
        const id = Number(params.id);
        const file = await Models.Fdp.findOne({
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
Fdp.delete("/fdp/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const curUser = RoutesCommon.GetUser(req);
        const userId = Number(curUser!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Fdp.destroy({
            where: { UserID: userId, id: id }
        });
        const success = (file !== 0);
        return res.json({ success: success });
    }
    catch (err) { 
        return res.json({ success: false });
    }
});
