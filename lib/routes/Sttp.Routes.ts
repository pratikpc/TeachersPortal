
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


Sttp.post("/sttp", RoutesCommon.IsAuthenticated,
 RoutesCommon.upload.array('sttpcerti'), async (req, res) => {
    try {
        const files = req.files as any[];
        if (files == null || files.length === 0)
            return res.status(422).send("Upload Failed");
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(req.user!.id);
        const id = String(params.id);const sttpdate = String(params.sttpdate);
	const sttpt = String(params.sttpt);
	const sttpcol = String(params.sttpcol);
	const sttpnw = String(params.sttpnw);
	const sttptype = String(params.sttptype);
	
        // Iterate over all the files
        files.forEach(async (file) => {
            if (id === "nullish")
                await Models.Sttp.create({
                    UserID: userId,
                    Location: file.path,
                    sttpdate:sttpdate,
                    sttpt:sttpt,
                    sttpcol:sttpcol,
                    sttpnw:sttpnw,
                    sttptype:sttptype,

            });
            else
                await Models.Sttp.update({
                    sttpdate:sttpdate,
                    sttpt:sttpt,
                    sttpcol:sttpcol,
                    sttpnw:sttpnw,
                    sttptype:sttptype,

                    },
                    { where: { id: id, UserID: userId } }
                );

        });
        return res.status(200).redirect('/sttp');
    }
    catch (error) {
        console.error(error);
        return res.status(422).send("Upload Failed");
    }
});
Sttp.get("/sttp", RoutesCommon.IsAuthenticated, (req, res) => {
    return res.render('sttp.ejs', GetUploadJson(null));
});
Sttp.get("/sttp/files", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const files = await Models.Sttp.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Sttp.get("/sttp/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Sttp.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('sttp.ejs', GetUploadJson(file));
});
Sttp.get("/sttp/file-viewer/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Sttp.findOne({
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
