# Twitchat-Kick Chat Integration

This project integrates Kick chat messages with [Twitchat](https://twitchat.fr) using the OBS WebSocket API. It listens to chat messages from a Kick channel and sends them to OBS as custom events, enabling dynamic interactions during live streams.

**Credit is Appreciated but not required, Happy Streaming!**

[Twitchat](https://twitchat.fr) is developed by Durss, if you would like to, please support them for their amazing work.

## Features

- **Kick Chat Integration**: Reads chat messages from a specified Kick channel.
- **OBS WebSocket Connection**: Sends the Kick Chat messages to Twitchat, enabling easier multi-streaming.
- **Dynamic Messaging**: Supports custom user names, logos and message styles for chat messages.
- **Reconnection Logic**: Automatically attempts to reconnect to OBS WebSocket if the connection is lost.

## Requirements

- [Node.js](https://nodejs.org/) (v16 or higher)
- OBS Studio with [OBS WebSocket Plugin](https://github.com/obsproject/obs-websocket) (v5.0 or higher)
- [@retconned/kick-js](https://www.npmjs.com/package/@retconned/kick-js) library for Kick chat integration
- [obs-websocket-js](https://www.npmjs.com/package/obs-websocket-js) library for OBS WebSocket communication

## Installation

1. Clone the repository (or download the script file directly form [here](./bbeskarkicksender.ts)):
   ```bash
   git clone https://github.com/BlazingBeskar/TwitchatKickSender.git
   cd TwitchatKickSender
   ```

2. Install dependencies:
   ```bash
   npm install obs-websocket-js @retconned/kick-js
   ```

3. Update configuration:
   - Edit the `CONFIG` object in the script to match your OBS WebSocket settings.
   - Enter your Kick channel name in the configuration.
   - Adjust column number to specify where messages appear (defaults to first column).

4. Run the script:
   ```bash
   node your-script-file.ts
   ```

## Code Overview

### OBS WebSocket Configuration
The script connects to OBS Studio using the WebSocket API with the following configuration:

```typescript
        IP: "127.0.0.1",
        PORT: 4455,
        PASSWORD: "your-password",
```

### Message Column Configuration
Set the column number to send the messages into (defaults to first column):

```typescript
DEFAULT_COLUMN: 0,
```

### Kick Chat Configuration
Set up a Kick chat client in read-only mode to listen to chat messages:

```typescript
CHANNEL: "your-channel-name",
```

### Message Color Configuration
Change the color messages form kick chat show as (default is Kick's brand color):

```typescript
DEFAULT_COLOR: "#00FF00",
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
