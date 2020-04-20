import { Router } from "express";
import { RoutesCommon } from "./Common.Routes";
import * as Models from "../Models/Models";

export const Updation = Router();
Updation.get("/newpassword", RoutesCommon.IsAuthenticated, (req, res) => {
    return res.render("changepassword.html");
});
Updation.get("/upload", RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render("documents.ejs");
});

function EmptyUndef(key: any) {
    if (key == null || key === "undefined")
        return "";
    return key;
}

export function GetUserJson(user: Models.Users) {
    return {
        data: {
            id: user.id,
            Name: user.Name,
            title: EmptyUndef(user.title),
            firstname: EmptyUndef(user.firstname), middlename: EmptyUndef(user.middlename), lastname: EmptyUndef(user.lastname),
            fname: EmptyUndef(user.fname), mname: EmptyUndef(user.mname),
            gender: EmptyUndef(user.gender), bdate: EmptyUndef(user.bdate), address: EmptyUndef(user.address), phone: EmptyUndef(user.phone), email: EmptyUndef(user.email),
            dept: EmptyUndef(user.dept), aos: EmptyUndef(user.aos),
            upgyear: EmptyUndef(user.ugpyear), uggrade: EmptyUndef(user.uggrade), ugu: EmptyUndef(user.ugu), ugi: EmptyUndef(user.ugi), ugr: EmptyUndef(user.ugr),
            pgyear: EmptyUndef(user.pgyear), pggrade: EmptyUndef(user.pggrade), pgu: EmptyUndef(user.pgu), pgi: EmptyUndef(user.pgi), pgr: EmptyUndef(user.pgr),
            spyear: EmptyUndef(user.spyear), spgrade: EmptyUndef(user.spgrade), spu: EmptyUndef(user.spu), spi: EmptyUndef(user.spi), spr: EmptyUndef(user.spr),
            tduration: RoutesCommon.ToArrayFromJsonString<string>(EmptyUndef(user.tduration)), tinstitute: RoutesCommon.ToArrayFromJsonString<string>(EmptyUndef(user.tinstitute)), tpost: RoutesCommon.ToArrayFromJsonString<string>(EmptyUndef(user.tpost)),
            iduration: RoutesCommon.ToArrayFromJsonString<string>(EmptyUndef(user.iduration)), iinstitute: RoutesCommon.ToArrayFromJsonString<string>(EmptyUndef(user.iinstitute)), ipost: RoutesCommon.ToArrayFromJsonString<string>(EmptyUndef(user.ipost)),
            oduration: RoutesCommon.ToArrayFromJsonString<string>(EmptyUndef(user.oduration)), oinstitute: RoutesCommon.ToArrayFromJsonString<string>(EmptyUndef(user.oinstitute)), opost: RoutesCommon.ToArrayFromJsonString<string>(EmptyUndef(user.opost))
        }
    };
}

export async function GetUserDetails(userId: any) {
    const user = await Models.Users.findOne({
        where: { id: userId }
    }
    );

    if (user == null)
        return {};

    return GetUserJson(user);
}

Updation.get("/updated", RoutesCommon.IsAuthenticated, async (req, res) => {
    const curUser = RoutesCommon.GetUser(req);
    const userId = Number(curUser.id);
    const details = await GetUserDetails(userId);
    return res.render("update.ejs", details);
});
Updation.get("/index", RoutesCommon.IsNotAdmin, async (req, res) => {
    const curUser = RoutesCommon.GetUser(req);
    const userId = Number(curUser.id);
    const details = await GetUserDetails(userId);
    return res.render("index.ejs", details);
});
Updation.get("/details", RoutesCommon.IsAuthenticated, async (req, res) => {
    const curUser = RoutesCommon.GetUser(req);
    const userId = Number(curUser.id);
    const details = await GetUserDetails(userId);
    return res.json(details);
});

Updation.get("/details/:id", RoutesCommon.IsAdmin, async (req, res) => {
    const params = RoutesCommon.GetParameters(req);
    if (params == null) return res.status(404);

    const userId = Number(params.id);
    const details = await GetUserDetails(userId);
    return res.json(details);
});

Updation.get("/profileupdate", RoutesCommon.IsAuthenticated, async (req, res) => {
    try {
        const curUser = RoutesCommon.GetUser(req);
        const userId = Number(curUser.id);

        const file = await Models.Users.findOne({
            where: { id: userId }
        });
        if (!file)
            return res.redirect("/images/doraemon.png");
        const image = file.ImagePath;
        if (image === "")
            return res.redirect("/images/doraemon.png");
        return res.download(image);
    } catch (err) { console.log(err); }
    return res.redirect("/images/doraemon.png");
});

Updation.post("/updated", RoutesCommon.IsAuthenticated,
    RoutesCommon.upload.single('profile'),
    async (req, res) => {
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

        const dept = String(params.dept);
        const aos = String(params.aos);

        const upgyear = String(params.upgyear);
        const uggrade = String(params.uggrade);
        const ugu = String(params.ugu);
        const ugi = String(params.ugi);
        const ugr = String(params.ugr);

        const pgyear = String(params.pgyear);
        const pggrade = String(params.pggrade);
        const pgu = String(params.pgu);
        const pgi = String(params.pgi);
        const pgr = String(params.pgr);

        const spyear = String(params.spyear);
        const spgrade = String(params.spgrade);
        const spu = String(params.spu);
        const spi = String(params.spi);
        const spr = String(params.spr);

        const tduration = RoutesCommon.ToArray(params.tduration);
        const tinstitute = RoutesCommon.ToArray(params.tinstitute);
        const tpost = RoutesCommon.ToArray(params.tpost);

        const iduration = RoutesCommon.ToArray(params.iduration);
        const iinstitute = RoutesCommon.ToArray(params.iinstitute);
        const ipost = RoutesCommon.ToArray(params.ipost);

        const oduration = RoutesCommon.ToArray(params.oduration);
        const oinstitute = RoutesCommon.ToArray(params.oinstitute);
        const opost = RoutesCommon.ToArray(params.opost);

        const curUser = RoutesCommon.GetUser(req);
        const userId = Number(curUser.id);

        await Models.Users.update(
            {
                title: title,
                firstname: firstname, middlename: middlename, lastname: lastname,
                fname: fname, mname: mname,
                dept: dept, aos: aos,
                gender: gender, bdate: bdate, address: address, phone: phone, email: email,
                ugpyear: upgyear, uggrade: uggrade, ugu: ugu, ugi: ugi, ugr: ugr,
                pgyear: pgyear, pggrade: pggrade, pgu: pgu, pgi: pgi, pgr: pgr,
                spyear: spyear, spgrade: spgrade, spu: spu, spi: spi, spr: spr,
                tduration: JSON.stringify(tduration), tinstitute: JSON.stringify(tinstitute), tpost: JSON.stringify(tpost),
                iduration: JSON.stringify(iduration), iinstitute: JSON.stringify(iinstitute), ipost: JSON.stringify(ipost),
                oduration: JSON.stringify(oduration), oinstitute: JSON.stringify(oinstitute), opost: JSON.stringify(opost)
            },
            { where: { id: userId } }
        );
        if (req.file != null) {
            const imagePath = req.file.path;
            await Models.Users.update(
                {
                    ImagePath: imagePath
                },
                { where: { id: userId } }
            );
        }

        return res.redirect("/");
    });

Updation.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        const curUser = RoutesCommon.GetUser(req);
        if (curUser.Authority === "ADMIN")
            return res.redirect("/admin");
        if (curUser.Authority === "NORMAL")
            return res.redirect("/index");
    }
    return res.render("login.html");
});
