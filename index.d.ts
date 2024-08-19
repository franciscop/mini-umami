type ArgOptions = {
  id?: string;
  tracker?: string;
  agent?: string;
  ip?: string;
  language?: string;
  referrer?: string;
  hostname?: string;
  screen?: string;
  data?: { [key: string]: any };
};

declare namespace umami {
  let id: string;
  let tracker: string;
  let agent: string;
  const view: (path: string, options?: ArgOptions) => Promise<void>;
  const event: (name: string, options?: ArgOptions) => Promise<void>;
  const express: (req: any, res: any, next: any) => void;
  const server: (ctx: any) => Promise<void>;
}

export default umami;
