import { RoutesCommon } from "./Common.Routes";
import { Router, Request } from "express";
import * as Model from "../Models/Models";
import { Op } from "sequelize";

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

function DeleteLocation(arr: any) {
    const ret = [];
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        delete element.Location;
        ret.push(element);
    }
    return ret;
}
async function ExtractInformation(req: Request) {
    const params = RoutesCommon.GetParameters(req);
    if (params == null) return null;

    const userId = RoutesCommon.ToArray(params.ruser).map(Number);
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

    if (userId != null && userId.length !== 0) {
        userIds.push(...userId);
        userIds = userIds.filter(function (itm, i) {
            return userIds.lastIndexOf(itm) == i && userIds.indexOf(itm) != i;
        });
    }

    let mrg = null;
    let conference = null;
    let journal = null;
    let semwork = null;
    let fdp = null;
    let sttp = null;
    let progatt = null;

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
        } if (rtype === "mrg" || rtype === "") {
            mrg = await Model.Mrg.findAll({
                where: {
                    UserID: userIds,
                    mrgya: ryear
                }
            });
        }
    }
    return { mrg, conference, journal, semwork, fdp, sttp, progatt };
}
function ExtractPaths(input: any) {
    const value: string[] = [];
    input.forEach((element: any) => {
        value.push(...element.FileLocationsAsArray());
    });
    return value;
}
Admin.post("/report/files", RoutesCommon.IsAdmin, async (req, res) => {
    const x = await ExtractInformation(req);
    if (x == null)
        return res.status(404);
    const { mrg, conference, journal, semwork, fdp, sttp, progatt } = x;
    const locations: string[] = [];

    locations.push(...ExtractPaths(mrg));
    locations.push(...ExtractPaths(conference));
    locations.push(...ExtractPaths(journal));
    locations.push(...ExtractPaths(semwork));
    locations.push(...ExtractPaths(fdp));
    locations.push(...ExtractPaths(sttp));
    locations.push(...ExtractPaths(progatt));

    await RoutesCommon.ZipFileGenerator(res, locations);
});
Admin.post("/report", RoutesCommon.IsAdmin, async (req, res) => {
    const x = await ExtractInformation(req);

    if (x == null)
        return res.status(404);

    const { mrg, conference, journal, semwork, fdp, sttp, progatt } = x;

    // Remove Location Parameter as it is local to our computer
    if (journal != null)
        journal.forEach(value => delete value.dataValues.Location);
    if (fdp != null)
        fdp.forEach(value => delete value.dataValues.Location);
    if (sttp != null)
        sttp.forEach(value => {
            return delete value.dataValues.Location;
        });
    if (progatt != null)
        progatt.forEach(value => delete value.dataValues.Location);
    if (conference != null)
        conference.forEach(value => delete value.dataValues.Location);
    if (semwork != null)
        semwork.forEach((value: { Location: any; }) => { delete value.Location; });
    if (mrg != null)
        mrg.forEach(value => delete value.dataValues.Location);

    const json = {
        "mrg": mrg,
        "conference": conference,
        "journal": journal,
        "semwork": semwork,
        "fdp": fdp,
        "sttp": sttp,
        "progatt": progatt
    };

    return res.json(json);
});
