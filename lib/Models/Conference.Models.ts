
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
export class Conference extends Model<Conference> {
    @AllowNull(false)
    @Column(DataType.TEXT)
    Location!: string;

    @AllowNull(false)
    @ForeignKey(() => Users)
    @Column
    UserID!: number;


    @AllowNull(false)
    @Column(DataType.TEXT)
    ci!: string;
    
    @AllowNull(false)
    @Column(DataType.TEXT)
    cma!: string;
    
    @AllowNull(false)
    @Column(DataType.TEXT)
    cissn!: string;
    
    @AllowNull(false)
    @Column(DataType.TEXT)
    cdate!: string;
    
    @AllowNull(false)
    @Column(DataType.TEXT)
    ct!: string;
    
    @AllowNull(false)
    @Column(DataType.TEXT)
    crpt!: string;
    
    @AllowNull(false)
    @Column(DataType.TEXT)
    cdui!: string;
    

    @BeforeCreate
    public static CheckFileExistence(File: Conference): void {
    if (!existsSync(File.Location))
        throw "File Not Exists at " + File.Location;
    }
}
    