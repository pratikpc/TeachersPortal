
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
  export class Journal extends Model<Journal> {
    @AllowNull(false)
    @Column(DataType.TEXT)
    Location!: string;
  
    @AllowNull(false)
    @ForeignKey(() => Users)
    @Column
    UserID!: number;
  

    @AllowNull(false)
    @Column(DataType.TEXT)
    jdate!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    jt!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    jrpt!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    jissn!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    ji!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    jma!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    jdui!: string;


    @BeforeValidate
    public static CheckFileExistence(File: Journal): void {
      if (!existsSync(File.Location))
        throw "File Not Exists at " + File.Location;
    }
  }

