import { Router } from "express";
import authRouter from "../modules/auth/auth.route";
import userRouter from "../modules/user/user.route";
import cowRouter from "../modules/cow/cow.route";
import orderRouter from "../modules/order/order.route";
import adminRouter from "../modules/admin/admin.route";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: authRouter },
  { path: "/users", route: userRouter },
  { path: "/cows", route: cowRouter },
  { path: "/orders", route: orderRouter },
  { path: "/admins", route: adminRouter },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
