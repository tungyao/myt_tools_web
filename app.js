// Import tool modules
import { renderBase64Tool } from '/base64Tool.js';
import { renderXorTool } from '/xorTool.js';
// 工具注册表 - 方便后续添加新工具
const tools = [
    {
        id: 'base64',
        name: 'Base64编解码',
        render: renderBase64Tool
    },
    {
        id: 'xor',
        name: 'XOR编码',
        render: renderXorTool
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


// 事件监听
closeToolButton.addEventListener('click', closeTool);

// 初始化应用
window.addEventListener('DOMContentLoaded', initToolsList);