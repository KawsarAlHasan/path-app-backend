import express from "express";
import { AdminRoutes } from "../app/modules/admin/admin.route";
import { UserAuthRoutes } from "../app/modules/auth/user/userAuth.route";
import { AdminAuthRoutes } from "../app/modules/auth/admin/adminAuth.route";

const router = express.Router();

const apiRoutes = [
  {
    path: "/auth/admin",
    route: AdminAuthRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/auth/user",
    route: UserAuthRoutes,
  },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
