def GenerateModel(items, route, upload_file):
    clsName = route.title()
    models_str = ""
    models_str += """
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
    if (!existsSync(File.Location))
        throw "File Not Exists at " + File.Location;
    }
}
    """
    print(models_str)
    fname = "./lib/Models/" + clsName + ".Models.ts"
    with open(fname, "w") as text_file:
        text_file.write(models_str)
def GenerateRoutes(items, route, upload_file):
    clsName = route.title()
    routes_str = ""
    routes_str += """
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
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(req.user!.id);
        const id = String(params.id);
        const files = req.files as any[];
        // ID Nullish is Used for First time Upload
        if (id === "nullish" && (files == null || files.length === 0))
            return res.status(422).send("Upload Failed");
        """
    for item in items:
        routes_str += """const """ + item + """ = String(params.""" + item + """);
    """
    routes_str += """
        let file = null;
        // ID Nullish is Used for First time Upload
        if (files != null && files.length !== 0)
            file = files[0]
        if (id === "nullish"){
            await Models.""" + clsName + """.create({
                UserID: userId,
                Location: file.path,
"""
    for item in items:
        routes_str += """                    """ + item + """:""" + item + """,
    """
    routes_str += """
            });
        }
        else{
            await Models.""" + clsName + """.update({
"""
    for item in items:
        routes_str += """                """ + item + """:""" + item + """,
    """
    routes_str += """
                },
                { where: { id: id, UserID: userId } }
            );
            if (file != null)
                    await Models.Conference.update({
                        Location: file.path
                    },
                    { where: { id: id, UserID: userId } }
                    );
            }
    return res.status(200).redirect('/""" + route + """');
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
    const userId = Number(req.user!.id);
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
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.""" + clsName + """.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('""" + route + """.ejs', GetUploadJson(file));
});
""" + clsName + """.get("/""" + route+ """/file-viewer/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.""" + clsName + """.findOne({
            where: { UserID: userId, id: id }
        });
        if (!file)
            return res.sendStatus(404);
        const path = file.Location;
        return res.download(path);
    }
    catch (err) { }
    return res.sendStatus(404);
});
""" + clsName + """.get("/""" + route+ """/delete/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
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
"""
    print(routes_str)
    fname = "./lib/routes/" + clsName + ".Routes.ts"
    with open(fname, "w") as text_file:
        text_file.write(routes_str)

items = ["ci","cma","cissn","cdate","ct","crpt", "cdui"]
route = "conference"
upload_file = "ccerti"

GenerateModel(items, route, upload_file)
GenerateRoutes(items, route, upload_file)