# Home Agent

**Home Agent** is a fun experimental project that lets you control various aspects of your PC via Telegram Bot.  
It is **not intended for serious use**—just a playground for testing ideas and experimenting with automation.

---

## Features

- **Media control**: Play, pause, skip, or go back in your media apps  
- **Desktop control**: Minimize windows, sleep, or shutdown your PC  
- **Mouse actions**: Click, simulate mouse movement  
- **Other experimental features**: Anything else you feel like testing

---

## Stack

- **Bun** – JavaScript runtime  
- **TypeScript** – type-safe scripting  
- **Koffi** – a fast and easy-to-use C FFI module for Node.js
- **Gramio** – Telegram bot framework  
- **Telegram API** – for bot communication

---

## Usage

> **Note:** This project is designed to run as a Windows executable (`.exe`) and should be registered via **Task Scheduler** for background execution with interactive access.  
> It is Windows-only. Make sure to run setup scripts as an administrator.

1. Build your executable (`agent.exe`) using Bun/TS.  
2. Run the provided setup batch file (`setup.bat`) as **Administrator**.  
   - This will:
     - Create `start-agent.vbs` and `stop-agent.vbs` scripts  
     - Register two tasks in Task Scheduler:
       - `HomeAgent` – starts `agent.exe` on user logon, interactive, hides console, prevents duplicate instances  
       - `StopHomeAgent` – stops `agent.exe` manually when needed  
     - Start the HomeAgent immediately  

3. Make sure your .env is configured:

```bash
USER_ID=your_telegram_id
BOT_TOKEN=your_telegram_bot_token
```

4. Interact with the bot via Telegram to control media, desktop, and mouse actions.

5. To stop the agent at any time, run:

```bash
schtasks /Run /TN "StopHomeAgent"
```

Important Notes:

The agent prevents duplicate instances automatically.
Task Scheduler must run tasks under your current user account with administrative rights for full interactive control.
This is an experimental project — use responsibly and avoid sensitive data on the machine.