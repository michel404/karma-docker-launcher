/*
 * This file contains all the type information needed for a Karma Launcher, and Docker. Due to a
 * lack of official typings, these types and interfaced can be used.
 *
 * They are based on how Karma and Docker appears to be working, and are almost certainly incomplete
 * or incorrect.
 *
 * If ever Karma or Docker release official typings it is best to replace these with those.
 */

/* Karma */

export type CallbackType = 'browser_process_failure' | 'done';

export interface Logger {
  create(name: string): Log;
}

export interface Log {
  debug(...logLine: { toString: () => string }[]): void;

  info(...logLine: { toString: () => string }[]): void;

  warn(...logLine: { toString: () => string }[]): void;

  error(...logLine: { toString: () => string }[]): void;
}

export interface KarmaLauncher {
  name: string;

  start(url: string, id: string): Promise<void>;

  forceKill(): Promise<void>;

  markCaptured(): void;

  isCaptured(): boolean;

  on(callbackType: CallbackType, callbackFunction: () => void): void;
}

/* Docker Engine API */

export interface ContainerData {
  Name: string;
  Config: CreateOptions;
}

export interface CreateOptions {
  Image: string;
}
