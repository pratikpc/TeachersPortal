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
Updation.get("/updated", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const details = await GetUserDetails(userId);
    return res.render("update.ejs", details);
});
Updation.get("/index", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const details = await GetUserDetails(userId);
    console.log(details);
    return res.render("index.ejs", details);
});

Updation.get("/display", RoutesCommon.IsAuthenticated, async (req, res) => {
    try {
        const userId = Number(req.user!.id);

        const file = await Models.Users.findOne({
            where: { id: userId }
        });
        if (!file) return res.sendStatus(404);

        const path = file.ImagePath;
        return res.download(path);
    } catch (err) { }
    return res.sendStatus(404);
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
            dept: dept, aos: aos,
            gender: gender, bdate: bdate, address: address, phone: phone, email: email,
            ugpyear: upgyear, uggrade: uggrade, ugu: ugu, ugi: ugi, ugr: ugr,
            pgyear: pgyear, pggrade: pggrade, pgu: pgu, pgi: pgi, pgr: pgr,
            spyear: spyear, spgrade: spgrade, spu: spu, spi: spi, spr: spr,
            tduration: tduration, tinstitute: tinstitute, tpost: tpost,
            iduration: iduration, iinstitute: iinstitute, ipost: ipost,
            oduration: oduration, oinstitute: oinstitute, opost: opost
        },
        { where: { id: userId } }
    );

    return res.redirect("/");
});

function EmptyUndef(key: any) {
    if (key == null || key === "undefined")
        return "";
    return key;
}

async function GetUserDetails(userId: any) {
    const user = await Models.Users.findOne({
        where: { id: userId }
    }
    );

    if (user == null)
        return {};

    return {
        data: {
            title: EmptyUndef(user.title),
            firstname: EmptyUndef(user.firstname), middlename: EmptyUndef(user.middlename), lastname: EmptyUndef(user.lastname),
            fname: EmptyUndef(user.fname), mname: EmptyUndef(user.mname),
            gender: EmptyUndef(user.gender), bdate: EmptyUndef(user.bdate), address: EmptyUndef(user.address), phone: EmptyUndef(user.phone), email: EmptyUndef(user.email),
            dept: EmptyUndef(user.dept), aos: EmptyUndef(user.aos),
            upgyear: EmptyUndef(user.ugpyear), uggrade: EmptyUndef(user.uggrade), ugu: EmptyUndef(user.ugu), ugi: EmptyUndef(user.ugi), ugr: EmptyUndef(user.ugr),
            pgyear: EmptyUndef(user.pgyear), pggrade: EmptyUndef(user.pggrade), pgu: EmptyUndef(user.pgu), pgi: EmptyUndef(user.pgi), pgr: EmptyUndef(user.pgr),
            spyear: EmptyUndef(user.spyear), spgrade: EmptyUndef(user.spgrade), spu: EmptyUndef(user.spu), spi: EmptyUndef(user.spi), spr: EmptyUndef(user.spr),
            tduration: EmptyUndef(user.tduration), tinstitute: EmptyUndef(user.tinstitute), tpost: EmptyUndef(user.tpost),
            iduration: EmptyUndef(user.iduration), iinstitute: EmptyUndef(user.iinstitute), ipost: EmptyUndef(user.ipost),
            oduration: EmptyUndef(user.oduration), oinstitute: EmptyUndef(user.oinstitute), opost: EmptyUndef(user.opost)
        }
    };
}


