import { RoutesCommon } from "./Common.Routes";
import { Router, Request } from "express";
import * as Model from "../Models/Models";
import { Op } from "sequelize";
import { GetUserJson } from "./Updation.Routes";

export const Admin = Router();

Admin.get("/", RoutesCommon.IsAdmin, (req, res) => {
    res.render("admin.ejs");
});
Admin.get("/createuser", RoutesCommon.IsAdmin, (req, res) => {
    res.render("createuser.ejs");
});
Admin.get("/newpassword", RoutesCommon.IsAdmin, (req, res) => {
    return res.render("adminpassword.ejs");
});
Admin.get("/report", RoutesCommon.IsAdmin, (req, res) => {
    return res.render("report.ejs");
});

async function ExtractInformation(req: Request) {

    let mrg: Model.Mrg[] = [];
    let conference: Model.Conference[] = [];
    let journal: Model.Journal[] = [];
    let semwork: Model.Semwork[] = [];
    let fdp: Model.Fdp[] = [];
    let sttp: Model.Sttp[] = [];
    let progatt: Model.Progatt[] = [];
    const user_list: any = {};

    const params = RoutesCommon.GetParameters(req);
    if (params != null) {

        const ruser = RoutesCommon.ToArray(params.ruser).map(Number);
        const dept = String(params.rdept);
        const ri = String(params.ri);
        const rtype = String(params.rcat);
        const rspon = String(params.rspon);
        const ryear = String(params.ryear);

        const users = await Model.Users.findAll({
            where: {
                Authority: "NORMAL",
                dept: {
                    $ilike: "%" + dept + "%"
                }
            }
        });

        let userIds = users.map((val) => { return val.id; }).map(Number);

        if (ruser != null && ruser.length !== 0) {
            userIds.push(...ruser);
            userIds = userIds.filter(function (itm, i) {
                return userIds.lastIndexOf(itm) == i && userIds.indexOf(itm) != i;
            });

        }

        if (users.length !== 0) {
            if (rtype === "fdp" || rtype === "") {
                fdp = await Model.Fdp.findAll({
                    where: {
                        UserID: userIds,
                        fdptype: {
                            $ilike: "%" + rspon + "%"
                        },
                        fdpdate: {
                            $ilike: "%/" + ryear + "%"
                        },
                    }
                });
            }
            if (rtype === "sttp" || rtype === "") {
                sttp = await Model.Sttp.findAll({
                    where: {
                        UserID: userIds,
                        sttptype: {
                            $ilike: "%" + rspon + "%"
                        },
                        sttpdate: {
                            $ilike: "%/" + ryear + "%"
                        },
                    }
                });
            }
            if (rtype === "progatt" || rtype === "") {
                progatt = await Model.Progatt.findAll({
                    where: {
                        UserID: userIds,
                        patspon: {
                            $ilike: "%" + rspon + "%"
                        },
                        patdate: {
                            $ilike: "%/" + ryear + "%"
                        },
                    }
                });
            }
            if (rtype === "conference" || rtype === "") {
                conference = await Model.Conference.findAll({
                    where: {
                        UserID: userIds,
                        ci: {
                            $ilike: "%" + ri + "%"
                        },
                        cdate: {
                            $ilike: "%/" + ryear + "%"
                        },
                    }
                });
            }
            if (rtype === "journal" || rtype === "") {
                journal = await Model.Journal.findAll({
                    where: {
                        UserID: userIds,
                        ji: {
                            $ilike: "%" + ri + "%"
                        },
                        jdate: {
                            $ilike: "%/" + ryear + "%"
                        },
                    }
                });
            }
            if (rtype === "semwork" || rtype === "") {
                semwork = await Model.Semwork.findAll({
                    where: {
                        UserID: userIds,
                        swdate: {
                            $ilike: "%/" + ryear + "%"
                        },
                    }
                });
            }
            if (rtype === "mrg" || rtype === "") {
                mrg = await Model.Mrg.findAll({
                    where: {
                        UserID: userIds,
                        mrgya: ryear
                    }
                });
            }
            const users = await Model.Users.findAll({
                where: { Authority: "NORMAL", id: userIds }
            });
            users.forEach(user => {
                const user_details = GetUserJson(user);
                user_list[user_details.data.id] = user_details;
            });

        }
    }
    return { mrg, conference, journal, semwork, fdp, sttp, progatt, user_list };
}
function ExtractPaths(input: any) {
    const value: string[] = [];
    input.forEach((element: any) => {
        value.push(...element.FileLocationsAsArray());
    });
    return value;
}
Admin.post("/report/files", RoutesCommon.IsAdmin, async (req, res) => {
    const { mrg, conference, journal, semwork, fdp, sttp, progatt, user_list } = await ExtractInformation(req);
    const locations: string[] = [];

    locations.push(...ExtractPaths(mrg));
    locations.push(...ExtractPaths(conference));
    locations.push(...ExtractPaths(journal));
    locations.push(...ExtractPaths(semwork));
    locations.push(...ExtractPaths(fdp));
    locations.push(...ExtractPaths(sttp));
    locations.push(...ExtractPaths(progatt));

    if (locations.length === 0)
        return res.status(404);

    await RoutesCommon.ZipFileGenerator(res, locations);
});
Admin.post("/report", RoutesCommon.IsAdmin, async (req, res) => {
    const { mrg, conference, journal, semwork, fdp, sttp, progatt, user_list } = await ExtractInformation(req);;

    // Remove Location Parameter as it is local to our computer
    journal.forEach(value => delete value.dataValues.Location);
    fdp.forEach(value => delete value.dataValues.Location);
    sttp.forEach(value => delete value.dataValues.Location);
    progatt.forEach(value => delete value.dataValues.Location);
    conference.forEach(value => delete value.dataValues.Location);
    semwork.forEach(value => delete value.dataValues.Location);
    mrg.forEach(value => delete value.dataValues.Location);

    const json = {
        "mrg": mrg,
        "conference": conference,
        "journal": journal,
        "semwork": semwork,
        "fdp": fdp,
        "sttp": sttp,
        "progatt": progatt,
        "users": user_list
    };

    return res.json(json);
});
