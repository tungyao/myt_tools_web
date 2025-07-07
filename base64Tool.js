// base64Tool.js

// Helper function to convert bytes to hex array
function bytesToHexArray(bytes) {
    const hexArray = [];
    bytes.forEach(byte => {
        const hex = byte.toString(16).padStart(2, '0');
        hexArray.push(hex);
    });
    return hexArray;
}

function renderBase64Tool(container) {
    container.innerHTML = `
        <h2>Base64 Encoder/Decoder and File Encoder</h2>
        <div>
            <label for="base64-input-text">Text Input:</label>
            <textarea id="base64-input-text" rows="4" cols="50"></textarea>
        </div>
        <div>
            <button id="encode-text-button">Encode Text to Base64</button>
            <button id="decode-text-button">Decode Base64 to Text</button>
        </div>
        <div>
            <label for="base64-output-text">Output:</label>
            <textarea id="base64-output-text" rows="4" cols="50" readonly></textarea>
        </div>
        <hr>
        <div>
            <label for="file-input">Select File:</label>
            <input type="file" id="file-input">
        </div>
        <div>
            <button id="encode-file-button">Encode File to Base64</button>
        </div>
        <div>
            <label for="file-output-text">File Output (Base64):</label>
            <textarea id="file-output-text" rows="4" cols="50" readonly></textarea>
        </div>
        <div>
            <label for="hex-output-text">File Output (Hex Array):</label>
            <textarea id="hex-output-text" rows="4" cols="50" readonly></textarea>
        </div>
    `;

    const inputTextarea = container.querySelector('#base64-input-text');
    const outputTextarea = container.querySelector('#base64-output-text');
    const encodeTextButton = container.querySelector('#encode-text-button');
    const decodeTextButton = container.querySelector('#decode-text-button');

    const fileInput = container.querySelector('#file-input');
    const encodeFileButton = container.querySelector('#encode-file-button');
    const fileOutputTextarea = container.querySelector('#file-output-text');
    const hexOutputTextarea = container.querySelector('#hex-output-text');

    encodeTextButton.addEventListener('click', () => {
        const text = inputTextarea.value;
        outputTextarea.value = btoa(text);
    });

    decodeTextButton.addEventListener('click', () => {
        const base64 = inputTextarea.value;
        try {
            outputTextarea.value = atob(base64);
        } catch (e) {
            outputTextarea.value = 'Error decoding Base64.';
        }
    });

    encodeFileButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                fileOutputTextarea.value = base64String;

                const bytes = new Uint8Array(reader.result.split(',')[0].split(';base64,')[1] ? Uint8Array.from(atob(reader.result.split(',')[0].split(';base64,')[1]), c => c.charCodeAt(0)) : []);
                hexOutputTextarea.value = bytesToHexArray(bytes).join(' ');
            };

            reader.onerror = (error) => {
                fileOutputTextarea.value = 'Error reading file.';
                hexOutputTextarea.value = '';
                console.error('Error reading file:', error);
            };

            reader.readAsDataURL(file);
        } else {
            fileOutputTextarea.value = 'No file selected.';
            hexOutputTextarea.value = '';
        }
    });
}