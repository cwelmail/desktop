/**
 * Ensure the .app is deep ad-hoc signed so Gatekeeper does not report
 * "aeri is damaged" from a broken linker-only signature.
 */
const { execFileSync } = require("node:child_process")
const fs = require("node:fs")
const path = require("node:path")

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== "darwin") return

  const appName = context.packager.appInfo.productFilename
  const appPath = path.join(context.appOutDir, `${appName}.app`)
  if (!fs.existsSync(appPath)) {
    console.warn("[afterPack] app not found:", appPath)
    return
  }

  const entitlements = path.join(context.packager.projectDir, "build", "entitlements.mac.plist")

  // Clear extended attributes that confuse Gatekeeper / codesign
  try {
    execFileSync("xattr", ["-cr", appPath], { stdio: "inherit" })
  } catch {
    /* ignore */
  }

  const args = ["--force", "--deep", "--sign", "-", "--timestamp=none"]
  if (fs.existsSync(entitlements)) {
    args.push("--entitlements", entitlements)
  }
  args.push(appPath)

  console.log("[afterPack] codesign", args.join(" "))
  execFileSync("codesign", args, { stdio: "inherit" })
  execFileSync("codesign", ["--verify", "--deep", "--strict", "--verbose=2", appPath], {
    stdio: "inherit",
  })
}
