export const DB = {
  Host: String(process.env.DATABASE_HOST || "localhost"),
  Port: Number(process.env.DATABSE_PORT || 542),
  UserName: String(process.env.DATABASE_USER_NAME || "postgres"),
  Password: String(process.env.DATABASE_PASSWORD || "postgres"),
  DatabaseName: String(process.env.DATABASE_NAME || "teacherportal"),
  ssl: Boolean(String(process.env.DATABSE_SSL) === "true" || false)
};
console.log(DB);