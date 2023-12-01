declare global {
  interface ObjectConstructor {
    /**
     * Same exact functionality as Object.keys(), 
     * but types the values to be the exact keys
     * of the object  as const instead of `string`;
     */
    typedKeys<T>(obj: T): Array<keyof T>;
  }
}

Object.typedKeys = Object.keys as any;

export {};
