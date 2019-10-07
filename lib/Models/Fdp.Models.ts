
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
    fdpt!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    fdpcol!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    fdpnd!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    fdpdate!: string;


    @BeforeValidate
    public static CheckFileExistence(File: Fdp): void {
      if (!existsSync(File.Location))
        throw "File Not Exists at " + File.Location;
    }
  }

