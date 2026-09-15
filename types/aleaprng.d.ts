declare module "aleaprng" {
  interface Alea {
    (): number;
    restart(): void;
    version: string;
  }

  interface AleaConstructor {
    new (...seeds: Array<string | number>): Alea;
    (...seeds: Array<string | number>): Alea;
  }

  const alea: AleaConstructor;
  export default alea;
}
