export interface ICacheRedisInterface {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  delete<T>(key: string): Promise<void>;
  deleteByPattern(pattern: string): Promise<void>;
};