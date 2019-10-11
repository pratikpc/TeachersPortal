
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


    @BeforeValidate
    public static CheckFileExistence(File: Semwork): void {
      if (!existsSync(File.Location))
        throw "File Not Exists at " + File.Location;
    }
  }

