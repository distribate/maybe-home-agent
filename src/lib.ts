import { exec } from "child_process";
import koffi from 'koffi';

const lib = koffi.load("user32.dll");

const MOUSEEVENTF_MOVE = 0x0001;
const MOUSEEVENTF_LEFTDOWN = 0x0002;
const MOUSEEVENTF_LEFTUP = 0x0004;

const VK_MEDIA_NEXT = 0xB0;
const VK_MEDIA_PREV = 0xB1;
const VK_MEDIA_PLAY_PAUSE = 0xB3;

const mouse_event = lib.func("__stdcall", "mouse_event", "void", ["uint32", "int32", "int32", "uint32", "uintptr"]);
const keybd_event = lib.func("__stdcall", "keybd_event", "void", ["uint8", "uint8", "uint32", "uintptr"]);

function pressMediaKey(key: number) {
  keybd_event(key, 0, 0, 0);
  keybd_event(key, 0, 2, 0);
}

export const mediaNext = () => pressMediaKey(VK_MEDIA_NEXT);
export const mediaPrev = () => pressMediaKey(VK_MEDIA_PREV);
export const mediaToggle = () => pressMediaKey(VK_MEDIA_PLAY_PAUSE);

export function minimizeAllWindows() {
  exec('powershell -Command "(new-object -com shell.application).MinimizeAll()"', (e) => {
    if (e) console.error(e);
  });
}

export function moveMouse(range = 50, steps = 10) {
  for (let i = 0; i < steps; i++) {
    const dx = Math.floor(Math.random() * (range * 2 + 1)) - range;
    const dy = Math.floor(Math.random() * (range * 2 + 1)) - range;
    mouse_event(MOUSEEVENTF_MOVE, dx, dy, 0, 0);
  }
}

export function clickMouse() {
  mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
  mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
}

export function shutdown() {
  exec("shutdown /l", (e) => {
    if (e) console.error(e);
  });
}

export function sleepPC() {
  exec('powershell -Command "rundll32.exe powrprof.dll,SetSuspendState Sleep"');
}