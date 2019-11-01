
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
export class Progatt extends Model<Progatt> {
    @AllowNull(false)
    @Column(DataType.TEXT)
    Location!: string;

    @AllowNull(false)
    @ForeignKey(() => Users)
    @Column
    UserID!: number;

    @AllowNull(false)
    @Column(DataType.TEXT)
    patdate!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    patype!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    pat!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    patcol!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    patspon!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    patnd!: string;

    @BeforeCreate
    public static CheckFileExistence(File: Progatt): void {
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
