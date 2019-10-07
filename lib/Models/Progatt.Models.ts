
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
    patype!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    pat!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    patcol!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    patnd!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    patdate!: string;


    @BeforeValidate
    public static CheckFileExistence(File: Progatt): void {
      if (!existsSync(File.Location))
        throw "File Not Exists at " + File.Location;
    }
  }

