import { CallbackData, InlineKeyboard } from "gramio";
import { bot } from "./bot";
import { clickMouse, mediaNext, mediaPrev, mediaToggle, minimizeAllWindows, moveMouse, shutdown, sleepPC } from "./lib";
import { invariant } from "./helpers";

export const MEDIA_CHANNEL = "media"
export const MOUSE_CHANNEL = "mouse"
export const DESKTOP_CHANNEL = "desktop"

/* allowed users for interaction */
export const ALLOWED_USERS = new Set([
  Number(invariant(process.env.USER_ID))
]);

const HANDLERS = new Map<string, Map<string, () => void>>([
  [
    'media',
    new Map(Object.entries({
      toggle: mediaToggle,
      prev: mediaPrev,
      next: mediaNext,
    })),
  ],
  [
    'mouse',
    new Map(Object.entries({
      click: clickMouse,
      simulate: moveMouse,
    })),
  ],
  [
    'desktop',
    new Map(Object.entries({
      minimizeAll: minimizeAllWindows,
      shutdown,
      sleep: sleepPC,
    })),
  ],
])

const cb = new CallbackData('action').string('type');
const mk = (channel: string, action: string) => `${channel} ${action}`;

const keyboard = new InlineKeyboard()
  .text('Prev', cb.pack({ type: mk('media', 'prev') }))
  .text('Toggle', cb.pack({ type: mk('media', 'toggle') }))
  .text('Next', cb.pack({ type: mk('media', 'next') }))
  .row()
  .text('Click', cb.pack({ type: mk('mouse', 'click') }))
  .text('Simulate', cb.pack({ type: mk('mouse', 'simulate') }))
  .row()
  .text('Minimize', cb.pack({ type: mk('desktop', 'minimizeAll') }))
  .text('Shutdown', cb.pack({ type: mk('desktop', 'shutdown') }))
  .text('Sleep', cb.pack({ type: mk('desktop', 'sleep') }));

/* returns true if action found+run, false otherwise. */
const dispatch = (channel: string, action: string): boolean => {
  const ch = HANDLERS.get(channel);
  const fn = ch?.get(action);
  if (!fn) return false;
  fn();
  return true;
};

/* list available actions for a channel (used in replies) */
const actionsFor = (channel: string): string => Array.from(HANDLERS.get(channel)?.keys() ?? []).join(', ');

bot
  .derive(["callback_query", "message"], async (ctx) => {
    const fromId = ctx?.from?.id;
    invariant(fromId, "No from id");
    return { fromId };
  })
  .use(async (ctx, next) => {
    if (ctx.is('callback_query') || ctx.is('message')) {
      if (!ALLOWED_USERS.has(ctx.fromId)) return;
    }

    return next()
  })
  .command('start', (ctx) => ctx.send('Select action', { reply_markup: keyboard }))
  .callbackQuery(cb, async (ctx) => {
    await ctx.answerCallbackQuery()

    const raw = String(ctx.queryData?.type ?? '').trim();
    const [channel, action] = raw.split(/\s+/, 2);

    if (!channel || !action) return ctx.send('Invalid payload');

    const result = dispatch(channel, action)
    if (!result) return ctx.send('Unknown action');
  })
  .command("media", (ctx) => {
    const raw = String(ctx.args ?? '').trim();
    const [action] = raw.split(/\s+/, 1);

    if (!action) return ctx.reply('Define arg for command. toggle, prev, next');

    const result = dispatch('media', action)
    if (result) return ctx.reply('Invalid arg');
  })
  .command('mouse', (ctx) => {
    const raw = String(ctx.args ?? '').trim();
    const [action] = raw.split(/\s+/, 1);

    if (!action) return ctx.reply(`Define arg for command. ${actionsFor('mouse')}`);

    const result = dispatch('mouse', action)
    if (result) return ctx.reply('Invalid arg');
  })
  .command('desktop', (ctx) => {
    const raw = String(ctx.args ?? '').trim();
    const [action] = raw.split(/\s+/, 1);

    if (!action) return ctx.reply(`Define arg for command. ${actionsFor('desktop')}`);

    const result = dispatch('desktop', action)
    if (result) return ctx.reply('Invalid arg');
  });