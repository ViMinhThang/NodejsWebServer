import bcrypt from "bcryptjs";

const users = [
  {
    full_name: "Admin User",
    email: "admin@emai.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    full_name: "John Doe",
    email: "john@email.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    full_name: "Jane Doe",
    email: "jane@emai.com",
    password: bcrypt.hashSync("123456", 10),
  },
];
export default users;
