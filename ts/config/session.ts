export const Session = {
  secret: "TeachersPortal",
  cookie: {
    expires: true,
    // Max Time for Cookie Existence
    // In MilliSeconds
    maxAge: 4 * 24 * 60 * 60 * 1000,
    secure: false
  },
  name: "Teachers Portal",
  resave: false,
  saveUninitialized: true
};
