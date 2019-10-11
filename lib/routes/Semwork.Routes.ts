
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


Semwork.post("/semwork", RoutesCommon.IsAuthenticated,
 RoutesCommon.upload.array('swcerti'), async (req, res) => {
    try {
        const files = req.files as any[];
        if (files == null || files.length === 0)
            return res.status(422).send("Upload Failed");
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(req.user!.id);
        const id = String(params.id);const swdate = String(params.swdate);
	const swt = String(params.swt);
	const swcol = String(params.swcol);
	const swnd = String(params.swnd);
	const swtype = String(params.swtype);
	
        // Iterate over all the files
        files.forEach(async (file) => {
            if (id === "nullish")
                await Models.Semwork.create({
                    UserID: userId,
                    Location: file.path,
                    swdate:swdate,
                    swt:swt,
                    swcol:swcol,
                    swnd:swnd,
                    swtype:swtype,

            });
            else
                await Models.Semwork.update({
                    swdate:swdate,
                    swt:swt,
                    swcol:swcol,
                    swnd:swnd,
                    swtype:swtype,

                    },
                    { where: { id: id, UserID: userId } }
                );

        });
        return res.status(200).redirect('/semwork');
    }
    catch (error) {
        console.error(error);
        return res.status(422).send("Upload Failed");
    }
});
Semwork.get("/semwork", RoutesCommon.IsAuthenticated, (req, res) => {
    return res.render('semwork.ejs', GetUploadJson(null));
});
Semwork.get("/semwork/files", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const files = await Models.Semwork.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Semwork.get("/semwork/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Semwork.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('semwork.ejs', GetUploadJson(file));
});
Semwork.get("/semwork/file-viewer/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Semwork.findOne({
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
