
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


Fdp.post("/fdp", RoutesCommon.IsAuthenticated,
 RoutesCommon.upload.array('fdpcerti'), async (req, res) => {
    try {
        const files = req.files as any[];
        if (files == null || files.length === 0)
            return res.status(422).send("Upload Failed");
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(req.user!.id);
        const id = String(params.id);const fdpdate = String(params.fdpdate);
	const fdpt = String(params.fdpt);
	const fdpcol = String(params.fdpcol);
	const fdpnd = String(params.fdpnd);
	const fdptype = String(params.fdptype);
	
        // Iterate over all the files
        files.forEach(async (file) => {
            if (id === "nullish")
                await Models.Fdp.create({
                    UserID: userId,
                    Location: file.path,
                    fdpdate:fdpdate,
                    fdpt:fdpt,
                    fdpcol:fdpcol,
                    fdpnd:fdpnd,
                    fdptype:fdptype,

            });
            else
                await Models.Fdp.update({
                    fdpdate:fdpdate,
                    fdpt:fdpt,
                    fdpcol:fdpcol,
                    fdpnd:fdpnd,
                    fdptype:fdptype,

                    },
                    { where: { id: id, UserID: userId } }
                );

        });
        return res.status(200).redirect('/fdp');
    }
    catch (error) {
        console.error(error);
        return res.status(422).send("Upload Failed");
    }
});
Fdp.get("/fdp", RoutesCommon.IsAuthenticated, (req, res) => {
    return res.render('fdp.ejs', GetUploadJson(null));
});
Fdp.get("/fdp/files", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const files = await Models.Fdp.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Fdp.get("/fdp/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Fdp.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('fdp.ejs', GetUploadJson(file));
});
Fdp.get("/fdp/file-viewer/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Fdp.findOne({
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
