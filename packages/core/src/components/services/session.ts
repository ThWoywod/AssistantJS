import { Session as SessionInterface } from "./public-interfaces";
import { RedisClient } from "redis";

export class Session implements SessionInterface {
  id: string;
  redisInstance: RedisClient;
  maxLifeTime: number;

  constructor(id: string, redisInstance: RedisClient, maxLifeTime: number) {
    this.id = id;
    this.redisInstance = redisInstance;
    this.maxLifeTime = maxLifeTime;
  }

  async get(field: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.redisInstance.hget(this.documentID, field, (err, value) => {
        if (!err) {
          resolve(value);
        } else {
          reject(err);
        }
      });
    });
  }

  async set(field: string, value: string): Promise<void> {
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

  delete(field: string): Promise<void> {
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

  deleteAllFields():Promise<void> {
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

  private get documentID () {
    return "session-" + this.id;
  }
}