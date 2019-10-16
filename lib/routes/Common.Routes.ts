import { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";
import * as fs from "fs";
import { promises as FsPromises } from "fs";
import { extname } from "path";
import * as multer from "multer";
import * as Path from "path";
import * as process from "process";

export namespace RoutesCommon {
  export function EmptyUndef(key: any) {
    if (key == null || key === "undefined")
      return "";
    return key;
  }


  const storage = multer.diskStorage({
    destination: async (request: any, file: any, callback: any) => {
      const dir = Path.resolve(String(process.env.INIT_CWD), 'uploads');
      await RoutesCommon.CreateDirectoryIfNotExistsAsync(dir);
      callback(null, dir);
    },
    filename: (request: any, file: any, callback: any) => {
      let fileName = "";
      while (true) {
        const name = randomBytes(12).toString("hex");
        const ext = extname(file.originalname);
        fileName = name + ext;
        if (!fs.existsSync(fileName)) break;
      }

      callback(null, fileName);
    }
  });
  export const upload = multer.default({
    storage: storage,
    // Set File Size Limit of 25 MB
    limits: { fileSize: 1024 * 1024 * 25 }
  });
  export async function CreateDirectoryIfNotExistsAsync(location: string) {
    return new Promise<void>((resolve, reject) => {
      FsPromises.access(location, fs.constants.R_OK).then(() => {
        resolve();
        // Do Nothing if Exists
      }).catch(() => {
        FsPromises.mkdir(location)
          .then(() => { resolve(); })
          .catch((err) => { reject(err) });
      });
    });
  }

  export function NoCaching(res: Response) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    return res;
  }

  export async function RemoveFileAsync(location: string) {
    await FsPromises.unlink(location);
  }

  export function FilesToPathString(Files: any[]) {
    const paths: string[] = [];

    Files.forEach(file => {
      paths.push(file.path);
    });

    return paths;
  }

  export function RemoveFilesAsync(locations: string[]) {
    const removalAsyncs: Promise<void>[] = [];
    for (const location of locations) {
      removalAsyncs.push(RemoveFileAsync(location));
    }
    return Promise.all(removalAsyncs);
  }

  export function ListOfFiles(location: string) {
    return new Promise<string[]>((resolve, reject) => {
      fs.readdir(location, (err, files) => {
        if (err)
          reject(err);
        else {
          // Convert to Absolute paths
          files = files.map(file => Path.resolve(location, file));
          resolve(files);
        }
      })
    });
  }

  // Check if Authentication is Correct
  export function IsAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.isAuthenticated()) return next();
    return res.redirect("/");
  }

  // Check if User is Admin
  export function IsAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated() && req.user!.Authority === "ADMIN") return next();
    return res.redirect("/");
  }

  // Check if User is Not Admin
  export function IsNotAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated() && req.user!.Authority !== "ADMIN") return next();
    return res.redirect("/");
  }

  function IsNotEmptyAny(object: any): boolean {
    return object && Object.keys(object).length !== 0;
  }
  export function GetParameters(req: Request): any {
    if (IsNotEmptyAny(req.body)) return req.body;
    if (IsNotEmptyAny(req.query)) return req.query;
    if (IsNotEmptyAny(req.params)) return req.params;
    return null;
  }

  export function ToArrayFromJsonString<T>(data: string): T[] {
    if (!data.includes("["))
      data = "[\"" + data + "\"]";
    return JSON.parse(data) as T[];
  }

  // Convert Given Data as Array of Type
  export function ToArray(data: any): string[] {
    // If Null, Return Empty Array
    if (data == null) {
      return [];
    }
    // If it's already an array perform type conversion
    else if (Array.isArray(data)) {
      return data.map(String);
    } else {
      // If it's Element, send as first value
      const value = String(data);
      return [value];
    }
  }

}
