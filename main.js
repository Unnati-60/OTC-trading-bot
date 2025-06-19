import { BlandWebClient } from 'https://cdn.skypack.dev/bland-client-js-sdk';

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('btn');
    const transcriptDiv = document.getElementById('transcript');
    const statusDiv = document.getElementById('status');
    let blandClient = null;
    let lastRole = null;
    let lastMessageDiv = null;

    function addMessage(content, role = 'system') {
        // Clear empty state if it exists
        const emptyState = transcriptDiv.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        // If same role as last message, concatenate
        if (lastRole === role && lastMessageDiv) {
            const messageText = lastMessageDiv.querySelector('.message-text');
            messageText.innerHTML += '<br>' + content;
        } else {
            // Create new message
            const messageDiv = document.createElement('div');
            messageDiv.className = `transcript-message ${role}`;
            
            let roleDisplay = '';
            if (role === 'user') roleDisplay = 'You:';
            else if (role === 'agent') roleDisplay = 'Assistant:';
            else if (role === 'system') roleDisplay = 'System:';
            else roleDisplay = role + ':';

            messageDiv.innerHTML = `
                <div class="speaker-label">${roleDisplay}</div>
                <div class="message-text">${content}</div>
            `;
            
            transcriptDiv.appendChild(messageDiv);
            lastMessageDiv = messageDiv;
        }
        
        lastRole = role;
        transcriptDiv.scrollTop = transcriptDiv.scrollHeight;
    }

    startBtn.addEventListener('click', async () => {
        try {
            const pathway_id = "289a7f41-f254-4b51-b9eb-5d3cf66fc343";
            
            const res = await fetch(`http://localhost:8000/start-session?pathway_id=${pathway_id}`);
            const data = await res.json();

            if (data.error) {
                addMessage("Error: " + data.error, 'error');
                return;
            }

            const { agent_id, session_token } = data;
            blandClient = new BlandWebClient(agent_id, session_token);

            // Listen for transcripts
            blandClient.on("transcripts", (transcript) => {
                console.log("Received transcript:", transcript);
                
                if (transcript.role && transcript.text) {
                    addMessage(transcript.text, transcript.role);
                } else if (transcript.type && transcript.text) {
                    addMessage(transcript.text, transcript.type);
                } else if (transcript.text) {
                    addMessage(transcript.text, 'agent');
                }
            });

            blandClient.on("conversationStarted", () => {
                console.log("Conversation started");
                addMessage("Conversation started! You can now speak.", 'system');
                statusDiv.classList.add('active');
                startBtn.textContent = "Stop Conversation";
                startBtn.classList.add('stop');
            });

            blandClient.on("agentStartTalking", () => {
                console.log("Agent started talking");
                statusDiv.innerHTML = "🤖 Assistant is speaking...";
            });

            blandClient.on("agentStopTalking", () => {
                console.log("Agent stopped talking");
                statusDiv.innerHTML = "🎤 Listening...";
            });

            blandClient.on("conversationEnded", (data) => {
                console.log("Conversation ended:", data);
                addMessage("Conversation ended", 'system');
                statusDiv.classList.remove('active');
                startBtn.textContent = "Start Conversation";
                startBtn.classList.remove('stop');
                startBtn.onclick = null;
                setTimeout(() => location.reload(), 1000);
            });

            blandClient.on("error", (error) => {
                console.error("Bland client error:", error);
                addMessage(`Error: ${error}`, 'error');
            });

            // Start the conversation
            await blandClient.initConversation({ sampleRate: 44100 });
            
            // Update button functionality
            startBtn.onclick = () => {
                if (blandClient) {
                    blandClient.stopConversation();
                }
            };

        } catch (err) {
            console.error("Failed to start session", err);
            addMessage(`Failed to start session: ${err.message}`, 'error');
        }
    });
});