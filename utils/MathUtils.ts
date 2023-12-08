const _gcd: any = (a: number, b: number) => (a ? _gcd(b % a, a) : b);

const _lcm = (a: number, b: number) => (a * b) / _gcd(a, b);

export const lcm = (nums: number[]) => nums.reduce(_lcm);
