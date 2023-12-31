import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import router from "./app/routes";
import httpStatus from "./shared/httpStatus";
import cookieParser from "cookie-parser";

const app: Application = express();

// parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser
app.use(cookieParser());

// cors
app.use(cors());

// router
app.use("/api/v1", router);


// root route
app.get("/", async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    statusCode: httpStatus.OK,
    success: true,
    message: "Server is running successfully",
  });
});

// global error handler
app.use(globalErrorHandler);

// handle page not found error
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    statusCode: httpStatus.NOT_FOUND,
    success: false,
    message: "Api not found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "Request api path not found",
      },
    ],
  });
  next();
});

export default app;
