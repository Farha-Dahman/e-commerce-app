import { roles } from "../../middleware/auth.js";

export const endPoints = {
  create: [roles.Admin],
  delete: [roles.Admin],
  update: [roles.Admin],
  restore: [roles.Admin],
  getAll: [roles.Admin, roles.User],
  getSpecific: [roles.Admin, roles.User],
};
