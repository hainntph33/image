// server.js - API xử lý base64 với chuyển hướng trực tiếp
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Kiểm tra kết nối
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server đang hoạt động' });
});

// Trang chủ đơn giản với form để test
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>API Xử lý Base64</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #2c3e50; }
            .endpoint { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 15px; }
            textarea { width: 100%; min-height: 100px; margin-top: 10px; padding: 8px; border-radius: 3px; border: 1px solid #ddd; }
            button { background: #3498db; color: white; border: none; padding: 10px 15px; border-radius: 3px; cursor: pointer; margin-top: 10px; }
            button:hover { background: #2980b9; }
            #result { margin-top: 20px; }
            .loading { display: none; margin-top: 15px; }
            .loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 20px; height: 20px; animation: spin 2s linear infinite; margin: 10px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
    </head>
    <body>
        <h1>API Xử lý Base64</h1>
        <p>Nhập chuỗi base64 để gửi đến API và lấy JSON</p>
        
        <div class="endpoint">
            <textarea id="base64Input" placeholder="Nhập chuỗi base64 vào đây"></textarea>
            <button id="submitBtn" onclick="processBase64()">Gửi đến API</button>
            <div id="loading" class="loading">
                <p>Đang xử lý...</p>
                <div class="loader"></div>
            </div>
        </div>
        
        <div id="result"></div>
        
        <script>
            async function processBase64() {
                try {
                    const base64 = document.getElementById('base64Input').value.trim();
                    if (!base64) {
                        alert('Vui lòng nhập chuỗi base64');
                        return;
                    }
                    
                    // Vô hiệu hóa nút khi đang xử lý
                    const submitBtn = document.getElementById('submitBtn');
                    submitBtn.disabled = true;
                    
                    // Hiển thị loading
                    const loading = document.getElementById('loading');
                    loading.style.display = 'block';
                    
                    // Tạo FormData
                    const formData = new FormData();
                    formData.append('image_base64', \`data:image/webp;base64,\${base64}\`);
                    
                    // Gửi trực tiếp đến API đích 
                    const response = await fetch('https://api-4-3y29.onrender.com/process_base64', {
                        method: 'POST',
                        body: formData
                    });
                    
                    // Chuyển đổi response
                    const data = await response.json();
                    
                    // Hiển thị kết quả
                    loading.style.display = 'none';
                    document.getElementById('result').innerHTML = 
                        '<h3>Kết quả JSON:</h3>' +
                        '<pre>' + JSON.stringify(data, null, 2) + '</pre>' +
                        '<button onclick="copyToClipboard()">Sao chép JSON</button>';
                }
                catch (error) {
                    loading.style.display = 'none';
                    document.getElementById('result').innerHTML = 
                        '<div style="color: red;">' +
                        '<h3>Lỗi:</h3>' +
                        '<p>' + error + '</p>' +
                        '</div>';
                }
                finally {
                    // Kích hoạt lại nút
                    document.getElementById('submitBtn').disabled = false;
                }
            }
            
            function copyToClipboard() {
                const code = document.querySelector('#result pre').textContent;
                navigator.clipboard.writeText(code)
                    .then(() => {
                        alert('Đã sao chép JSON vào clipboard!');
                    })
                    .catch(err => {
                        console.error('Lỗi khi sao chép:', err);
                    });
            }
        </script>
    </body>
    </html>
    `);
});

// Endpoint để xử lý base64 và gửi đến API đích
app.post('/process-base64', async (req, res) => {
    try {
        // Lấy base64 từ request
        const { base64String } = req.body;
        
        if (!base64String) {
            return res.status(400).json({ 
                success: false, 
                message: 'Thiếu chuỗi base64' 
            });
        }
        
        // Tạo FormData để gửi đến API đích
        const formData = new FormData();
        formData.append('image_base64', `data:image/webp;base64,${base64String}`);
        
        // Gửi request đến API đích
        const response = await axios.post('https://api-4-3y29.onrender.com/process_base64', 
            formData, 
            { 
                headers: { 
                    ...formData.getHeaders()
                } 
            }
        );
        
        // Trả về kết quả từ API đích
        res.json({
            success: true,
            apiResponse: response.data,
            message: 'Đã gửi base64 thành công'
        });
        
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi khi xử lý base64: ' + error.message 
        });
    }
});

// Endpoint để tạo JS với base64
app.post('/generate-code', (req, res) => {
    try {
        // Lấy base64 từ request
        const { base64String } = req.body;
        
        if (!base64String) {
            return res.status(400).json({ 
                success: false, 
                message: 'Thiếu chuỗi base64' 
            });
        }
        
        // Tạo nội dung JS
        const jsCode = `// Chuỗi base64
const imageBase64 = "${base64String}";

// Tạo FormData
const formData = new FormData();
formData.append('image_base64', \`data:image/webp;base64,\${imageBase64}\`);

// Gửi request đến API
fetch('https://api-4-3y29.onrender.com/process_base64', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('JSON response:', data);
})
.catch(error => {
  console.error('Error:', error);
});`;
        
        // Trả về mã JS
        res.json({
            success: true,
            jsCode: jsCode,
            message: 'Đã tạo mã JS thành công'
        });
        
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi khi tạo mã JS: ' + error.message 
        });
    }
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

module.exports = app;