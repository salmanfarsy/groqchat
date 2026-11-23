const chatInput = document.getElementById('chat-text');
const messagesBox = document.getElementById('messages');

function addMessage(sender, text) {
  const p = document.createElement('p');
  p.className = sender; // 'user' or 'bot' for easy CSS styling
  p.textContent = text;
  messagesBox.appendChild(p);
  messagesBox.scrollTop = messagesBox.scrollHeight; // Auto-scroll to latest message
}




const debate = document.getElementById('send-debate');

debate.addEventListener('click', async () => {
  const topic = chatInput.value.trim();
  if (!topic) return;

  // 1. Show the debate topic & a quick loading status since 8 API calls take ~3-4s
  addMessage('user', `Debate Topic: ${topic}`);
  addMessage('system', 'Please wait.. Nova and Rex are debating...');
  chatInput.value = '';
  debate.disabled = true;

  // 2. Hit your /debate backend route
  const response = await fetch('/debate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })
  });

  const data = await response.json();

  // 3. Remove the loading line and render each bot's turn in order
  messagesBox.lastElementChild.remove();
  data.transcript.forEach((turn) => {
    addMessage(turn.speaker.toLowerCase(), `${turn.speaker}: ${turn.text}`);
  });

  debate.disabled = false;
});