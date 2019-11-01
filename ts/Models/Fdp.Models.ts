
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
export class Fdp extends Model<Fdp> {
    @AllowNull(false)
    @Column(DataType.TEXT)
    Location!: string;

    @AllowNull(false)
    @ForeignKey(() => Users)
    @Column
    UserID!: number;

    @AllowNull(false)
    @Column(DataType.TEXT)
    fdpdate!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    fdpt!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    fdpcol!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    fdpnd!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    fdptype!: string;

    @BeforeCreate
    public static CheckFileExistence(File: Fdp): void {
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
