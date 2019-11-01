
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
export class Semwork extends Model<Semwork> {
    @AllowNull(false)
    @Column(DataType.TEXT)
    Location!: string;

    @AllowNull(false)
    @ForeignKey(() => Users)
    @Column
    UserID!: number;

    @AllowNull(false)
    @Column(DataType.TEXT)
    swdate!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    swt!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    swcol!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    swnd!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    swtype!: string;

    @BeforeCreate
    public static CheckFileExistence(File: Semwork): void {
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
