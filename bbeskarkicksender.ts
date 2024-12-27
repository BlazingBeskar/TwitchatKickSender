import OBSWebSocket from 'obs-websocket-js';
import { createClient } from "@retconned/kick-js";

// OBS WebSocket Configuration
const ip: string = "127.0.0.1"; // OBS WebSocket IP
const port: number = 4455; // OBS WebSocket Port
const pass: string = "your-password"; // OBS WebSocket Password
const obs = new OBSWebSocket();

// Kick Chat Client Configuration
const client = createClient("your-kick-channel", { logger: true, readOnly: true }); // Use readOnly mode (no login required)

/**
 * Connect to OBS WebSocket with reconnection logic.
 */
async function connect(ip: string, port: number, pass: string): Promise<boolean> {
    try {
        await obs.connect(`ws://${ip}:${port}`, pass, { rpcVersion: 1 });
        console.log("Connected to OBS WebSocket.");
        return true;
    } catch (error) {
        console.error("Failed to connect to OBS:", error);
        setTimeout(() => {
            console.log("Retrying connection to OBS...");
            connect(ip, port, pass); // Reconnect after 5 seconds
        }, 5000);
        return false;
    }
}

/**
 * Send a user message from Kick chat to Twitchat interface with dynamic user and message parameters
 */
function sendCustomKickChatMessage(messageDetails: {
    message: string;
    user: { name: string; color: string; avatarUrl?: string };
    icon?: string;
    style?: "message" | "highlight" | "error";
    col?: number;
}): void {
    const eventData = {
        origin: "twitchat", // Keep it as Twitchat since you're using their API
        type: "CUSTOM_CHAT_MESSAGE",
        data: {
            message: messageDetails.message,
            canClose: false,  // Remove the close button
            user: messageDetails.user,
            icon: messageDetails.icon ?? "kick", // Set the icon to something indicative of Kick
            style: messageDetails.style ?? "message", // Normal message style (no highlights)
            col: messageDetails.col ?? 0, //Specify the column number the message goes to. Default 0(first)
        },
    };

    obs.call("BroadcastCustomEvent", { eventData }).catch((error) => {
        console.error("Error broadcasting custom event to OBS:", error);
    });
}

/**
 * Handle incoming chat messages from Kick and send to OBS via the sendCustomKickChatMessage function
 */
function handleChatMessage(username: string, content: string) {
    console.log(`New message from ${username}: ${content}`);

    // Send the message to the sendCustomKickChatMessage function
    const user = {
        name: username,
        color: "#00FF00",  // Default color
        avatarUrl: "https://www.kick.com/user-avatar.png",
    };

    sendCustomKickChatMessage({
        message: content,
        user: user,
        icon: "kick", // Custom icon for Kick
        style: "message", // Normal message style
    });
}

// Listen for chat messages from Kick (no login required since we're using `readOnly: true`)
client.on("ready", () => {
    console.log(`Bot ready & connected to Kick channel ${client.user?.tag}!`);
});

// Event listener for new chat messages
client.on("ChatMessage", async (message) => {
    // Process the chat message
    console.log(`${message.sender.username}: ${message.content}`);

    // Handle the chat message
    handleChatMessage(message.sender.username, message.content);
});

// Connect to OBS WebSocket and send an initial message
connect(ip, port, pass).then(() => {
    // Example of sending a dynamic message to Kick chat through OBS
    const username = "BBeskarKickSender";
    const message = "Succesfully Connected to Kick Chat!";
    handleChatMessage(username, message);  // Call with username and message parameters
});
