import { roles } from "../../constants/roles.js";

export const endPoints = {
  create: [roles.Admin],
  delete: [roles.Admin],
  update: [roles.Admin],
  restore: [roles.Admin],
  getAll: [roles.Admin, roles.User],
  getSpecific: [roles.Admin, roles.User],
};
