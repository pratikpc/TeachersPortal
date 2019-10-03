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
  export class Conference extends Model<Conference> {
    @AllowNull(false)
    @Column(DataType.TEXT)
    Location! : string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    ci!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    ct!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    crpt!: string;

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
    curl!: string;

    @AllowNull(false)
    @ForeignKey(() => Users)
    @Column
    UserID!: number;
  
    @BeforeValidate
    public static CheckFileExistence(Conference: Conference): void {
      if (!existsSync(Conference.Location))
        throw "File Not Exists at " + Conference.Location;
    }
  }
  