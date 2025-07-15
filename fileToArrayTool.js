import { bytesToHexArray } from "./global.js";

export function renderFileToArrayTool(container) {
    container.innerHTML = `
        <div class="tool-card">
            <div class="input-section">
                <h3>文件转数组工具</h3>
                <div class="file-upload-section">
                    <h3>上传文件</h3>
                    <input type="file" id="file-to-array-input" class="file-input">
                    <button id="convert-to-array-btn">转换为数组</button>
                </div>
                <div class="button-group" style="margin-top:10px;">
                    <button id="clear-array-btn">清空</button>
                </div>
            </div>
            <div class="output-section">
                <h3 id="array-result-title">数组结果 (16个/行)</h3>
                <textarea id="array-output" readonly placeholder="转换后的数组将显示在这里..."></textarea>
            </div>
        </div>
    `;

    // 获取DOM元素
    const fileInput = document.getElementById('file-to-array-input');
    const convertBtn = document.getElementById('convert-to-array-btn');
    const clearBtn = document.getElementById('clear-array-btn');
    const outputTextarea = document.getElementById('array-output');

    // 转换文件为数组
    function convertFileToArray() {
        const file = fileInput.files[0];
        if (!file) {
            alert('请先选择文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const dataBytes = new Uint8Array(e.target.result);
                outputTextarea.value = bytesToHexArray(dataBytes);
document.getElementById('array-result-title').textContent = `数组结果 (16个/行) - 长度: ${dataBytes.length}`;
            } catch (e) {
                outputTextarea.value = '转换失败: ' + e.message;
            }
        };
        reader.readAsArrayBuffer(file);
    }

    // 清空输出
    function clearOutput() {
        outputTextarea.value = '';
        fileInput.value = '';
    }

    // 事件监听
    convertBtn.addEventListener('click', convertFileToArray);
    clearBtn.addEventListener('click', clearOutput);
}