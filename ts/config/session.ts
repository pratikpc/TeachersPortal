export const Session = {
  secret: "TeachersPortal",
  cookie: {
    // Max Time for Cookie Existence
    // In MilliSeconds
    maxAge: 4 * 24 * 60 * 60 * 1000,
    secure: false
  },
  name: "Teachers Portal",
  resave: false,
  saveUninitialized: true
};
