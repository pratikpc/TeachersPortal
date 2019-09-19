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
export class Files extends Model<Files> {
  @AllowNull(false)
  @Column(DataType.TEXT)
  Location!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  Category!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  sdptitle!: string;

  @AllowNull(false)
  @Column(DataType.NUMERIC)
  year!: number;
  
  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column
  UserID!: number;

  @BeforeValidate
  public static CheckFileExistence(File: Files): void {
    if (!existsSync(File.Location))
      throw "File Not Exists at " + File.Location;
  }
}
