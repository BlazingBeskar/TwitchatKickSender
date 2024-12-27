# Kick-Twitchat.fr Chat Integration

This project integrates Kick chat messages with OBS Studio using the OBS WebSocket API. It listens to chat messages from a Kick channel and sends them to OBS as custom events, enabling dynamic interactions during live streams.

**Credit is Appreciated but not required, Happy Streaming!**

## Features

- **Kick Chat Integration**: Reads chat messages from a specified Kick channel.
- **Twitchat WebSocket Connection**: Sends custom events to twitchat.fr, enabling on-screen overlays and notifications.
- **Dynamic Messaging**: Supports custom user names, avatars, and message styles for twitchat events.
- **Reconnection Logic**: Automatically attempts to reconnect to twitchat API if the connection is lost.

## Requirements

- [Node.js](https://nodejs.org/) (v16 or higher)
- OBS Studio with [OBS WebSocket Plugin](https://github.com/obsproject/obs-websocket) (v5.0 or higher)
- [@retconned/kick-js](https://www.npmjs.com/package/@retconned/kick-js) library for Kick chat integration
- [obs-websocket-js](https://www.npmjs.com/package/obs-websocket-js) library for OBS WebSocket communication

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BlazingBeskar/TwitchatKickSender.git
   cd TwitchatKickSender
   ```

2. Install dependencies:
   ```bash
   npm install obs-websocket-js @retconned/kick-js
   ```

3. Update configuration:
   - Edit the `ip`, `port`, and `pass` variables in the script to match your OBS WebSocket settings.
   - Replace `blazingbeskar` in `createClient` with your Kick channel name.

4. Run the script

## Code Overview

### OBS WebSocket Configuration
The script connects to OBS Studio using the WebSocket API with the following configuration:

```typescript
const ip: string = "127.0.0.1";
const port: number = 4455;
const pass: string = "your-password";
```

### Kick Chat Client Configuration
Set up a Kick chat client in read-only mode to listen to chat messages:

```typescript
const client = createClient("your-kick-channel", { logger: true, readOnly: true });
```

### Reconnection Logic
The `connect` function handles reconnection attempts to OBS WebSocket if the connection is lost:

```typescript
async function connect(ip: string, port: number, pass: string): Promise<boolean> {
    // Implementation of reconnection logic
}
```

### Chat Message Handling
Incoming chat messages are processed and sent to OBS as custom events:

```typescript
function handleChatMessage(username: string, content: string) {
    // Process the chat message and trigger OBS events
}
```

### Example Logs
When the script runs successfully, you should see logs similar to the following:

```text
Connected to OBS WebSocket.
Bot ready & connected to Kick channel blazingbeskar!
New message from username: Hello, world!
```

---

### Security Notice
- **Do not share** your OBS WebSocket password publicly.
- Replace sensitive details such as passwords and channel names with placeholders when sharing the code.


---

Feel free to contribute by submitting issues or pull requests!
