/* eslint-disable no-console */
import express from "express";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb";
import { env } from "~/config/environment";

const START_SERVER = async () => {
  const app = express();

  app.get("/", async (req, res) => {
    res.end("<h1>Hello World!</h1><hr>");
  });

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `3. Hello ${env.AUTHOR}, Back-end Server is running successfully at Host ${env.APP_HOST} and Port: ${env.APP_PORT}`
    );
  });

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

// console.log("1. Connecting to MongoDB CLoud Atlas...");
// CONNECT_DB()
//   .then(() => console.log("2. Connected to MongoDB CLoud Atlas!"))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(0);
//   });
