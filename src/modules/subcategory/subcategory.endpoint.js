import { roles } from "../../constants/roles.js";

export const endPoints = {
  create: [roles.Admin],
  getActive: [roles.Admin, roles.User],
  update: [roles.Admin],
  specific: [roles.Admin, roles.User],
  delete: [roles.Admin],
};
