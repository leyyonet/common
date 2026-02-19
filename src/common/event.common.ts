import { EventCommonLike, EventType } from "./index.types.js";
import { FQN } from "../internal.js";
import { Fnc, LeyyoLike } from "../base/index.js";
import { isText, testCase } from "../function/index.js";
import EventEmitter from "node:events";

const where = `${FQN}.EventCommon`;

// noinspection JSUnusedGlobalSymbols
/**
 * Event common interface
 * */
export class EventCommon<T extends string> implements EventCommonLike<T> {
  private readonly _emitter = new EventEmitter();
  private readonly _listenedEvents: Map<string, Fnc>;
  private readonly _waitingEvents: Map<string, Array<Array<unknown>>>;
  private readonly _removedEvents: Map<string, [number, number]>; // stored, emitted
  private readonly _deactivatedEvents: Set<string>;

  constructor(private leyyo: LeyyoLike) {
    this._listenedEvents = this.leyyo.repoCommon.newMap(`${where}.listenedEvents`);
    this._waitingEvents = this.leyyo.repoCommon.newMap(`${where}.waitingEvents`);
    this._removedEvents = this.leyyo.repoCommon.newMap(`${where}.removedEvents`);
    this._deactivatedEvents = this.leyyo.repoCommon.newSet(`${where}.deactivatedEvents`);
  }

  /** @inheritDoc */
  fork<F extends string>(): EventCommonLike<T | F> {
    return this;
  }

  /** @inheritDoc */
  emit(name: T, ...values: Array<unknown>): boolean {
    if (!isText(name)) {
      throw new this.leyyo.developerError("Invalid event name", testCase(FQN, 130), where);
    }
    if (!this._emitter.emit(name, ...values)) {
      // It is deactivated, no collect it anymore
      if (this._deactivatedEvents.has(name)) {
        return true;
      }

      let item = this._waitingEvents.get(name) as Array<Array<unknown>>;
      if (!item) {
        item = [];
        this._waitingEvents.set(name, item);
      } else if (item.length > 10_000) {
        let parts = this._removedEvents.get(name);
        if (parts === undefined) {
          parts = [item.length, item.length + 1];

          this.leyyo.logger.warn(`Removed message. name: ${name}, times: ${parts[1]}`, {
            where,
            eventName: name,
          });
          item.shift();
          this._removedEvents.set(name, parts);
        } else if (parts[0] >= 10_000) {
          // there are too many events, and there is no any listener, close it
          if (parts[1] > 50_000) {
            this.deactivate(name);
            return false;
          }

          // clear half of it
          parts[0] = 5_000;
          item.splice(0, 5_000);

          parts[1]++; // increment emitted
          this.leyyo.logger.warn(`Removed all messages. name: ${name}, times: ${parts[1]}`, {
            where,
            eventName: name,
          });
        } else {
          parts[1]++; // increment emitted
          item.shift();
        }
      }
      item.push(values);
      return true;
    }
    return true;
  }

  /** @inheritDoc */
  listen<T extends string = string>(name: EventType | T, callback: Fnc): void {
    if (!isText(name)) {
      throw new this.leyyo.developerError("Invalid event name", testCase(FQN, 130), where);
    }
    if (typeof callback !== "function") {
      throw new this.leyyo.developerError(
        `Invalid listener callback [${name}]`,
        testCase(FQN, 131),
        where,
      );
    }

    const exists = this._listenedEvents.has(name);
    if (exists) {
      this._emitter.removeAllListeners(name);
    }
    this._emitter.on(name, callback);

    // if there is a listener, event will be activated automatically

    this.activate(name);
    this._listenedEvents.set(name, callback);
    if (!exists) {
      if (this._waitingEvents.has(name)) {
        this._waitingEvents.get(name).forEach((values) => {
          this._emitter.emit(name, ...values);
        });
        this._waitingEvents.delete(name);
      }
    }
  }

  /** @inheritDoc */
  deactivate(name: string): boolean {
    if (!isText(name)) {
      throw new this.leyyo.developerError("Invalid event name", testCase(FQN, 132), where);
    }
    if (this._waitingEvents.has(name)) {
      this.leyyo.logger.warn(`Deactivated and cleared all messages. name: ${name}`, {
        where,
        eventName: name,
      });
      this._waitingEvents.delete(name);
    }
    if (this._removedEvents.has(name)) {
      this._removedEvents.delete(name);
    }
    if (!this._deactivatedEvents.has(name)) {
      return false;
    }
    this._deactivatedEvents.add(name);
    return true;
  }

  /** @inheritDoc */
  activate(name: string): boolean {
    if (!isText(name)) {
      throw new this.leyyo.developerError("Invalid event name", testCase(FQN, 133), where);
    }
    if (this._deactivatedEvents.has(name)) {
      this._deactivatedEvents.delete(name);
      return true;
    }
    return false;
  }
}
