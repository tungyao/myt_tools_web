// 辅助函数：将字节数组转换为16进制数组格式字符串 (全局可用)
export function bytesToHexArray(bytes, lineLength = 16) {
    return bytes.reduce((acc, byte, index) => {
        const hex = `0x${byte.toString(16).padStart(2, '0').toLowerCase()}`;
        const isNewLine = index > 0 && (index % lineLength === 0);
        return acc + (isNewLine ? ',\n' : index > 0 ? ', ' : '') + hex;
    }, '');
}