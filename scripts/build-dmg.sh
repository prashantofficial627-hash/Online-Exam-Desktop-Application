#!/bin/bash
set -e

rm -rf dist
mkdir -p dist/dmg_temp

ELECTRON_APP="node_modules/electron/dist/Electron.app"
APP_TARGET="dist/dmg_temp/Online Exam Application.app"

ditto "$ELECTRON_APP" "$APP_TARGET"

mkdir -p "$APP_TARGET/Contents/Resources/app"
ditto package.json "$APP_TARGET/Contents/Resources/app/package.json"
ditto app "$APP_TARGET/Contents/Resources/app/app"
ditto pages "$APP_TARGET/Contents/Resources/app/pages"
ditto js "$APP_TARGET/Contents/Resources/app/js"
ditto css "$APP_TARGET/Contents/Resources/app/css"
ditto data "$APP_TARGET/Contents/Resources/app/data"

rm -f "$APP_TARGET/Contents/Resources/default_app.asar"

PLIST="$APP_TARGET/Contents/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleName Online Exam Application" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName Online Exam Application" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier com.onlineexam.app" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :CFBundleExecutable Online Exam Application" "$PLIST"

mv "$APP_TARGET/Contents/MacOS/Electron" "$APP_TARGET/Contents/MacOS/Online Exam Application"

ln -s /Applications dist/dmg_temp/Applications

xattr -cr "$APP_TARGET"
codesign --force --deep --sign - "$APP_TARGET"

hdiutil create -volname "Online Exam Application" -srcfolder dist/dmg_temp -ov -format UDZO dist/Online-Exam-Application.dmg

rm -rf dist/dmg_temp
