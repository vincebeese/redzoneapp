export const logger = {
  info: (obj: unknown, msg?: string) => console.log(msg || obj, typeof obj === 'object' ? obj : ''),
  error: (obj: unknown, msg?: string) => console.error(msg || obj, typeof obj === 'object' ? obj : ''),
  warn: (obj: unknown, msg?: string) => console.warn(msg || obj, typeof obj === 'object' ? obj : ''),
  debug: (obj: unknown, msg?: string) => console.debug(msg || obj, typeof obj === 'object' ? obj : ''),
};
