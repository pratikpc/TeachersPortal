
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
export class Mrg extends Model<Mrg> {
    @AllowNull(false)
    @Column(DataType.TEXT)
    Location!: string;

    @AllowNull(false)
    @ForeignKey(() => Users)
    @Column
    UserID!: number;

    @AllowNull(false)
    @Column(DataType.TEXT)
    mrgcat!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    mrgt!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    mrgauth!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    mrgya!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    mrgga!: string;

    @BeforeCreate
    public static CheckFileExistence(File: Mrg): void {
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
