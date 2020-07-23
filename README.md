# WebBlock
A better website blocker for chrome

---
### Features
* Ultra fast blocking - see for yourself
* Pick up where you left off - when you turn blocking off, blocked tabs will be redirected to where you were going initially
* Import URLs from file
* Unblock for periods of time
* Custom redirection
* As many lists as you want!

### Build
```shell script
tsc
cp -R src/* built/
rm built/*.ts
```
Now the `./built/` can be used as an extension, 
either from Load Unpacked or by zipping it and publishing to the Chrome Web Store 