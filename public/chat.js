const ws = new WebSocket('wss://172.20.49.33:8080'); 
ws.onmessage = (event) => {
    const messagesDiv = document.getElementById('messages');
    const message = document.createElement('div');
    message.textContent = event.data;
    messagesDiv.appendChild(message);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; 
};

const sendMessage = () => {
    const input = document.getElementById('messageInput');
    if (input.value.trim() !== '') {
        ws.send(input.value);
        input.value = ''; 
    }
};

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});