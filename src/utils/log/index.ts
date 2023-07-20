import pino from 'pino';

export const Log = pino({
  level: 'info',

  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:HH:MM:ss.l',
      levelFirst: true,
      ignore: 'pid,hostname,time'
    }
  }
}).child({ name: 'VITE ROUTER' });
