# Dual Space

Dual Space is a personal-use iOS app that creates separate web-app profiles. Each profile opens in its own `WKWebView` data store, so cookies and website sessions stay separate on iOS 17 or later.

## What this can and cannot do

- It can create separate browser-style clones for web apps such as WhatsApp Web, Telegram Web, Gmail, Instagram, X, Facebook, LinkedIn, and custom URLs.
- It can keep separate logins for each clone by using WebKit profile browsing data stores.
- It cannot duplicate installed native iOS apps or run App Store app binaries inside this app. iOS does not allow third-party apps to clone, embed, modify, or launch another installed app as a separate copy.

## Install on your iPhone

1. Install the full Xcode app from the Mac App Store.
2. Open `DualSpace.xcodeproj`.
3. In Xcode, select the `DualSpace` project, then the `DualSpace` target.
4. Under **Signing & Capabilities**, choose your Apple ID team.
5. Change the bundle identifier from `com.personal.dualspace` to something unique, for example `com.yourname.dualspace`.
6. Connect your iPhone with USB or enable wireless debugging.
7. Select your iPhone as the run destination.
8. Press **Run**.
9. On the iPhone, if prompted, go to **Settings > General > VPN & Device Management** and trust your developer profile.

With a free Apple ID, the installed app may need to be refreshed periodically. A paid Apple Developer account gives longer-lived signing and easier device management.

## Build an installable archive

After configuring signing in Xcode:

1. Select **Any iOS Device** as the destination.
2. Choose **Product > Archive**.
3. In Organizer, choose **Distribute App**.
4. Pick **Debugging** or **Custom App** depending on your account and signing options.
5. Export the signed `.ipa`.

The `.ipa` only installs on devices covered by the provisioning profile used during export.
