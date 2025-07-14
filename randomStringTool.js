export function renderRandomStringTool(container) {
    container.innerHTML = `
        <div class="tool-card">
            <div class="input-section">
                <h3>随机字符串生成器</h3>
                <div class="length-input">
                    <label for="string-length">字符串长度:</label>
                    <input type="number" id="string-length" min="1" value="16">
                </div>
                <div class="char-options" style="margin-top: 10px;">
                    <label><input type="checkbox" id="include-uppercase" checked> 包含大写字母 (A-Z)</label>
                    <label><input type="checkbox" id="include-lowercase" checked> 包含小写字母 (a-z)</label>
                    <label><input type="checkbox" id="include-numbers" checked> 包含数字 (0-9)</label>
                    <label><input type="checkbox" id="include-special" checked> 包含特殊字符 (!@#$%^&*())</label>
                </div>
                <div class="button-group" style="margin-top: 10px;">
                    <button id="generate-btn">生成随机字符串</button>
                    <button id="copy-btn">复制结果</button>
                    <button id="clear-btn">清空</button>
                </div>
            </div>
            <div class="output-section">
                <h3>结果</h3>
                <textarea id="random-output" readonly placeholder="生成的随机字符串将显示在这里..."></textarea>
            </div>
        </div>
    `;

    // 获取DOM元素
    const lengthInput = document.getElementById('string-length');
    const includeUppercase = document.getElementById('include-uppercase');
    const includeLowercase = document.getElementById('include-lowercase');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSpecial = document.getElementById('include-special');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const outputTextarea = document.getElementById('random-output');

    // 定义字符集
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()';

    // 生成随机字符串
    function generateRandomString() {
        const length = parseInt(lengthInput.value);
        if (isNaN(length) || length < 1) {
            alert('请输入有效的长度');
            return;
        }

        // 构建字符池
        let charPool = '';
        if (includeUppercase.checked) charPool += uppercaseChars;
        if (includeLowercase.checked) charPool += lowercaseChars;
        if (includeNumbers.checked) charPool += numberChars;
        if (includeSpecial.checked) charPool += specialChars;

        if (charPool.length === 0) {
            alert('请至少选择一种字符类型');
            return;
        }

        // 生成随机字符串
        let result = '';
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        for (let i = 0; i < length; i++) {
            result += charPool[array[i] % charPool.length];
        }

        outputTextarea.value = result;
    }

    // 复制到剪贴板
    function copyToClipboard() {
        const text = outputTextarea.value;
        if (!text) {
            alert('没有可复制的内容');
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板');
        }).catch(err => {
            alert('复制失败: ' + err.message);
        });
    }

    // 清空
    function clearOutput() {
        outputTextarea.value = '';
    }

    // 事件监听
    generateBtn.addEventListener('click', generateRandomString);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearOutput);
}