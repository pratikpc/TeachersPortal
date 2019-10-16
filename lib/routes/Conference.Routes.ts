
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
import * as Archiver from "archiver";
import * as Path from "path";
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
			crpt: "",
			cdui: ""
		};
	return {
			id:file.id,
			ci: file.ci,
			cma: file.cma,
			cissn: file.cissn,
			cdate: file.cdate,
			ct: file.ct,
			crpt: file.crpt,
			cdui: file.cdui
		};
}


Conference.post("/conference", RoutesCommon.IsNotAdmin,
RoutesCommon.upload.array('ccerti'), async (req, res) => {
    try {
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(req.user!.id);
        const id = String(params.id);
        const files = req.files as any[];
        // ID Nullish is Used for First time Upload
        if (id === "nullish" && (files == null || files.length === 0))
            return res.status(422).send("Upload Failed");
        const ci = String(params.ci);
    const cma = String(params.cma);
    const cissn = String(params.cissn);
    const cdate = String(params.cdate);
    const ct = String(params.ct);
    const crpt = String(params.crpt);
    const cdui = String(params.cdui);
    
        let pathToFiles = null;
        // ID Nullish is Used for First time Upload
        if (files != null && files.length !== 0)
            pathToFiles = RoutesCommon.FilesToPathString(files);
        if (id === "nullish" && pathToFiles != null){
            await Models.Conference.create({
                UserID: userId,
                Location: pathToFiles,
                    ci:ci,
                        cma:cma,
                        cissn:cissn,
                        cdate:cdate,
                        ct:ct,
                        crpt:crpt,
                        cdui:cdui,
    
            });
        }
        else{
            await Models.Conference.update({
                ci:ci,
                    cma:cma,
                    cissn:cissn,
                    cdate:cdate,
                    ct:ct,
                    crpt:crpt,
                    cdui:cdui,
    
                },
                { where: { id: id, UserID: userId } }
            );
            if (pathToFiles != null)
                    await Models.Conference.update({
                        Location: pathToFiles
                    },
                    { where: { id: id, UserID: userId } }
                    );
            }
    return res.status(200).redirect('/conference');
}
catch (error) {
    console.error(error);
    return res.status(422).send("Upload Failed");
}
});
Conference.get("/conference", RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render('conference.ejs', GetUploadJson(null));
});
Conference.get("/conference/files", RoutesCommon.IsNotAdmin, async (req, res) => {
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
Conference.get("/conference/files/:userId", RoutesCommon.IsAdmin, async (req, res) => {
    const params = RoutesCommon.GetParameters(req);
    if (params == null)
        return res.json([]);
    const userId = params.userId;
    const files = await Models.Conference.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Conference.get("/conference/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Conference.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('conference.ejs', GetUploadJson(file));
});
Conference.get("/conference/file-viewer/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Conference.findOne({
            where: { UserID: userId, id: id }
        });
        if (!file)
            return res.sendStatus(404);
        const filesToDownload : string[] = file.FileLocationsAsArray();

        if (filesToDownload.length === 0)
            return res.sendStatus(404);

        res.setHeader('Content-Disposition', 'attachment');

        if (filesToDownload.length === 1)
            return res.sendFile(filesToDownload[0]);

        const archive = Archiver.create("zip");

        archive.on('error', function (err) {
            res.status(500).send({ error: err.message });
        });

        //on stream closed we can end the request
        archive.on('end', function () {
        });
        
        //set the archive name
        res.attachment('details.zip');

        //this is the streaming magic
        archive.pipe(res);

        for (const file in filesToDownload) {
            archive.file(file, { name: Path.basename(file) });
        }

        archive.finalize();
    }
    catch (err) { }
    return res.sendStatus(404);
});
Conference.delete("/conference/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Conference.destroy({
            where: { UserID: userId, id: id }
        });
        const success = (file !== 0);
        return res.json({ success: success });
    }
    catch (err) { 
        return res.json({ success: false });
    }
    });
