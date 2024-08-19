const defaultTracker = "https://cloud.umami.is/";
// From https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome
const defaultAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";

// Return a default mobile or desktop size depending on the User Agent
// https://stackoverflow.com/a/11381730/938236
function sizeFromUA(ua) {
  if (!ua) return;

  const reg1 =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;

  const reg2 =
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i; // eslint-disable-line no-useless-escape

  return reg1.test(ua) || reg2.test(ua.substr(0, 4)) ? "360x720" : "1920x1080";
}

class Umami {
  constructor() {
    // Bind it so that we can do app.use(umami.express)
    this.express = this.express.bind(this);
    this.server = this.server.bind(this);
  }

  env() {
    const env = {};
    if (typeof process !== "undefined") {
      Object.assign(env, process.env);
    }
    if (typeof Netlify !== "undefined") {
      Object.assign(env, Netlify.env.toObject()); // eslint-disable-line no-undef
    }
    return env;
  }

  async send({ id, tracker, agent, ip, ...opts }) {
    // Get the values from the options, or environment, or defaults
    const env = this.env();
    const website = id || this.id || env.UMAMI_ID || null;
    const host = tracker || this.tracker || env.UMAMI_TRACKER || defaultTracker;
    const userAgent = agent || this.agent || env.UMAMI_AGENT || defaultAgent;

    // Quick check to make sure we always have an ID
    if (!website) return console.error(`Please specify the "id" or UMAMI_ID`);

    const res = await fetch(`${host.replace(/\/$/, "")}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": userAgent,
        "X-Client-IP": ip,
      },
      body: JSON.stringify({ type: "event", payload: { website, ...opts } }),
    }).catch((err) => console.error(err.message));

    if (!res.ok) return console.error("Error: " + (await res.text()));
  }

  async view(url, options) {
    return this.send({ url, ...options });
  }

  async event(name, options) {
    return this.send({ name, ...options });
  }

  // For express use, just do `app.use(umami.express)` and it will start
  // tracking all the views, note that _some_ of the data is faked/approximated
  // for obvious reasons (no screen size in the backend, but guess from device)
  async express(req, _res, next) {
    const env = this.env();
    if (!env.NODE_ENV) console.warn("No environment (NODE_ENV) detected");
    if (env.NODE_ENV !== "production") return next();

    const options = {
      ip: (req.headers["x-forwarded-for"] || "").split(",")[0],
      agent: req.headers["user-agent"],
      language: (req.headers["accept-language"] || "").split(",")[0],
      referrer: req.headers["referer"],
      hostname: req.headers["host"],
      screen: sizeFromUA(req.headers["user-agent"]),
    };
    this.view(req.url, options).then(() => next(), next);
  }

  // For @server/next, you probably don't care about this but I do
  async server(ctx) {
    if (!ctx.machine.production) return;
    if (ctx.headers.referer || ctx.url.pathname.includes(".")) return;

    const options = {
      ip: (ctx.headers["x-forwarded-for"] || "").split(",")[0],
      agent: ctx.headers["user-agent"],
      language: (ctx.headers["accept-language"] || "").split(",")[0],
      referrer: ctx.headers["referer"],
      hostname: ctx.headers["host"],
      screen: sizeFromUA(ctx.headers["user-agent"]),
    };
    return this.view(ctx.url.pathname, options);
  }
}

export { Umami };
export default new Umami();
