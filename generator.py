items = ["mrgt","mrgga","mrgya"]
route = "mrg"
upload_file = "mrgcerti"
clsName = route.title()

models_str = ""
models_str += """
import {
    Table,
    AllowNull,
    Column,
    DataType,
    ForeignKey,
    BeforeValidate,
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

    @BeforeValidate
    public static CheckFileExistence(File: """ + clsName + """): void {
      if (!existsSync(File.Location))
        throw "File Not Exists at " + File.Location;
    }
  }

"""

routes_str = ""
routes_str += """
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
"""

routes_str += "export const " + clsName + " = Router();\n\n"

routes_str += "function GetUploadJson(file: any) {\n"
routes_str += "if (file==null)\n"
routes_str += "\treturn {\n"
routes_str += "\t\tid:\"nullish\",\n"
for item in items:
	routes_str += "\t\t" + item + ": \"\",\n"
routes_str = routes_str[:-2] + "\n"
routes_str += "\t};\n"

routes_str += "return {\n"
routes_str += "\tid:file.id,\n"
for item in items:
	routes_str += "\t" + item + ": file." + item + ",\n"
routes_str = routes_str[:-2] + "\n"
routes_str += "\t};\n"
routes_str += "}\n";
routes_str += """

""" + clsName + """.post("/""" + route+ """", RoutesCommon.IsAuthenticated,
 RoutesCommon.upload.array('""" + upload_file + """'), async (req, res) => {
    try {
        const files = req.files as any[];
        if (files == null || files.length === 0)
            return res.status(422).send("Upload Failed");
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(req.user!.id);
        const id = String(params.id);"""
for item in items:
	routes_str += """const """ + item + """ = String(params.""" + item + """);
	"""

routes_str += """
        // Iterate over all the files
        files.forEach(async (file) => {
            if (id === "nullish")
                await Models.""" + clsName + """.create({
                    UserID: userId,
                    Location: file.path,
"""
for item in items:
	routes_str += """                    """ + item + """:""" + item + """,
"""
routes_str += """
            });
            else
                await Models.""" + clsName + """.update({
"""
for item in items:
	routes_str += """                    """ + item + """:""" + item + """,
"""
routes_str += """
                    },
                    { where: { id: id, UserID: userId } }
                );

        });
        return res.status(200).redirect('/""" + route + """');
    }
    catch (error) {
        console.error(error);
        return res.status(422).send("Upload Failed");
    }
});
""" + clsName + """.get("/""" + route+ """", RoutesCommon.IsAuthenticated, (req, res) => {
    return res.render('""" + route + """.ejs', GetUploadJson(null));
});
""" + clsName + """.get("/""" + route+ """/files", RoutesCommon.IsAuthenticated, async (req, res) => {
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
""" + clsName + """.get("/""" + route+ """/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.""" + clsName + """.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('""" + route + """.ejs', GetUploadJson(file));
});
""" + clsName + """.get("/""" + route+ """/file-viewer/:id", RoutesCommon.IsAuthenticated, async (req, res) => {
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
"""

print(models_str)
print(routes_str)

fname = clsName + ".Models.ts"
with open(fname, "w") as text_file:
    text_file.write(models_str)
fname = clsName + ".Routes.ts"
with open(fname, "w") as text_file:
    text_file.write(routes_str)