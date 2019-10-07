
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
export const Journal = Router();

function GetUploadJson(file: any) {
if (file==null)
	return {
		id:"nullish",
		ji: "",
		jt: "",
		jrpt: "",
		jma: "",
		jissn: "",
		jdate: ""
	};
return {
	id:file.id,
	ji: file.ji,
	jt: file.jt,
	jrpt: file.jrpt,
	jma: file.jma,
	jissn: file.jissn,
	jdate: file.jdate
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
        const id = String(params.id);const ji = String(params.ji);
	const jt = String(params.jt);
	const jrpt = String(params.jrpt);
	const jma = String(params.jma);
	const jissn = String(params.jissn);
	const jdate = String(params.jdate);
	
        // Iterate over all the files
        files.forEach(async (file) => {
            if (id === "nullish")
                await Models.Journal.create({
                    UserID: userId,
                    Location: file.path,
                    ji:ji,
                    jt:jt,
                    jrpt:jrpt,
                    jma:jma,
                    jissn:jissn,
                    jdate:jdate,

            });
            else
                await Models.Journal.update({
                    ji:ji,
                    jt:jt,
                    jrpt:jrpt,
                    jma:jma,
                    jissn:jissn,
                    jdate:jdate,

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
