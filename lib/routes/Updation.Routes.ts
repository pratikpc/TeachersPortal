import { Router } from "express";
import { RoutesCommon } from "./Common.Routes";
import * as Models from "../Models/Models";

export const Updation = Router();
Updation.get("/newpassword", RoutesCommon.IsAuthenticated, (req, res) => {
    return res.render("changepassword.html");
});
Updation.post("/newpassword", RoutesCommon.IsAuthenticated, async (req, res) => {
    try {
        const id = Number(req.user!.id);

        const params = RoutesCommon.GetParameters(req);
        const old_pass = String(params.OldPassword);
        const new_pass = String(params.NewPassword);

        const user = await Models.Users.findOne({ where: { id: id } });

        // Check if User Exists
        if (!user) return res.json({ success: false });
        // Check if Password Entered is Correct
        const match = await user!.ComparePassword(old_pass);
        if (!match) return res.json({ success: false });

        const [count] = await Models.Users.update(
            { Password: new_pass },
            { where: { id: id } }
        );

        if (count !== 1) return res.json({ success: false });
        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false });
    }
});
Updation.get("/updated", RoutesCommon.IsAuthenticated, (req, res) => {
    return res.render("update.html");
});

Updation.post("/updated", RoutesCommon.IsAuthenticated, async (req, res) => {
    const params = RoutesCommon.GetParameters(req);
    if (params == null) return res.status(422).send("Upload Failed");

    const title = String(params.title);

    const firstname = String(params.firstname);
    const middlename = String(params.middlename);
    const lastname = String(params.lastname);

    const fname = String(params.fname);
    const mname = String(params.mname);

    const gender = String(params.gender);
    const bdate = String(params.bdate);

    const address = String(params.address);
    const phone = String(params.phone);
    const email = String(params.email);

    const ugpyear = String(params.ugpyear);
    const uggrade = String(params.uggrade);
    const ugu = String(params.ugu);
    const ugi = String(params.ugi);

    const pgyear = String(params.pgyear);
    const pggrade = String(params.pggrade);
    const pgu = String(params.pgu);
    const pgi = String(params.pgi);

    const spyear = String(params.spyear);
    const spgrade = String(params.spgrade);
    const spu = String(params.spu);
    const spi = String(params.spi);
    const spr = String(params.spr);


    const tduration = String(params.tduration);
    const tinstitute = String(params.tinstitute);
    const tpost = String(params.tpost);

    const iduration = String(params.iduration);
    const iinstitute = String(params.iinstitute);
    const ipost = String(params.ipost);

    const oduration = String(params.oduration);
    const oinstitute = String(params.oinstitute);
    const opost = String(params.opost);

    const userId = Number(req.user!.id);
    await Models.Users.update(
        {
            title: title,
            firstname: firstname, middlename: middlename, lastname: lastname,
            fname: fname, mname: mname,
            gender: gender, bdate: bdate, address: address, phone: phone, email: email,
            upgyear: ugpyear, uggrade: uggrade, ugu: ugu, ugi: ugi,
            pgyear: pgyear, pggrade: pggrade, pgu: pgu, pgi: pgi,
            spyear: spyear, spgrade: spgrade, spu: spu, spi: spi, spr: spr,
            tduration: tduration, tinstitute: tinstitute, tpost: tpost,
            iduration: iduration, iinstitute: iinstitute, ipost: ipost,
            oduration: oduration, oinstitute: oinstitute, opost: opost
        },
        { where: { id: userId } }
    );

    return res.redirect("/");
});

Updation.get("/details", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const user = await Models.Users.findOne({
        where: { id: userId }
    }
    );

    if (user == null)
        return res.json({});

    return res.json({
        title: user.title,
        firstname: user.firstname, middlename: user.middlename, lastname: user.lastname,
        fname: user.fname, mname: user.mname,
        gender: user.gender, bdate: user.bdate, address: user.address, phone: user.phone, email: user.email,
        upgyear: user.ugpyear, uggrade: user.uggrade, ugu: user.ugu, ugi: user.ugi,
        pgyear: user.pgyear, pggrade: user.pggrade, pgu: user.pgu, pgi: user.pgi,
        spyear: user.spyear, spgrade: user.spgrade, spu: user.spu, spi: user.spi, spr: user.spr,
        tduration: user.tduration, tinstitute: user.tinstitute, tpost: user.tpost,
        iduration: user.iduration, iinstitute: user.iinstitute, ipost: user.ipost,
        oduration: user.oduration, oinstitute: user.oinstitute, opost: user.opost
    }
    );
});
Updation.get("/upload", RoutesCommon.IsAuthenticated, (req, res) => {
    return res.render("documents.html");
});

Updation.post(
    "/upload",
    RoutesCommon.IsAuthenticated,
    RoutesCommon.upload.array("file"),
    async (req, res) => {
        try {
            const files = req.files as any[];
            if (files == null || files.length === 0) return res.status(422).send("Upload Failed");

            const params = RoutesCommon.GetParameters(req);
            if (params == null) return res.status(422).send("Upload Failed");

            const userId = Number(req.user!.id);
            const year = Number(params.year);
            const sdptitle = String(params.sdptitle);
            const Category = String(params.Category);

            // Iterate over all the files
            files.forEach(async file => {
                await Models.Files.create({
                    UserID: userId,
                    Location: file.path,
                    year: year,
                    sdptitle: sdptitle,
                    Category: Category
                });
            });

            return res.status(200).redirect("/upload");
        } catch (error) {
            console.error(error);
            return res.status(422).send("Upload Failed");
        }
    }
);
Updation.get("/files", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const files = await Models.Files.findAll({
        where: { UserID: userId }
    });
    console.log(files);
    const files_json: any[] = [];
    files.forEach(file => {
        console.log(file);
        files_json.push({ id: file.id, Category: file.Category, sdptitle: file.sdptitle, year: file.year });
    })

    return res.json(files_json);
});

Updation.get("/file-viewer", RoutesCommon.IsAuthenticated, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;

        const file = await Models.Files.findOne({
            where: { UserID: userId, id: id }
        });
        if (!file) return res.sendStatus(404);

        const path = file.Location;
        return res.download(path);
    } catch (err) { }
    return res.sendStatus(404);
});
