
// Generated using generate.py
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
export const Mrg = Router();

function GetUploadJson(file: any) {
	if (file==null)
		return {
			id:"nullish",
			mrgcat: "",
			mrgt: "",
			mrgauth: "",
			mrgya: "",
			mrgga: ""
		};
	return {
			id:file.id,
			mrgcat: file.mrgcat,
			mrgt: file.mrgt,
			mrgauth: file.mrgauth,
			mrgya: file.mrgya,
			mrgga: file.mrgga
		};
}


Mrg.post("/mrg", RoutesCommon.IsNotAdmin,
RoutesCommon.upload.array('mrgcerti'), async (req, res) => {
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
         const mrgcat = String(params.mrgcat);
         const mrgt = String(params.mrgt);
         const mrgauth = String(params.mrgauth);
         const mrgya = String(params.mrgya);
         const mrgga = String(params.mrgga);

        let pathToFiles = null;
        // ID Nullish is Used for First time Upload
        if (files != null && files.length !== 0)
            pathToFiles = RoutesCommon.FilesToPathString(files);
        if (id === "nullish" && pathToFiles != null){
            await Models.Mrg.create({
                UserID: userId,
                Location: pathToFiles,
                mrgcat:mrgcat,
                mrgt:mrgt,
                mrgauth:mrgauth,
                mrgya:mrgya,
                mrgga:mrgga,
            });
        }
        else{
            await Models.Mrg.update({
                    mrgcat:mrgcat,
                    mrgt:mrgt,
                    mrgauth:mrgauth,
                    mrgya:mrgya,
                    mrgga:mrgga,
                },
                { where: { id: id, UserID: userId } }
            );
            if (pathToFiles != null)
                    await Models.Mrg.update({
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
Mrg.get("/mrg", RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render('mrg.ejs', GetUploadJson(null));
});
Mrg.get("/mrg/files", RoutesCommon.IsNotAdmin, async (req, res) => {
    const curUser = RoutesCommon.GetUser(req);
    const userId = Number(curUser!.id);
    const files = await Models.Mrg.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Mrg.get("/mrg/files/:userId", RoutesCommon.IsAdmin, async (req, res) => {
    const params = RoutesCommon.GetParameters(req);
    if (params == null)
        return res.json([]);
    const userId = params.userId;
    const files = await Models.Mrg.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Mrg.get("/mrg/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    const curUser = RoutesCommon.GetUser(req);
    const userId = Number(curUser!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Mrg.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('mrg.ejs', GetUploadJson(file));
});
Mrg.get("/mrg/file-viewer/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const curUser = RoutesCommon.GetUser(req);
        const userId = Number(curUser!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Mrg.findOne({
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
Mrg.get("/admin/mrg/file-viewer/:id", RoutesCommon.IsAdmin, async (req, res) => {
    try {
        const params = RoutesCommon.GetParameters(req);
        const id = Number(params.id);
        const file = await Models.Mrg.findOne({
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
Mrg.delete("/mrg/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const curUser = RoutesCommon.GetUser(req);
        const userId = Number(curUser!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Mrg.destroy({
            where: { UserID: userId, id: id }
        });
        const success = (file !== 0);
        return res.json({ success: success });
    }
    catch (err) { 
        return res.json({ success: false });
    }
});
