// 工具注册表 - 方便后续添加新工具
const tools = [
    {
        id: 'base64',
        name: 'Base64编解码',
        render: (container) => renderBase64Tool(container)
    },
    {
        id: 'xor',
        name: 'XOR编码',
        render: (container) => renderXorTool(container)
    }
];

// DOM元素
const toolsListElement = document.getElementById('tools-list');
const toolNameElement = document.getElementById('current-tool-name');
const toolBodyElement = document.getElementById('tool-body');
const closeToolButton = document.getElementById('close-tool');
let activeTool = null;

// 初始化工具列表
function initToolsList() {
    toolsListElement.innerHTML = '';
    tools.forEach(tool => {
        const li = document.createElement('li');
        li.textContent = tool.name;
        li.dataset.toolId = tool.id;
        li.addEventListener('click', () => selectTool(tool.id));
        toolsListElement.appendChild(li);
    });
}

// 选择工具
function selectTool(toolId) {
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return;

    activeTool = tool;
    toolNameElement.textContent = tool.name;
    tool.render(toolBodyElement);
    closeToolButton.classList.remove('hidden');

    // 更新选中状态
    document.querySelectorAll('#tools-list li').forEach(li => {
        li.classList.toggle('active', li.dataset.toolId === toolId);
    });
}

// 关闭工具
function closeTool() {
    activeTool = null;
    toolNameElement.textContent = '请选择一个工具';
    toolBodyElement.innerHTML = '';
    closeToolButton.classList.add('hidden');
    document.querySelectorAll('#tools-list li').forEach(li => {
        li.classList.remove('active');
    });
}
    // 辅助函数：将字节数组转换为16进制数组格式字符串 (全局可用)
function bytesToHexArray(bytes, lineLength = 16) {
        return bytes.reduce((acc, byte, index) => {
            const hex = `0x${byte.toString(16).padStart(2, '0').toUpperCase()}`;
            const isNewLine = index > 0 && (index % lineLength === 0);
            return acc + (isNewLine ? '\n' : index > 0 ? ', ' : '') + hex;
        }, '');
    }


// XOR工具渲染和功能
function renderXorTool(container) {
    container.innerHTML = `
        <div class="tool-card">
            <div class="input-section">
                <h3>输入文本</h3>
                <textarea id="xor-input" placeholder="请输入要编码的文本..."></textarea>
                <div class="key-section">
                    <h3>XOR密钥 (16进制，如: A5 3C 7F)</h3>
                    <input type="text" id="xor-key" placeholder="请输入16进制密钥...">
                </div>
                <div class="button-group">
                    <button id="xor-encode-btn">XOR编码</button>
                    <button id="xor-decode-btn">XOR解码</button>
                    <button id="xor-clear-btn">清空</button>
                </div>
                <div class="file-upload-section">
                    <h3>上传文件</h3>
                    <input type="file" id="xor-file-input" class="file-input">
                    <button id="xor-encode-file-btn">编码文件</button>
                    <button id="xor-decode-file-btn">解码文件</button>
                </div>
            </div>
            <div class="output-format">
                <label><input type="radio" name="xor-output-format" value="text" checked> 文本格式</label>
                <label><input type="radio" name="xor-output-format" value="array"> 数组格式 (16个/行)</label>
            </div>
            <div class="output-section">
                <h3>结果</h3>
                <textarea id="xor-output" readonly placeholder="结果将显示在这里..."></textarea>
                <button id="xor-download-btn" style="margin-top:10px;">下载结果</button>
            </div>
        </div>
    `;

    // 获取元素引用
    const inputTextarea = document.getElementById('xor-input');
    const keyInput = document.getElementById('xor-key');
    const outputTextarea = document.getElementById('xor-output');
    const encodeBtn = document.getElementById('xor-encode-btn');
    const decodeBtn = document.getElementById('xor-decode-btn');
    const clearBtn = document.getElementById('xor-clear-btn');
    const fileInput = document.getElementById('xor-file-input');
    const encodeFileBtn = document.getElementById('xor-encode-file-btn');
    const decodeFileBtn = document.getElementById('xor-decode-file-btn');
    // const downloadBtn = document.getElementById('xor-download-btn');

    // 辅助函数：验证16进制密钥
    function validateHexKey(key) {
        const cleanedKey = key.replace(/\s+/g, '');
        if (!/^[0-9A-Fa-f]+$/.test(cleanedKey)) return null;
        if (cleanedKey.length % 2 !== 0) return null;
        return new Uint8Array(cleanedKey.match(/.{2}/g).map(byte => parseInt(byte, 16)));
    }

    // 辅助函数：XOR处理字节数组
    function xorProcessBytes(dataBytes, keyBytes) {
        if (keyBytes.length === 0) throw new Error('密钥不能为空');
        return dataBytes.map((byte, index) => byte ^ keyBytes[index % keyBytes.length]);
    }

    // 获取选中的输出格式
    function getSelectedOutputFormat() {
        return document.querySelector('input[name="xor-output-format"]:checked').value;
    }

    // 编码文本
    encodeBtn.addEventListener('click', () => {
        const text = inputTextarea.value;
        const key = keyInput.value;
        const keyBytes = validateHexKey(key);

        if (!text) { alert('请输入要编码的文本'); return; }
        if (!keyBytes) { alert('请输入有效的16进制密钥'); return; }

        try {
            const dataBytes = new TextEncoder().encode(text);
            const resultBytes = xorProcessBytes(dataBytes, keyBytes);

            if (getSelectedOutputFormat() === 'array') {
                outputTextarea.value = bytesToHexArray(resultBytes);
            } else {
                outputTextarea.value = new TextDecoder().decode(resultBytes);
            }
        }
     catch (e) {
            outputTextarea.value = '编码失败: ' + e.message;
        }
    });

    // 解码文本
    decodeBtn.addEventListener('click', () => {
        // XOR解码与编码逻辑相同
        encodeBtn.click();
    });

    // 清空功能
    clearBtn.addEventListener('click', () => {
        inputTextarea.value = '';
        keyInput.value = '';
        outputTextarea.value = '';
        fileInput.value = '';
    });

    // 编码文件
    encodeFileBtn.addEventListener('click', () => {
        const file = fileInput.files[0];
        const key = keyInput.value;
        const keyBytes = validateHexKey(key);

        if (!file) { alert('请先选择文件'); return; }
        if (!keyBytes) { alert('请输入有效的16进制密钥'); return; }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const dataBytes = new Uint8Array(e.target.result);
                const resultBytes = xorProcessBytes(dataBytes, keyBytes);

                if (getSelectedOutputFormat() === 'array') {
                    outputTextarea.value = bytesToHexArray(resultBytes);
                } else {
                    outputTextarea.value = new TextDecoder().decode(resultBytes);
                }
            } catch (e) {
                outputTextarea.value = '文件编码失败: ' + e.message;
            }
        };
        reader.readAsArrayBuffer(file);
    });

    // 解码文件
    decodeFileBtn.addEventListener('click', () => {
        // XOR解码与编码逻辑相同
        encodeFileBtn.click();
    });

    // 下载结果
    // downloadBtn.addEventListener('click', () => {
    //     const output = outputTextarea.value;
    //     const key = keyInput.value;
    //     if (!output) { alert('没有可下载的内容'); return; }

    //     try {
    //         let bytes;
    //         if (getSelectedOutputFormat() === 'array') {
    //             // 从数组格式解析字节
    //             bytes = new Uint8Array(output.split(/,\s*/).map(val => parseInt(val.replace('0x', ''), 16)));
    //         } else {
    //             bytes = new TextEncoder().encode(output);
    //         }

    //         const blob = new Blob([bytes], { type: 'application/octet-stream' });
    //         const url = URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = 'xor_processed.bin';
    //         document.body.appendChild(a);
    //         a.click();
    //         document.body.removeChild(a);
    //         URL.revokeObjectURL(url);
    //     } catch (e) {
    //         alert('下载失败: ' + e.message);
    //     }
    // });
}

// Base64工具渲染和功能
function renderBase64Tool(container) {
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
                <h3>结果</h3>
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
    // const downloadBtn = document.getElementById('download-btn');

    // 编码文件功能
    encodeFileBtn.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('请先选择文件');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // 移除data URL前缀
                const base64String = e.target.result.split(',')[1];
                if (getSelectedOutputFormat() === 'array') {
                    const binaryStr = atob(base64String);
                    const bytes = new Uint8Array(binaryStr.length);
                    for (let i = 0; i < binaryStr.length; i++) {
                        bytes[i] = binaryStr.charCodeAt(i);
                    }
                    outputTextarea.value = bytesToHexArray(bytes);
                } else {
                    outputTextarea.value = base64String;
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
            const encoded = btoa(unescape(encodeURIComponent(text)));
            if (getSelectedOutputFormat() === 'array') {
                // 将Base64字符串转换为字节数组
                const binaryStr = atob(encoded);
                const bytes = new Uint8Array(binaryStr.length);
                for (let i = 0; i < binaryStr.length; i++) {
                    bytes[i] = binaryStr.charCodeAt(i);
                }
                outputTextarea.value = bytesToHexArray(bytes);
            } else {
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
            } else {
                outputTextarea.value = decodedStr;
            }
        } catch (e) {
            outputTextarea.value = '解码失败: 无效的Base64字符串';
        }
    });

    // 清空功能
    clearBtn.addEventListener('click', () => {
        inputTextarea.value = '';
        outputTextarea.value = '';
    });
}

// 事件监听
closeToolButton.addEventListener('click', closeTool);

// 初始化应用
window.addEventListener('DOMContentLoaded', initToolsList);