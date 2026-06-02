#!/bin/sh
set -eu

if [ -z "${DEVELOPMENT_TEAM:-}" ]; then
  echo "Set DEVELOPMENT_TEAM to your Apple Team ID before running."
  echo "Example: DEVELOPMENT_TEAM=ABCDE12345 scripts/build-ipa.sh"
  exit 1
fi

ARCHIVE_PATH="build/DualSpace.xcarchive"
EXPORT_PATH="build/export"

mkdir -p build

xcodebuild \
  -project DualSpace.xcodeproj \
  -scheme DualSpace \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath "$ARCHIVE_PATH" \
  DEVELOPMENT_TEAM="$DEVELOPMENT_TEAM" \
  CODE_SIGN_STYLE=Automatic \
  clean archive

xcodebuild \
  -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$EXPORT_PATH" \
  -exportOptionsPlist ExportOptions.plist \
  DEVELOPMENT_TEAM="$DEVELOPMENT_TEAM"

echo "IPA exported to: $EXPORT_PATH"
