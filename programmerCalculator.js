// 程序员进制转换工具
export function renderProgrammerCalculator(container) {

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


    const calculator = document.createElement('div');

    // // Add calculator functionality after the existing code
    calculator.innerHTML = `
    <h3 style="margin-top: 2rem;">表达式计算器</h3>
    <input type="text" id="expressionInput" placeholder="输入表达式，如: 0x22 + 0x2" style="width: 100%; margin-bottom: 1rem;">
    <div id="expressionResult" style="min-height: 2rem; padding: 0.5rem;"></div>
`;

    card.appendChild(calculator);

    // Parse different number formats in expressions
    function parseNumber(str) {
        str = str.trim();
        if (str.startsWith('0x') || str.startsWith('0X')) {
            return parseInt(str.substring(2), 16);
        } else if (str.startsWith('0b') || str.startsWith('0B')) {
            return parseInt(str.substring(2), 2);
        } else if (str.startsWith('0o') || str.startsWith('0O')) {
            return parseInt(str.substring(2), 8);
        } else if (str.startsWith('0') && /^[0-7]+$/.test(str)) {
            return parseInt(str, 8);
        } else {
            return parseFloat(str);
        }
    }

    // Convert number back to different formats for display
    function formatResult(num) {
        if (isNaN(num) || !isFinite(num)) {
            return '无效结果';
        }
        
        // For positive numbers, use the original format
        if (num >= 0) {
            const absNum = Math.abs(num);
            const sign = num < 0 ? '-' : '';
            
            return [
                `<strong>十进制:</strong> ${num}`,
                `<strong>十六进制:</strong> ${sign}0x${Math.floor(absNum).toString(16).toUpperCase()}`,
                `<strong>二进制:</strong> ${sign}0b${Math.floor(absNum).toString(2)}`,
                `<strong>八进制:</strong> ${sign}0o${Math.floor(absNum).toString(8)}`
            ].join('<br>');
        }
        
        // For negative numbers, show two's complement representation
        if (num < 0) {
            // 32-bit two's complement
            const twosComplement32 = (0xFFFFFFFF + num + 1) >>> 0;
            const binary32 = twosComplement32.toString(2).padStart(32, '0');
            const octal32 = twosComplement32.toString(8);
            
            // 64-bit two's complement (simplified representation)
            const twosComplement64 = BigInt.asUintN(64, BigInt(num));
            const hex64 = twosComplement64.toString(16).toUpperCase().padStart(16, '0');
            const binary64 = twosComplement64.toString(2).padStart(64, '0');
            const octal64 = twosComplement64.toString(8);
            
            return [
                `<strong>十进制:</strong> ${num}`,
                `<strong>十六进制 (32位补码):</strong> 0x${twosComplement32.toString(16).toUpperCase()}`,
                `<strong>二进制 (32位补码):</strong> 0b${binary32}`,
                `<strong>八进制 (32位补码):</strong> 0o${octal32}`
            ].join('<br>');
        }
    }

    // Evaluate expression
    function evaluateExpression(expr) {
        try {
            // Replace number formats with standard JavaScript numbers
            let processedExpr = expr
                .replace(/0x[0-9a-fA-F]+/g, match => parseNumber(match))
                .replace(/0b[01]+/g, match => parseNumber(match))
                .replace(/0o[0-7]+/g, match => parseNumber(match))
                .replace(/\b0[0-7]+\b/g, match => parseNumber(match));

            // Basic security check - only allow numbers, operators, spaces, and parentheses
            if (!/^[0-9+\-*/(). ]+$/.test(processedExpr)) {
                throw new Error('Invalid characters in expression');
            }

            // Evaluate the expression
            const result = Function('"use strict"; return (' + processedExpr + ')')();
            return result;
        } catch (e) {
            throw new Error('表达式错误: ' + e.message);
        }
    }

    // Handle expression input
    const expressionInput = card.querySelector('#expressionInput');
    const expressionResult = card.querySelector('#expressionResult');

    function updateExpressionResult() {
        const expr = expressionInput.value.trim();
        if (!expr) {
            expressionResult.innerHTML = '';
            return;
        }

        try {
            const result = evaluateExpression(expr);
            expressionResult.innerHTML = formatResult(result);
        } catch (e) {
            expressionResult.innerHTML = `<span style="color: red;">${e.message}</span>`;
        }
    }

    expressionInput.addEventListener('input', updateExpressionResult);
}
