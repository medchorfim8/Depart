/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// In Claude Code cloud sessions, remotion.media is unreachable, so use the
// preinstalled headless Chromium instead of downloading one.
const CLOUD_HEADLESS_SHELL =
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (process.env.CLAUDE_CODE_REMOTE && require("fs").existsSync(CLOUD_HEADLESS_SHELL)) {
  Config.setBrowserExecutable(CLOUD_HEADLESS_SHELL);
}
