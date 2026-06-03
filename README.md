# Dual Space

This project now includes a React Native/Expo version at the repository root. The earlier SwiftUI prototype is still present in `DualSpace/` and `DualSpace.xcodeproj`, but production work should use the React Native files:

- `App.tsx`
- `package.json`
- `app.json`
- `eas.json`

Dual Space is a personal-use iOS app that creates separate web-app profiles.

## What this can and cannot do

- It can create separate browser-style clones for web apps such as WhatsApp Web, Telegram Web, Gmail, Instagram, X, Facebook, LinkedIn, and custom URLs.
- In the React Native version, profiles can use the WebView's normal shared storage or private in-memory mode.
- Fully persistent per-profile iOS cookie isolation requires a custom native WebKit bridge because React Native WebView does not expose `WKWebsiteDataStore(forIdentifier:)` directly.
- It cannot duplicate installed native iOS apps or run App Store app binaries inside this app. iOS does not allow third-party apps to clone, embed, modify, or launch another installed app as a separate copy.

## Run on your iPhone with React Native

1. Install the full Xcode app from the Mac App Store.
2. Install JavaScript dependencies:

```sh
npm install
```

3. Generate the native iOS project:

```sh
npm run prebuild
```

4. Open `ios/DualSpace.xcworkspace` in Xcode.
5. Under **Signing & Capabilities**, choose your Apple ID team.
6. Change the bundle identifier in `app.json` from `com.personal.dualspace` to something unique, for example `com.yourname.dualspace`.
7. Connect your iPhone with USB or enable wireless debugging.
8. Select your iPhone as the run destination.
9. Press **Run**.
10. On the iPhone, if prompted, go to **Settings > General > VPN & Device Management** and trust your developer profile.

With a free Apple ID, the installed app may need to be refreshed periodically. A paid Apple Developer account gives longer-lived signing and easier device management.

## Build an installable iOS package

For production or internal testing, use EAS Build:

```sh
npm install
npm install -g eas-cli
eas login
eas build:configure
npm run build:ios
```

Choose an iOS internal distribution profile if you want an installable build for your own registered device.

For local builds after installing full Xcode:

```sh
npm install
npm install -g eas-cli
npm run build:ios:local
```

The generated `.ipa` can only install on devices covered by the provisioning profile used during signing.

## Legacy SwiftUI Archive

The old SwiftUI project can still be archived from Xcode:

1. Select **Any iOS Device** as the destination.
2. Choose **Product > Archive**.
3. In Organizer, choose **Distribute App**.
4. Pick **Debugging** or **Custom App** depending on your account and signing options.
5. Export the signed `.ipa`.

The `.ipa` only installs on devices covered by the provisioning profile used during export.

## Build from Terminal

After installing the full Xcode app and signing in with your Apple ID, you can also export an `.ipa` from Terminal:

```sh
chmod +x scripts/build-ipa.sh
DEVELOPMENT_TEAM=YOUR_TEAM_ID scripts/build-ipa.sh
```

The exported package will be in `build/export`.
