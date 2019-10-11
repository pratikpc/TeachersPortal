
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
export const Journal = Router();

function GetUploadJson(file: any) {
if (file==null)
	return {
		id:"nullish",
		jdate: "",
		jt: "",
		jrpt: "",
		jissn: "",
		ji: "",
		jma: "",
		jdui: ""
	};
return {
	id:file.id,
	jdate: file.jdate,
	jt: file.jt,
	jrpt: file.jrpt,
	jissn: file.jissn,
	ji: file.ji,
	jma: file.jma,
	jdui: file.jdui
	};
}


Journal.post("/journal", RoutesCommon.IsAuthenticated,
 RoutesCommon.upload.array('jcerti'), async (req, res) => {
    try {
        const files = req.files as any[];
        if (files == null || files.length === 0)
            return res.status(422).send("Upload Failed");
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(req.user!.id);
        const id = String(params.id);const jdate = String(params.jdate);
	const jt = String(params.jt);
	const jrpt = String(params.jrpt);
	const jissn = String(params.jissn);
	const ji = String(params.ji);
	const jma = String(params.jma);
	const jdui = String(params.jdui);
	
        // Iterate over all the files
        files.forEach(async (file) => {
            if (id === "nullish")
                await Models.Journal.create({
                    UserID: userId,
                    Location: file.path,
                    jdate:jdate,
                    jt:jt,
                    jrpt:jrpt,
                    jissn:jissn,
                    ji:ji,
                    jma:jma,
                    jdui:jdui,

            });
            else
                await Models.Journal.update({
                    jdate:jdate,
                    jt:jt,
                    jrpt:jrpt,
                    jissn:jissn,
                    ji:ji,
                    jma:jma,
                    jdui:jdui,

                    },
                    { where: { id: id, UserID: userId } }
                );

        });
        return res.status(200).redirect('/journal');
    }
    catch (error) {
        console.error(error);
        return res.status(422).send("Upload Failed");
    }
});
Journal.get("/journal", RoutesCommon.IsAuthenticated, (req, res) => {
    return res.render('journal.ejs', GetUploadJson(null));
});
Journal.get("/journal/files", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const files = await Models.Journal.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Journal.get("/journal/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Journal.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('journal.ejs', GetUploadJson(file));
});
Journal.get("/journal/file-viewer/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Journal.findOne({
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
