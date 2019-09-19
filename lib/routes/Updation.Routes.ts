import { Router } from "express";
import { RoutesCommon } from "./Common.Routes";
import * as Model from "../Models/Users.Model";

export const Updation = Router();

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
    await Model.Users.update(
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
    const user = await Model.Users.findOne({
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
