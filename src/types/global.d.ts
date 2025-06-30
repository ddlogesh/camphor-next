export {};

declare global {
  interface Calc {
    goAdd: (a: number, b: number) => number;
    goSubtract: (a: number, b: number) => number;
    goMultiply: (a: number, b: number) => number;
    goDivide: (a: number, b: number) => number;
    loaded: boolean;
  }
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Go: any;
    calc: Calc;
  }
}
