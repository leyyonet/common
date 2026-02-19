import { Fnc, LeyyoLike } from "../base/index.js";
import { FQN } from "../internal.js";
import { isText, testCase } from "../function/index.js";
import { DeployCommonLike } from "./index.types.js";

const where = `${FQN}.DeployCommon`;

// noinspection JSUnusedGlobalSymbols
/**
 * Deploy common interface
 * */
export class DeployCommon implements DeployCommonLike {
  private _waitingCallbacks: Map<string, Array<Fnc>>;
  private _alreadyDeployed: Map<string, Array<unknown>>;

  constructor(private leyyo: LeyyoLike) {
    this._waitingCallbacks = this.leyyo.repoCommon.newMap<string, Array<Fnc>>(
      `${where}.waitingCallbacks`,
    );
    this._alreadyDeployed = this.leyyo.repoCommon.newMap<string, Array<unknown>>(
      `${where}.alreadyDeployed`,
    );
  }

  /**
   * Wait deploy of a component
   *
   * @param {string} name - name of component
   * @param {function} callback - callback for creator of component, if it completes it, this callback will be called
   * */
  wait(name: string, callback: Fnc): void {
    if (!isText(name)) {
      throw new this.leyyo.developerError("Invalid component name", testCase(FQN, 120), where);
    }
    if (typeof callback !== "function") {
      throw new this.leyyo.developerError(
        `Invalid caller callback [${name}]`,
        testCase(FQN, 121),
        where,
      );
    }
    if (this._alreadyDeployed.has(name)) {
      try {
        callback(...this._alreadyDeployed.get(name));
      } catch (e) {
        new this.leyyo.developerError(
          `Callback error during caller's callback [${name}]`,
          testCase(FQN, 122),
          where,
        ).log(e);
      }
      return;
    }

    if (!this._waitingCallbacks.has(name)) {
      this._waitingCallbacks.set(name, []);
    }
    this._waitingCallbacks.get(name).push(callback);
  }

  /**
   * Complete deploy of a component
   * - It should be called by owner of component
   *
   * @param {string} name - name of component
   * @param {...Array} values - They will be sent to callback of waiting component, {@link #wait}
   * */
  complete(name: string, ...values: Array<unknown>): void {
    if (!isText(name)) {
      throw new this.leyyo.developerError("Invalid component name", testCase(FQN, 123), where);
    }
    const isNew = !this._alreadyDeployed.has(name);
    this._alreadyDeployed.set(name, values);

    if (isNew) {
      if (this._waitingCallbacks.has(name)) {
        const callbacks = this._waitingCallbacks.get(name);
        this._waitingCallbacks.delete(name);
        callbacks.forEach((callback) => {
          try {
            callback(...values);
          } catch (e) {
            new this.leyyo.developerError(
              `Callback error during pending callback [${name}]`,
              testCase(FQN, 124),
              where,
            ).log(e);
          }
        });
      }
    }
  }
}
