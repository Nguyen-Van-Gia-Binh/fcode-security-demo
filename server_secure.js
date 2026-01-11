const express = require('express');
const { Client } = require('pg');
const app = express();

app.use(express.json());

// --- CẤU HÌNH KẾT NỐI DATABASE ---
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'fcode_demo', // Đảm bảo tên DB đúng
    password: 'G@giabinh2006e',   // <--- HÃY SỬA MẬT KHẨU CỦA BẠN Ở ĐÂY
    port: 5432,
});

client.connect()
    .then(() => console.log("Đã kết nối Database (Bản An Toàn)!"))
    .catch(err => console.error("Lỗi kết nối:", err.message));

// --- 1. VÁ LỖI SQL INJECTION ---
// Kỹ thuật: Sử dụng "Prepared Statements" (Tham số hóa)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // THAY ĐỔI LỚN NHẤT Ở ĐÂY:
    // Thay vì nối chuỗi: ... username = '${username}' ...
    // Chúng ta dùng ký hiệu $1, $2 (placeholder).
    // Dữ liệu người dùng được tách riêng ra mảng phía sau [username, password].
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    
    console.log("Query an toàn: " + query);
    console.log("Dữ liệu nạp vào: ", [username, password]);

    try {
        const result = await client.query(query, [username, password]); // Truyền dữ liệu riêng biệt
        
        if (result.rows.length > 0) {
            // Chỉ trả về thông tin cần thiết, KHÔNG trả về secret_data hay password
            const user = result.rows[0];
            res.json({ 
                message: "Đăng nhập thành công!", 
                user: { username: user.username, role: user.role } // Chỉ lấy username và role
            });
        } else {
            res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }
    } catch (err) {
        // VÁ LỖI DISCLOSURE: Không trả lỗi hệ thống ra cho người dùng xem
        console.error(err); // Chỉ log lỗi ở phía server để dev xem
        res.status(500).send("Lỗi hệ thống, vui lòng thử lại sau.");
    }
});

// --- 2. VÁ LỖI RCE (React2Shell) ---
// Kỹ thuật: Loại bỏ hàm eval() và Validate dữ liệu
app.post('/ssr', (req, res) => {
    const { payload } = req.body;

    // GIẢI PHÁP: Tuyệt đối không dùng eval() cho dữ liệu người dùng.
    // Nếu muốn tính toán, hãy dùng logic an toàn hoặc thư viện chuyên dụng.
    // Ở đây mình ví dụ: Chỉ cho phép payload là số nguyên để in ra.
    
    // Kiểm tra xem payload có phải là số không?
    const isNumber = !isNaN(payload) && !isNaN(parseFloat(payload));

    if (isNumber) {
        // Xử lý an toàn
        const result = parseFloat(payload) * 2; // Ví dụ logic nghiệp vụ
        res.send("Kết quả an toàn (x2): " + result);
    } else {
        res.status(400).send("Cảnh báo: Phát hiện dữ liệu không hợp lệ!");
    }
});

app.listen(3000, () => {
    console.log('Server BẢO MẬT đang chạy tại http://localhost:3000');
});