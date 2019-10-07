
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
    mrgt!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    mrgga!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    mrgya!: string;


    @BeforeValidate
    public static CheckFileExistence(File: Mrg): void {
      if (!existsSync(File.Location))
        throw "File Not Exists at " + File.Location;
    }
  }
