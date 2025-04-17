// server.js - API xử lý base64 đơn giản
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
        formData.append('image_base64', `data:image/webp;base64,    {base64String}`);
        
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
        const jsCode = `// Chuỗi base64 dài hơn
const longBase64 ="${base64String}"

// Tạo FormData
const formData = new FormData();
formData.append('image_base64', \`data:image/webp;base64,\${longBase64}\`);

// Gửi request đến API
fetch('https://api-4-3y29.onrender.com/process_base64', {
  method: 'POST',
  body: formData
})
.then(response => {
  console.log('Status:', response.status);
  return response.text();
})
.then(text => {
  console.log('Response:', text);
  try {
    const json = JSON.parse(text);
    console.log('JSON response:', json);
  } catch (e) {
    console.error('Could not parse JSON:', e);
  }
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
            code { background: #e8e8e8; padding: 2px 5px; border-radius: 3px; font-family: monospace; }
            pre { background: #f8f8f8; padding: 10px; border-radius: 3px; overflow: auto; max-height: 400px; }
            .method { font-weight: bold; color: #3498db; }
            button { background: #3498db; color: white; border: none; padding: 10px 15px; border-radius: 3px; cursor: pointer; margin-top: 10px; }
            button:hover { background: #2980b9; }
            textarea { width: 100%; min-height: 100px; margin-top: 10px; padding: 8px; border-radius: 3px; border: 1px solid #ddd; }
            #result { margin-top: 20px; }
        </style>
    </head>
    <body>
        <h1>API Xử lý Base64</h1>
        <p>Sử dụng các endpoint sau để tương tác với API:</p>
        
        <div class="endpoint">
            <span class="method">POST</span> <code>/process-base64</code>
            <p>Gửi chuỗi base64 đến API đích và trả về kết quả</p>
            <textarea id="base64Input" placeholder="Nhập chuỗi base64 vào đây"></textarea>
            <button onclick="processBase64()">Gửi Base64</button>
        </div>
        
        <div class="endpoint">
            <span class="method">POST</span> <code>/generate-code</code>
            <p>Tạo mã JavaScript với chuỗi base64</p>
            <textarea id="base64ForCode" placeholder="Nhập chuỗi base64 vào đây"></textarea>
            <button onclick="generateCode()">Tạo Mã JS</button>
        </div>
        
        <div id="result"></div>
        
        <script>
            function processBase64() {
                const base64 = document.getElementById('base64Input').value.trim();
                if (!base64) {
                    alert('Vui lòng nhập chuỗi base64');
                    return;
                }
                
                fetch('/process-base64', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ base64String: base64 })
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('result').innerHTML = 
                        '<h3>Kết quả:</h3>' +
                        '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                })
                .catch(error => {
                    document.getElementById('result').innerHTML = 
                        '<div style="color: red;">' +
                        '<h3>Lỗi:</h3>' +
                        '<p>' + error + '</p>' +
                        '</div>';
                });
            }
            
            function generateCode() {
                const base64 = document.getElementById('base64ForCode').value.trim();
                if (!base64) {
                    alert('Vui lòng nhập chuỗi base64');
                    return;
                }
                
                fetch('/generate-code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ base64String: base64 })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('result').innerHTML = 
                            '<h3>Mã JavaScript:</h3>' +
                            '<pre>' + data.jsCode + '</pre>' +
                            '<button onclick="copyToClipboard()">Sao chép mã</button>';
                    } else {
                        document.getElementById('result').innerHTML = 
                            '<div style="color: red;">' +
                            '<h3>Lỗi:</h3>' +
                            '<p>' + data.message + '</p>' +
                            '</div>';
                    }
                })
                .catch(error => {
                    document.getElementById('result').innerHTML = 
                        '<div style="color: red;">' +
                        '<h3>Lỗi:</h3>' +
                        '<p>' + error + '</p>' +
                        '</div>';
                });
            }
            
            function copyToClipboard() {
                const code = document.querySelector('#result pre').textContent;
                navigator.clipboard.writeText(code)
                    .then(() => {
                        alert('Đã sao chép mã vào clipboard!');
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

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

module.exports = app;