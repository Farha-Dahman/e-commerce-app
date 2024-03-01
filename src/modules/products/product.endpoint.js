import { roles } from "../../constants/roles.js";

export const endPoints = {
  create: [roles.Admin],
  getAll: [roles.Admin, roles.User],
  specific: [roles.Admin, roles.User],
  update: [roles.Admin],
  delete: [roles.Admin],
  restore: [roles.Admin],
  status: [roles.Admin],
};
