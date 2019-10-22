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

    const fname = String(params.fname);
    const lname = String(params.lname);
    const dept = String(params.dept);
    const ri = String(params.ri);
    const rtype = String(params.rcat);
    const rspon = String(params.rspon);

    const users = await Model.Users.findAll({
        where: {
            Authority: "NORMAL",
            firstname: {
                $ilike: "%" + fname + "%"
            },
            lastname: {
                $ilike: "%" + lname + "%"
            },
            dept: {
                $ilike: "%" + dept + "%"
            }
        }
    });


    let mrg = null;
    let conference = null;
    let journal = null;
    let semwork = null;
    let fdp = null;
    let sttp = null;
    let progatt = null;

    if (users.length !== 0) {

        const userIds = users.map((val) => { return val.id; });

        console.log(userIds);

        if (rtype === "fdp" || rtype === "") {
            fdp = await Model.Fdp.findAll({
                where: {
                    UserID: userIds,
                    fdptype: {
                        $ilike: "%" + rspon + "%"
                    }
                }
            });
        }
        if (rtype === "sttp" || rtype === "") {
            sttp = await Model.Sttp.findAll({
                where: {
                    UserID: userIds,
                    sttptype: {
                        $ilike: "%" + rspon + "%"
                    }
                }
            });
        }
        if (rtype === "progatt" || rtype === "") {
            progatt = await Model.Progatt.findAll({
                where: {
                    UserID: userIds,
                    patspon: {
                        $ilike: "%" + rspon + "%"
                    }
                }
            });
        }
        if (rtype === "conference" || rtype === "") {
            conference = await Model.Conference.findAll({
                where: {
                    UserID: userIds,
                    ci: {
                        $ilike: "%" + ri + "%"
                    }
                }
            });
        }
        if (rtype === "journal" || rtype === "") {
            journal = await Model.Journal.findAll({
                where: {
                    UserID: userIds,
                    ji: {
                        $ilike: "%" + ri + "%"
                    }
                }
            });
        }
        if (rtype === "semwork" || rtype === "") {
            semwork = await Model.Semwork.findAll({
                where: {
                    UserID: userIds,
                }
            });
        } if (rtype === "mrg" || rtype === "") {
            mrg = await Model.Semwork.findAll({
                where: {
                    UserID: userIds,
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

    console.log(locations);

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
