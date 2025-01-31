import OBSWebSocket from 'obs-websocket-js';
import { createClient } from "@retconned/kick-js";

/****************************************************
 * CONFIGURATION SETTINGS
 ****************************************************/
const CONFIG = {
    OBS: {
        IP: "127.0.0.1", // If you are using it locally this should be fine
        PORT: 4455, // Default port for OBS websockets
        PASSWORD: "your-password", // can be found in OBS > Tools > Websocket_Server_Settings > Show_Connect_Info
    },
    KICK: {
        CHANNEL: "your-channel-name", // Your kick channel name
        LOGGER: true, // Don't change these unless you know what you are doing!
        READ_ONLY: true, // Don't change these unless you know what you are doing!
    },
    MESSAGE: {
        DEFAULT_COLOR: "#00FF00", // Chat message color to appear on twitchat (default is kick brand color)
        DEFAULT_AVATAR: "https://www.kick.com/user-avatar.png", // This should stay like this
        DEFAULT_ICON: "kick", // Logo that shows up next to the message
        DEFAULT_STYLE: "message", // Don't change these unless you know what you are doing!
        DEFAULT_COLUMN: 0, // Column number to adjust where messages appear (starts from 0, so 1. column is 0)
    }
};

// OBS WebSocket & Kick Chat Client Initialization
const obs = new OBSWebSocket();
const client = createClient(CONFIG.KICK.CHANNEL, { logger: CONFIG.KICK.LOGGER, readOnly: CONFIG.KICK.READ_ONLY });

/****************************************************
 * OBS WEBSOCKET CONNECTION HANDLING
 ****************************************************/
async function connectToOBS(): Promise<boolean> {
    try {
        await obs.connect(`ws://${CONFIG.OBS.IP}:${CONFIG.OBS.PORT}`, CONFIG.OBS.PASSWORD, { rpcVersion: 1 });
        console.log("Connected to OBS WebSocket.");
        return true;
    } catch (error) {
        console.error("Failed to connect to OBS:", error);
        setTimeout(() => {
            console.log("Retrying connection to OBS...");
            connectToOBS();
        }, 5000);
        return false;
    }
}

/****************************************************
 * SEND MESSAGE TO OBS VIA CUSTOM EVENT
 ****************************************************/
function sendCustomKickChatMessage(messageDetails: {
    message: string;
    user: { name: string; color: string; avatarUrl?: string };
    icon?: string;
    style?: "message" | "highlight" | "error";
    col?: number;
}): void {
    const eventData = {
        origin: "twitchat",
        type: "CUSTOM_CHAT_MESSAGE",
        data: {
            message: messageDetails.message,
            canClose: false,
            user: messageDetails.user,
            icon: messageDetails.icon ?? CONFIG.MESSAGE.DEFAULT_ICON,
            style: messageDetails.style ?? CONFIG.MESSAGE.DEFAULT_STYLE,
            col: messageDetails.col ?? CONFIG.MESSAGE.DEFAULT_COLUMN,
        },
    };

    obs.call("BroadcastCustomEvent", { eventData }).catch((error) => {
        console.error("Error broadcasting custom event to OBS:", error);
    });
}

/****************************************************
 * PROCESS INCOMING CHAT MESSAGES FROM KICK
 ****************************************************/
function handleChatMessage(username: string, content: string) {
    console.log(`New message from ${username}: ${content}`);

    sendCustomKickChatMessage({
        message: content,
        user: {
            name: username,
            color: CONFIG.MESSAGE.DEFAULT_COLOR,
            avatarUrl: CONFIG.MESSAGE.DEFAULT_AVATAR,
        },
        icon: CONFIG.MESSAGE.DEFAULT_ICON,
        style: CONFIG.MESSAGE.DEFAULT_STYLE as "message" | "highlight" | "error",
    });
}

/****************************************************
 * KICK CHAT EVENT LISTENERS
 ****************************************************/
client.on("ready", () => {
    console.log(`Bot ready & connected to Kick channel ${CONFIG.KICK.CHANNEL}!`);
});

client.on("ChatMessage", async (message) => {
    console.log(`${message.sender.username}: ${message.content}`);
    handleChatMessage(message.sender.username, message.content);
});

/****************************************************
 * START CONNECTION & INITIAL MESSAGE
 ****************************************************/
connectToOBS().then(() => {
    handleChatMessage("BBeskarKickSender", "Successfully Connected to Kick Chat!");
});
