/* eslint-disable @typescript-eslint/no-var-requires */
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
const nextTranslate = require("next-translate-plugin");

dayjs.extend(utc);
dayjs.extend(timezone);

const nextConfig = nextTranslate({
  env: {
    NEXT_PUBLIC_BUILD_TIMESTAMP: dayjs().tz("America/Montreal").format("[[build time]]: YYYYMMDD-HHmmss"),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  transpilePackages: ["@mui/x-data-grid"],
});

module.exports = nextConfig;
