# image
# API Cập nhật Base64 vào File

API đơn giản để cập nhật chuỗi base64 trong file JavaScript.

## Các Endpoint

- `POST /init-template`: Khởi tạo file mẫu
- `POST /update-base64`: Cập nhật chuỗi base64 trong file
- `GET /get-file`: Xem nội dung file hiện tại
- `GET /download-file`: Tải xuống file

## Cài đặt

```bash
npm install
```

## Chạy Server

```bash
npm start
```

Server sẽ chạy tại http://localhost:3000

## Cách sử dụng với công cụ tự động

1. Gọi API `/init-template` để khởi tạo file
2. Sử dụng API `/update-base64` để cập nhật chuỗi base64
3. Tải file đã cập nhật bằng cách gọi `/download-file`