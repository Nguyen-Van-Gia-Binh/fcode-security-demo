# F-Code Security Challenge - Demo Project

Dự án này mô phỏng các lỗ hổng bảo mật web phổ biến (SQL Injection & RCE) phục vụ cho bài thuyết trình F-Code Challenge 3.

## ⚠️ Cảnh báo
Đây là mã nguồn chứa lỗ hổng bảo mật được viết có chủ đích (Vulnerable-by-Design). 
**TUYỆT ĐỐI KHÔNG SỬ DỤNG TRÊN MÔI TRƯỜNG THỰC TẾ (PRODUCTION).**

## 🛠 Yêu cầu cài đặt
* Node.js (v18 trở lên)
* PostgreSQL

## 🚀 Hướng dẫn cài đặt (Dành cho Team)

**Bước 1: Clone dự án về máy**
git clone <LINK_GIT_CUA_BAN>
cd fcode_demo

**Bước 2: Cài đặt các thư viện**
(Vì không up node_modules nên các bạn phải chạy lệnh này để tải lại thư viện)
npm install

**Bước 3: Cấu hình Database**
1. Mở pgAdmin, tạo database tên `fcode_demo`.
2. Mở Query Tool và chạy đoạn script sau để tạo dữ liệu giả:

\`\`\`sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(50),
    role VARCHAR(20),
    secret_data TEXT
);

INSERT INTO users (username, password, role, secret_data) VALUES
('admin', 'admin_password_rat_kho', 'admin', 'FLAG: Bi_Mat_Cua_Fcode_Challenge'),
('user_thuong', '123456', 'member', 'Tài liệu training bình thường');
\`\`\`

3. **QUAN TRỌNG:** Mở file `server.js` và `server_secure.js`, sửa lại dòng `password: '...'` thành mật khẩu PostgreSQL trên máy của bạn.

**Bước 4: Chạy Demo**

* Chạy phiên bản LỖI (Để test hack):
  `node server.js`

* Chạy phiên bản ĐÃ VÁ (Để test bảo mật):
  `node server_secure.js`

## 🕵️‍♂️ Hướng dẫn Test lỗ hổng

**1. SQL Injection (Login Bypass):**
* URL: `POST /login`
* Body: `{"username": "admin' --", "password": "123"}`

**2. RCE (Remote Code Execution):**
* URL: `POST /ssr`
* Body: `{"payload": "require('child_process').execSync('dir').toString()"}`