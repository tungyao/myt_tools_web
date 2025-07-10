// base64Tool.js
import { bytesToHexArray } from "./global.js";


export function renderBase64Tool(container) {
    container.innerHTML = `
        <div class="tool-card">
            <div class="input-section">
            <h3>输入文本</h3>
            <textarea id="base64-input" placeholder="请输入要编码或解码的文本..."></textarea>
                 <div class="button-group" style="margin-top:20px">
            <button id="encode-btn">编码为Base64</button>
            <button id="decode-btn">解码Base64</button>
         
            <button id="clear-btn">清空</button>
        </div>
            <div class="file-upload-section">
                <h3>上传文件</h3>
                <input type="file" id="file-input" class="file-input">
                <button id="encode-file-btn">编码文件</button>
            </div>
        </div>
   
            <div class="output-format" style="margin-top:30px">
                <label><input type="radio" name="output-format" value="text" checked> 文本格式</label>
                <label><input type="radio" name="output-format" value="array"> 数组格式 (16个/行)</label>
            </div>
            <div class="output-section">
                <h3 id="result">结果</h3>
                <textarea id="base64-output" readonly placeholder="结果将显示在这里..."></textarea>
            </div>
        </div>
    `;

    // 获取元素引用
    const inputTextarea = document.getElementById('base64-input');
    const outputTextarea = document.getElementById('base64-output');
    const encodeBtn = document.getElementById('encode-btn');
    const decodeBtn = document.getElementById('decode-btn');
    const clearBtn = document.getElementById('clear-btn');
    const fileInput = document.getElementById('file-input');
    const encodeFileBtn = document.getElementById('encode-file-btn');
    const resultBtn = document.getElementById("result");
    // const downloadBtn = document.getElementById('download-btn');

    // 编码文件功能
    encodeFileBtn.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('请先选择文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                // 移除data URL前缀
                const base64String = e.target.result.split(',')[1];
                if (getSelectedOutputFormat() === 'array') {
                    const bytes = new Uint8Array(base64String.length);
                    for (let i = 0; i < base64String.length; i++) {
                        bytes[i] = base64String.charCodeAt(i);
                    }
                    outputTextarea.value = bytesToHexArray(bytes);
                    resultBtn.innerText = "结果: " + bytes.length;

                } else {
                    outputTextarea.value = base64String;
                    resultBtn.innerText = "结果: " + base64String.length;

                }
            } catch (e) {
                outputTextarea.value = '文件编码失败: ' + e.message;
            }
        };
        reader.readAsDataURL(file);
    });

    // 下载解码文件功能
    // downloadBtn.addEventListener('click', () => {
    //     const base64String = inputTextarea.value;
    //     if (!base64String) {
    //         alert('请先输入Base64字符串');
    //         return;
    //     }

    //     try {
    //         const binaryStr = atob(base64String);
    //         const bytes = new Uint8Array(binaryStr.length);
    //         for (let i = 0; i < binaryStr.length; i++) {
    //             bytes[i] = binaryStr.charCodeAt(i);
    //         }
    //         const blob = new Blob([bytes], { type: 'application/octet-stream' });
    //         const url = URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = 'decoded_file.bin';
    //         document.body.appendChild(a);
    //         a.click();
    //         document.body.removeChild(a);
    //         URL.revokeObjectURL(url);
    //     } catch (e) {
    //         alert('文件解码失败: ' + e.message);
    //     }
    // });


    // 获取选中的输出格式
    function getSelectedOutputFormat() {
        return document.querySelector('input[name="output-format"]:checked').value;
    }

    // 编码功能
    encodeBtn.addEventListener('click', () => {
        const text = inputTextarea.value;
        if (!text) return;
        try {
            let data = (encodeURIComponent(text));
            const encoded = btoa(data);
            if (getSelectedOutputFormat() === 'array') {
                // 将Base64字符串转换为字节数组
                const binaryStr = atob(encoded);
                const bytes = new Uint8Array(binaryStr.length);
                for (let i = 0; i < binaryStr.length; i++) {
                    bytes[i] = binaryStr.charCodeAt(i);
                }
                resultBtn.innerText = "结果: " + bytes.length;
                outputTextarea.value = bytesToHexArray(bytes);
            } else {
                resultBtn.innerText = "结果: " + encoded.length;
                outputTextarea.value = encoded;
            }
        } catch (e) {
            outputTextarea.value = '编码失败: ' + e.message;
        }
    });

    // 解码功能
    decodeBtn.addEventListener('click', () => {
        const text = inputTextarea.value;
        if (!text) return;
        try {
            const decodedStr = decodeURIComponent(escape(atob(text)));
            if (getSelectedOutputFormat() === 'array') {
                // 将解码后的字符串转换为字节数组
                const bytes = new Uint8Array(decodedStr.length);
                for (let i = 0; i < decodedStr.length; i++) {
                    bytes[i] = decodedStr.charCodeAt(i);
                }
                outputTextarea.value = bytesToHexArray(bytes);
                resultBtn.innerText = "结果: " + outputTextarea.value.length;
            } else {
                outputTextarea.value = decodedStr;
                resultBtn.innerText = "结果: " + decodedStr.length;

            }
        } catch (e) {
            outputTextarea.value = '解码失败: 无效的Base64字符串';
        }
    });

    // 清空功能
    clearBtn.addEventListener('click', () => {
        inputTextarea.value = '';
        outputTextarea.value = '';
        resultBtn.innerText = "结果";
    });
}