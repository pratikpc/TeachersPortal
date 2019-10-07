
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
export const Mrg = Router();

function GetUploadJson(file: any) {
if (file==null)
	return {
		id:"nullish",
		mrgt: "",
		mrgga: "",
		mrgya: ""
	};
return {
	id:file.id,
	mrgt: file.mrgt,
	mrgga: file.mrgga,
	mrgya: file.mrgya
	};
}


Mrg.post("/mrg", RoutesCommon.IsAuthenticated,
 RoutesCommon.upload.array('mrgcerti'), async (req, res) => {
    try {
        const files = req.files as any[];
        if (files == null || files.length === 0)
            return res.status(422).send("Upload Failed");
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(req.user!.id);
        const id = String(params.id);const mrgt = String(params.mrgt);
	const mrgga = String(params.mrgga);
	const mrgya = String(params.mrgya);
	
        // Iterate over all the files
        files.forEach(async (file) => {
            if (id === "nullish")
                await Models.Mrg.create({
                    UserID: userId,
                    Location: file.path,
                    mrgt:mrgt,
                    mrgga:mrgga,
                    mrgya:mrgya,

            });
            else
                await Models.Mrg.update({
                    mrgt:mrgt,
                    mrgga:mrgga,
                    mrgya:mrgya,

                    },
                    { where: { id: id, UserID: userId } }
                );

        });
        return res.status(200).redirect('/mrg');
    }
    catch (error) {
        console.error(error);
        return res.status(422).send("Upload Failed");
    }
});
Mrg.get("/mrg", RoutesCommon.IsAuthenticated, (req, res) => {
    return res.render('mrg.ejs', GetUploadJson(null));
});
Mrg.get("/mrg/files", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const files = await Models.Mrg.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Mrg.get("/mrg/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Mrg.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('mrg.ejs', GetUploadJson(file));
});
Mrg.get("/mrg/file-viewer/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Mrg.findOne({
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
