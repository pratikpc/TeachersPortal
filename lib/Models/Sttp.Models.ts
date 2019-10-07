
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
    sttpt!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    sttpcol!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    sttpnw!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    sttpdate!: string;


    @BeforeValidate
    public static CheckFileExistence(File: Sttp): void {
      if (!existsSync(File.Location))
        throw "File Not Exists at " + File.Location;
    }
  }

