
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
export const Conference = Router();

function GetUploadJson(file: any) {
if (file==null)
	return {
		id:"nullish",
		ci: "",
		cma: "",
		cissn: "",
		cdate: "",
		ct: "",
		crpt: ""
	};
return {
	id:file.id,
	ci: file.ci,
	cma: file.cma,
	cissn: file.cissn,
	cdate: file.cdate,
	ct: file.ct,
	crpt: file.crpt
	};
}


Conference.post("/conference", RoutesCommon.IsAuthenticated,
 RoutesCommon.upload.array('ccerti'), async (req, res) => {
    try {
        const files = req.files as any[];
        if (files == null || files.length === 0)
            return res.status(422).send("Upload Failed");
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(req.user!.id);
        const id = String(params.id);const ci = String(params.ci);
	const cma = String(params.cma);
	const cissn = String(params.cissn);
	const cdate = String(params.cdate);
	const ct = String(params.ct);
	const crpt = String(params.crpt);
	
        // Iterate over all the files
        files.forEach(async (file) => {
            if (id === "nullish")
                await Models.Files.create({
                    UserID: userId,
                    Location: file.path,
                    ci:ci,
                    cma:cma,
                    cissn:cissn,
                    cdate:cdate,
                    ct:ct,
                    crpt:crpt,

            });
            else
                await Models.Users.update({
                    ci:ci,
                    cma:cma,
                    cissn:cissn,
                    cdate:cdate,
                    ct:ct,
                    crpt:crpt,

                    },
                    { where: { id: id, UserID: userId } }
                );

        });
        return res.status(200).redirect("/conference");
    }
    catch (error) {
        console.error(error);
        return res.status(422).send("Upload Failed");
    }
});
Conference.get("/conference", RoutesCommon.IsAuthenticated, (req, res) => {
    return res.render('conference.ejs', GetUploadJson(null));
});
Conference.get("/conference/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Conference.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('conference.ejs', GetUploadJson(file));
});
Conference.get("/conference/files", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const files = await Models.Conference.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Conference.get("/conference/file-viewer/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Conference.findOne({
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
