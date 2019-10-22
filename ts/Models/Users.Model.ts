import {
  Table,
  Column,
  Model,
  AllowNull,
  Default,
  Unique,
  DataType
} from "sequelize-typescript";

import * as bcrypt from "bcrypt";

// Set Authority Based Enummeration
export type Authority = "NORMAL" | "ADMIN";

export class UserViewModel {
  public id: number;
  public Name: string;
  public Authority: string;

  public constructor(id: number, Name: string, Authority: string) {
    this.id = id;
    this.Name = Name;
    this.Authority = Authority;
  }
}

export interface UserAddModel {
  Name: string;
  Password: string;
  Authority: string;
}

// Create the Table to Store Users Data
@Table
export class Users extends Model<Users> {
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  title!: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  firstname!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  middlename!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  lastname!: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  fname!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  mname!: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  gender!: string;


  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  bdate!: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  address!: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  phone!: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  email!: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  dept!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  aos!: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  ugpyear!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  uggrade!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  ugu!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  ugi!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  ugr!: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  pgyear!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  pggrade!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  pgu!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  pgi!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  pgr!: string;

  
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  spyear!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  spgrade!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  spu!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  spi!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  spr!: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  tduration!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  tinstitute!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  tpost!: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  iduration!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  iinstitute!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  ipost!: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  oduration!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  oinstitute!: string;
  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  opost!: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  ImagePath!: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.TEXT)
  Name!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  get Password() {
    return this.getDataValue("Password");
  }
  set Password(value: string) {
    this.EncryptPassword(value);
  }

  @Default("NORMAL")
  @AllowNull(false)
  @Column(DataType.ENUM("NORMAL", "ADMIN"))
  Authority!: string;

  // Perform Password Encryption
  private EncryptPassword(value: string) {
    const salt_rounds = 2;
    const hash = bcrypt.hashSync(value, salt_rounds);
    this.setDataValue("Password", hash);
  }

  // Use this to Verify if the Entered Password is same as
  // Encrypted password
  public ComparePassword(password: string) {
    return bcrypt.compare(password, this.Password);
  }

  public static async InsertIfNotExists(user: UserAddModel) {
    // Name is the only Parameter that is supposed to be unique among all of these
    const count = await Users.count({ where: { Name: user.Name } });
    if (count === 0) await Users.create(user);
  }

  public static DefaultUser: UserAddModel = {
    Name: "universe",
    Password: "universe",
    Authority: "ADMIN"
  };
}
