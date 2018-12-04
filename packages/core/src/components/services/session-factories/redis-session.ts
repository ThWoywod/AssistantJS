import { RedisClient } from "redis";
import { Session } from "../public-interfaces";

export class RedisSession implements Session {
  /**
   * Creates a redis-based session
   * @param id ID of session
   * @param redisInstance Instance of redis handler to use
   * @param maxLifeTime Maximum lifetime of a session
   */
  constructor(public id: string, private redisInstance: RedisClient, private maxLifeTime: number) {}

  public async get(field: string): Promise<string | undefined> {
    return new Promise<string>((resolve, reject) => {
      this.redisInstance.hget(this.documentID, field, (err, value: any) => {
        if (!err) {
          if (value === null || typeof value === "undefined") {
            resolve(undefined);
          } else if (typeof value === "number") {
            resolve(value.toString());
          } else {
            resolve(value);
          }
        } else {
          reject(err);
        }
      });
    });
  }

  public async find(searchName: string) {
    const keys = await this.keys(searchName);
    const result: { [name: string]: string } = {};

    await Promise.all(
      keys.map(async key => {
        const sessionData = this.get(key);
        result[key] = (await sessionData) || "";
        return sessionData;
      })
    );

    return result;
  }

  public async set(field: string, value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.redisInstance.hset(this.documentID, field, value, err => {
        if (!err) {
          resolve();

          // Reset expire counter to maxLifeTime
          this.redisInstance.expire(this.documentID, this.maxLifeTime);
        } else {
          reject(err);
        }
      });
    });
  }

  public delete(field: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.redisInstance.hdel(this.documentID, field, err => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  public deleteAllFields(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.redisInstance.del(this.documentID, (err, response) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  public exists(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.redisInstance.hlen(this.documentID, (err, response) => {
        if (!err) {
          resolve(response > 0);
        } else {
          reject(err);
        }
      });
    });
  }

  public async keys(searchName?: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.redisInstance.hkeys(this.documentID, (err, value) => {
        if (!err) {
          const result = searchName ? value.filter(v => v.includes(searchName)) : value;
          resolve(result);
        } else {
          reject(err);
        }
      });
    });
  }

  private get documentID() {
    return "session-" + this.id;
  }
}
