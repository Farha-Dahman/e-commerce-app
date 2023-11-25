import { roles } from "../../middleware/auth.js";

export const endPoints = {
  create: [roles.Admin],
  getAll: [roles.Admin],
  getActive: [roles.User],
  update: [roles.Admin],
  specific: [roles.Admin, roles.User],
};
