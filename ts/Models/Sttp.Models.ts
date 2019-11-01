
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
export class Sttp extends Model<Sttp> {
    @AllowNull(false)
    @Column(DataType.TEXT)
    Location!: string;

    @AllowNull(false)
    @ForeignKey(() => Users)
    @Column
    UserID!: number;

    @AllowNull(false)
    @Column(DataType.TEXT)
    sttpdate!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    sttpt!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    sttpcol!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    sttpnw!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    sttptype!: string;

    @BeforeCreate
    public static CheckFileExistence(File: Sttp): void {
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
