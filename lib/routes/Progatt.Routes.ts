
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
export const Progatt = Router();

function GetUploadJson(file: any) {
if (file==null)
	return {
		id:"nullish",
		patdate: "",
		patype: "",
		pat: "",
		patcol: "",
		patspon: "",
		patnd: ""
	};
return {
	id:file.id,
	patdate: file.patdate,
	patype: file.patype,
	pat: file.pat,
	patcol: file.patcol,
	patspon: file.patspon,
	patnd: file.patnd
	};
}


Progatt.post("/progatt", RoutesCommon.IsAuthenticated,
 RoutesCommon.upload.array('patcerti'), async (req, res) => {
    try {
        const files = req.files as any[];
        if (files == null || files.length === 0)
            return res.status(422).send("Upload Failed");
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(req.user!.id);
        const id = String(params.id);const patdate = String(params.patdate);
	const patype = String(params.patype);
	const pat = String(params.pat);
	const patcol = String(params.patcol);
	const patspon = String(params.patspon);
	const patnd = String(params.patnd);
	
        // Iterate over all the files
        files.forEach(async (file) => {
            if (id === "nullish")
                await Models.Progatt.create({
                    UserID: userId,
                    Location: file.path,
                    patdate:patdate,
                    patype:patype,
                    pat:pat,
                    patcol:patcol,
                    patspon:patspon,
                    patnd:patnd,

            });
            else
                await Models.Progatt.update({
                    patdate:patdate,
                    patype:patype,
                    pat:pat,
                    patcol:patcol,
                    patspon:patspon,
                    patnd:patnd,

                    },
                    { where: { id: id, UserID: userId } }
                );

        });
        return res.status(200).redirect('/progatt');
    }
    catch (error) {
        console.error(error);
        return res.status(422).send("Upload Failed");
    }
});
Progatt.get("/progatt", RoutesCommon.IsAuthenticated, (req, res) => {
    return res.render('progatt.ejs', GetUploadJson(null));
});
Progatt.get("/progatt/files", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const files = await Models.Progatt.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Progatt.get("/progatt/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Progatt.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('progatt.ejs', GetUploadJson(file));
});
Progatt.get("/progatt/file-viewer/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Progatt.findOne({
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
