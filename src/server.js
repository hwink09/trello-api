/* eslint-disable no-console */
import express from "express";
import cors from "cors";
import { corsOptions } from "~/config/cors";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";

const START_SERVER = async () => {
  const app = express();

  // Xử lí CORS
  app.use(cors(corsOptions));

  // Enable req.body json data
  app.use(express.json());

  // use API V1
  app.use("/v1", APIs_V1);

  // Middleware xử lí lỗi tập trung
  app.use(errorHandlingMiddleware);

  // Môi trường production (cụ thể hiện tại support Render.com)
  if (env.BUILD_MODE === "production") {
    app.listen(process.env.PORT, () => {
      console.log(
        `3. Production: Hello ${env.AUTHOR}, Back-end Server is running successfully at Port: ${process.env.PORT}`
      );
    });
  } else {
    // Môi trường local dev
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(
        `3. Local DEV: Hello ${env.AUTHOR}, Back-end Server is running successfully at Host ${env.LOCAL_DEV_APP_HOST} and Port: ${env.LOCAL_DEV_APP_PORT}`
      );
    });
  }

  // thực hiện các tác vụ clean up trước khi dừng server
  exitHook(() => {
    console.log("4. Server is shutting down...");
    CLOSE_DB();
    console.log("5. Disconnected from MongoDB.");
  });
};

// chỉ khi kết nối đến db thành công thì mới start server back-end lên
// Immediately-invoked / Anonymous Asnyc Function (IIFE)
(async () => {
  try {
    console.log("1. Connecting to MongoDB CLoud Atlas...");
    await CONNECT_DB();
    console.log("2. Connected to MongoDB CLoud Atlas!");

    START_SERVER();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(0);
  }
})();
