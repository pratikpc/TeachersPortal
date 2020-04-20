def GenerateModel(items, route, upload_file):
    clsName = route.title()
    models_str = ""
    models_str += """
// Generated using generator.py
import {
    Table,
    AllowNull,
    Column,
    DataType,
    ForeignKey,
    BeforeCreate,
    Model} from "sequelize-typescript";
import { existsSync } from "fs";
import { Users } from "./Users.Model";

@Table
export class """ + clsName + """ extends Model<""" + clsName + """> {
    @AllowNull(false)
    @Column(DataType.TEXT)
    Location!: string;

    @AllowNull(false)
    @ForeignKey(() => Users)
    @Column
    UserID!: number;
"""

    for item in items:
        models_str += """
    @AllowNull(false)
    @Column(DataType.TEXT)
    """ + item + """!: string;
"""
    models_str += """
    @BeforeCreate
    public static CheckFileExistence(File: """ + clsName + """): void {
        const locations = JSON.parse(File.Location) as string[];
        locations.forEach(location => {
            if (!existsSync(location))
                throw "File Not Exists at " + File.Location;
        });
    }

    public FileLocationsAsArray(): string[]{
        return JSON.parse(this.Location) as string[];
    }
}
"""
    print(models_str)
    fname = "./ts/Models/" + clsName + ".Models.ts"
    with open(fname, "w") as text_file:
        text_file.write(models_str)
def GenerateRoutes(items, route, upload_file):
    clsName = route.title()
    routes_str = ""
    routes_str += """
// Generated using generate.py
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
"""

    routes_str += "export const " + clsName + " = Router();\n\n"

    routes_str += "function GetUploadJson(file: any) {\n"
    routes_str += "\tif (file==null)\n"
    routes_str += "\t\treturn {\n"
    routes_str += "\t\t\tid:\"nullish\",\n"
    for item in items:
        routes_str += "\t\t\t" + item + ": \"\",\n"
    routes_str = routes_str[:-2] + "\n"
    routes_str += "\t\t};\n"

    routes_str += "\treturn {\n"
    routes_str += "\t\t\tid:file.id,\n"
    for item in items:
        routes_str += "\t\t\t" + item + ": file." + item + ",\n"
    routes_str = routes_str[:-2] + "\n"
    routes_str += "\t\t};\n"
    routes_str += "}\n";
    routes_str += """

""" + clsName + """.post("/""" + route+ """", RoutesCommon.IsNotAdmin,
RoutesCommon.upload.array('""" + upload_file + """'), async (req, res) => {
    try {
        const curUser = RoutesCommon.GetUser(req);
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(curUser.id);
        const id = String(params.id);
        const files = req.files as any[];
        // ID Nullish is Used for First time Upload
        if (id === "nullish" && (files == null || files.length === 0))
            return res.status(422).send("Upload Failed");
"""
    for item in items:
        routes_str += \
"""         const """ + item + """ = String(params.""" + item + """);
"""
    routes_str += """
        let pathToFiles = null;
        // ID Nullish is Used for First time Upload
        if (files != null && files.length !== 0)
            pathToFiles = RoutesCommon.FilesToPathString(files);
        if (id === "nullish" && pathToFiles != null){
            await Models.""" + clsName + """.create({
                UserID: userId,
                Location: pathToFiles,"""
    for item in items:
        routes_str += """
                """ + item + """:""" + item + ""","""
    routes_str += """
            });
        }
        else{
            await Models.""" + clsName + """.update({"""
    for item in items:
        routes_str += """
                    """ + item + """:""" + item + ""","""
    routes_str += """
                },
                { where: { id: id, UserID: userId } }
            );
            if (pathToFiles != null)
                    await Models.""" + clsName + """.update({
                        Location: pathToFiles
                    },
                    { where: { id: id, UserID: userId } }
                    );
            }
    return res.status(200).redirect('/');
}
catch (error) {
    console.error(error);
    return res.status(422).send("Upload Failed");
}
});
""" + clsName + """.get("/""" + route+ """", RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render('""" + route + """.ejs', GetUploadJson(null));
});
""" + clsName + """.get("/""" + route+ """/files", RoutesCommon.IsNotAdmin, async (req, res) => {
    const curUser = RoutesCommon.GetUser(req);
    const userId = Number(curUser!.id);
    const files = await Models.""" + clsName + """.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
""" + clsName + """.get("/""" + route+ """/files/:userId", RoutesCommon.IsAdmin, async (req, res) => {
    const params = RoutesCommon.GetParameters(req);
    if (params == null)
        return res.json([]);
    const userId = params.userId;
    const files = await Models.""" + clsName + """.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
""" + clsName + """.get("/""" + route+ """/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    const curUser = RoutesCommon.GetUser(req);
    const userId = Number(curUser!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.""" + clsName + """.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('""" + route + """.ejs', GetUploadJson(file));
});
""" + clsName + """.get("/""" + route+ """/file-viewer/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const curUser = RoutesCommon.GetUser(req);
        const userId = Number(curUser!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.""" + clsName + """.findOne({
            where: { UserID: userId, id: id }
        });
        if (!file)
            return res.sendStatus(404);
        const filesToDownload: string[] = file.FileLocationsAsArray();

        if (filesToDownload.length === 0)
            return res.sendStatus(404);

        if (filesToDownload.length === 1)
            return res.download(filesToDownload[0]);

        await RoutesCommon.ZipFileGenerator(res, filesToDownload);
    }
    catch (err) { console.log(err); }
    return res.status(404);
});
""" + clsName + """.get("/admin/""" + route+ """/file-viewer/:id", RoutesCommon.IsAdmin, async (req, res) => {
    try {
        const params = RoutesCommon.GetParameters(req);
        const id = Number(params.id);
        const file = await Models.""" + clsName + """.findOne({
            where: { id: id }
        });
        if (!file)
            return res.sendStatus(404);
        const filesToDownload: string[] = file.FileLocationsAsArray();

        if (filesToDownload.length === 0)
            return res.sendStatus(404);

        if (filesToDownload.length === 1)
            return res.download(filesToDownload[0]);

        await RoutesCommon.ZipFileGenerator(res, filesToDownload);
    }
    catch (err) { console.log(err); }
    return res.status(404);
});
""" + clsName + """.delete("/""" + route+ """/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const curUser = RoutesCommon.GetUser(req);
        const userId = Number(curUser!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.""" + clsName + """.destroy({
            where: { UserID: userId, id: id }
        });
        const success = (file !== 0);
        return res.json({ success: success });
    }
    catch (err) { 
        return res.json({ success: false });
    }
});
"""
    print(routes_str)
    fname = "./ts/routes/" + clsName + ".Routes.ts"
    with open(fname, "w") as text_file:
        text_file.write(routes_str)

mrg_items = ["mrgcat","mrgt","mrgauth","mrgya","mrgga"]
mrg_route = "mrg"
mrg_upload_file = "mrgcerti"
GenerateModel(mrg_items, mrg_route, mrg_upload_file)
GenerateRoutes(mrg_items, mrg_route, mrg_upload_file)

j_items = ["jdate","jt","jrpt","jissn","ji","jma","jdui"]
j_route = "journal"
j_upload_file = "jcerti"
GenerateModel(j_items, j_route, j_upload_file)
GenerateRoutes(j_items, j_route, j_upload_file)

sttp_items = ["sttpdate","sttpt","sttpcol","sttpnw","sttptype"]
sttp_route = "sttp"
sttp_upload_file = "sttpcerti"
GenerateModel(sttp_items, sttp_route, sttp_upload_file)
GenerateRoutes(sttp_items, sttp_route, sttp_upload_file)

sw_items = ["swdate","swt","swcol","swnd","swtype"]
sw_route = "semwork"
sw_upload_file = "swcerti"
GenerateModel(sw_items, sw_route, sw_upload_file)
GenerateRoutes(sw_items, sw_route, sw_upload_file)

citems = ["ci","cma","cissn","cdate","ct","crpt", "cdui"]
croute = "conference"
cupload_file = "ccerti"
GenerateModel(citems, croute, cupload_file)
GenerateRoutes(citems, croute, cupload_file)

pat_items = ["patdate","patype","pat","patcol","patspon","patnd"]
pat_route = "progatt"
pat_upload_file = "patcerti"
GenerateModel(pat_items, pat_route, pat_upload_file)
GenerateRoutes(pat_items, pat_route, pat_upload_file)

fdp_items = ["fdpdate","fdpt","fdpcol","fdpnd","fdptype"]
fdp_route = "fdp"
fdp_upload_file = "fdpcerti"
GenerateModel(fdp_items, fdp_route, fdp_upload_file)
GenerateRoutes(fdp_items, fdp_route, fdp_upload_file)
