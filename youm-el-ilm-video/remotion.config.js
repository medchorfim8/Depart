const {Config} = require('@remotion/cli/config');
const fs = require('fs');

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// In Claude Code cloud sessions, remotion.media is unreachable, so use the
// preinstalled headless Chromium instead of downloading one.
const CLOUD_HEADLESS_SHELL = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (process.env.CLAUDE_CODE_REMOTE && fs.existsSync(CLOUD_HEADLESS_SHELL)) {
  Config.setBrowserExecutable(CLOUD_HEADLESS_SHELL);
}
