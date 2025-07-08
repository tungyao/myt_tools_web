// 程序员进制转换工具
function renderProgrammerCalculator(container) {

    container.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'tool-card';

    const title = document.createElement('h3');
    title.textContent = '进制转换器';
    card.appendChild(title);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '输入数字或字符串';
    input.style.width = '100%';
    input.style.marginBottom = '1rem';
    card.appendChild(input);

    const resultDiv = document.createElement('div');
    card.appendChild(resultDiv);

    function formatNumber(n) {
        return [
            `<strong>二进制:</strong> ${n.toString(2)}`,
            `<strong>八进制:</strong> ${n.toString(8)}`,
            `<strong>十进制:</strong> ${n.toString(10)}`,
            `<strong>十六进制:</strong> ${n.toString(16).toUpperCase()}`
        ].join('<br>');
    }

    function formatChar(c) {
        const code = c.charCodeAt(0);
        return `<span style="display:inline-block;margin-right:1.5em;">'${c}'` +
            `<br><small>二进制: ${code.toString(2)}</small>` +
            `<br><small>八进制: ${code.toString(8)}</small>` +
            `<br><small>十进制: ${code}</small>` +
            `<br><small>十六进制: ${code.toString(16).toUpperCase()}</small></span>`;
    }

    function updateResult() {
        const val = input.value.trim();
        if (!val) {
            resultDiv.innerHTML = '';
            return;
        }
        // 进制识别：0x/0X开头为16进制，0b/0B为2进制，0开头为8进制，纯数字为10进制
        // 但 011 现代JS视为10进制，只有0o/0O才是8进制
        // 011 视为二进制（兼容你的需求）
        let n = null, matched = false;
        if (/^0x[0-9a-fA-F]+$/.test(val)) {
            n = parseInt(val, 16);
            matched = true;
        } else if (/^0b[01]+$/.test(val)) {
            n = parseInt(val.replace(/^0b+/, ''), 2);
            matched = true;
        } else if (/^0o[0-7]+$/.test(val)) {
            n = parseInt(val.replace(/^0o+/, ''), 8);
            matched = true;
        } else if (/^0\d+$/.test(val)) {
            // 0开头且全为数字，视为二进制（如011）
            n = parseInt(val, 2);
            matched = true;
        } else if (/^-?\d+$/.test(val)) {
            n = parseInt(val, 10);
            matched = true;
        }
        if (matched) {
            resultDiv.innerHTML = `<div style='margin-bottom:1em;'>${formatNumber(n)}</div>`;
        } else {
            // 处理字符串, 按字符切分, 空格隔开
            let html = '';
            for (const c of val) {
                if (c === ' ') {
                    html += '<span style="margin-right:2em;"></span>';
                } else {
                    html += formatChar(c);
                }
            }
            resultDiv.innerHTML = `<div style='display:flex;flex-wrap:wrap;gap:1em;'>${html}</div>`;
        }
    }

    input.addEventListener('input', updateResult);
    container.appendChild(card);
}
