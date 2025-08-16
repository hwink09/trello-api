import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "~/config/environment";

// khởi tạo một đối tượng trelloDatabaseInstance ban đầu là null (vì chưa connect)
let trelloDatabaseInstance = null;

// khởi tạo một đối tượng mongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// kết nối database
export const CONNECT_DB = async () => {
  // gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của mongoClientInstance
  await mongoClientInstance.connect();
  // kết nối thành công thì lấy ra Database theo tên và gán ngược nó lại vào biến trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

// Đóng kết nối đên db khi cần
export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};

// function GET_DB (không asnyc) này có nhiệm vụ export ra cái Trello Database Instance sau khi đã connect thành công tới Mongodb để sử dụng ở nhiều nơi khác nhau trong code
// lưu ý phải đảm bảo chỉ luôn gọi cái GET_DB này sau khi đã kết nối thành công với mongoDB
export const GET_DB = () => {
  if (!trelloDatabaseInstance) {
    throw new Error("Database not connected");
  }
  return trelloDatabaseInstance;
};
