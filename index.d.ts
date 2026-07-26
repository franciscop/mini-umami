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

type ServerRuntime = { production: boolean };

// The @server/next context. Runtime info lives in `ctx.platform`, or in
// `ctx.machine` on versions before the rename, so either one is accepted.
type ServerContext = {
  platform?: ServerRuntime;
  machine?: ServerRuntime;
  headers: { [key: string]: string | string[] | undefined };
  url: { pathname: string };
};

declare namespace umami {
  let id: string;
  let tracker: string;
  let agent: string;
  const view: (path: string, options?: ArgOptions) => Promise<void>;
  const event: (name: string, options?: ArgOptions) => Promise<void>;
  const express: (req: any, res: any, next: any) => void;
  const server: (ctx: ServerContext) => Promise<void>;
}

export default umami;
