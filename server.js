const express = require("express");
const { Client } = require("pg");
const app = express();

app.use(express.json()); // Để đọc được dữ liệu JSON gửi lên

// --- CẤU HÌNH KẾT NỐI DATABASE ---
// BẠN HÃY SỬA PASSWORD Ở DƯỚI ĐÂY THÀNH PASSWORD CỦA MÁY BẠN
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "fcode_demo", // Mặc định là 'postgres' nếu bạn chưa tạo db riêng
  password: "G@giabinh2006e", // <--- SỬA CÁI NÀY
  port: 5432,
});

client
  .connect()
  .then(() => console.log("Đã kết nối Database thành công!"))
  .catch((err) =>
    console.error("Lỗi kết nối Database (Kiểm tra lại password):", err.message)
  );

// --- 1. MÔ PHỎNG LỖ HỔNG SQL INJECTION (CVE-2025-1094) ---
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Code lỗi: Nối chuỗi trực tiếp, không dùng tham số hóa (Prepared Statement)
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  console.log("Câu lệnh SQL đang chạy: " + query); // In ra để xem hacker làm gì

  try {
    const result = await client.query(query);
    if (result.rows.length > 0) {
      res.json({ message: "Đăng nhập thành công!", data: result.rows[0] });
    } else {
      res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }
  } catch (err) {
    res.status(500).send("Lỗi Server: " + err.message);
  }
});

// --- 2. MÔ PHỎNG LỖ HỔNG RCE (React2Shell - CVE-2025-55182) ---
app.post("/ssr", (req, res) => {
  const { payload } = req.body;
  try {
    // Code lỗi: Dùng eval() để chạy code từ người dùng gửi lên
    // Tưởng tượng đây là quá trình React xử lý dữ liệu sai cách
    const result = eval(payload);
    res.send("Kết quả thực thi: " + result);
  } catch (err) {
    res.send("Lỗi: " + err.message);
  }
});

// Chạy server tại cổng 3000
app.listen(3000, () => {
  console.log("Server đang chạy tại http://localhost:3000");
});
q