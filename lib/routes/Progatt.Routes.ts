
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
import * as Archiver from "archiver";
import * as Path from "path";
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


Progatt.post("/progatt", RoutesCommon.IsNotAdmin,
RoutesCommon.upload.array('patcerti'), async (req, res) => {
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
        const patdate = String(params.patdate);
    const patype = String(params.patype);
    const pat = String(params.pat);
    const patcol = String(params.patcol);
    const patspon = String(params.patspon);
    const patnd = String(params.patnd);
    
        let pathToFiles = null;
        // ID Nullish is Used for First time Upload
        if (files != null && files.length !== 0)
            pathToFiles = RoutesCommon.FilesToPathString(files);
        if (id === "nullish" && pathToFiles != null){
            await Models.Progatt.create({
                UserID: userId,
                Location: pathToFiles,
                    patdate:patdate,
                        patype:patype,
                        pat:pat,
                        patcol:patcol,
                        patspon:patspon,
                        patnd:patnd,
    
            });
        }
        else{
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
            if (pathToFiles != null)
                    await Models.Conference.update({
                        Location: pathToFiles
                    },
                    { where: { id: id, UserID: userId } }
                    );
            }
    return res.status(200).redirect('/progatt');
}
catch (error) {
    console.error(error);
    return res.status(422).send("Upload Failed");
}
});
Progatt.get("/progatt", RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render('progatt.ejs', GetUploadJson(null));
});
Progatt.get("/progatt/files", RoutesCommon.IsNotAdmin, async (req, res) => {
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
Progatt.get("/progatt/files/:userId", RoutesCommon.IsAdmin, async (req, res) => {
    const params = RoutesCommon.GetParameters(req);
    if (params == null)
        return res.json([]);
    const userId = params.userId;
    const files = await Models.Progatt.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Progatt.get("/progatt/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Progatt.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('progatt.ejs', GetUploadJson(file));
});
Progatt.get("/progatt/file-viewer/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Progatt.findOne({
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
Progatt.delete("/progatt/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
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
