# WebBlock
A better website blocker for chrome

---
### How it Works
* In options page, add website urls you want to block (specifically, the website prefix, so include the `https://www.`)
* In the textarea, add a message you want to see when you visit a blocked website. This could be a motivational quote, a list of other things to do, or any HTML.
* Now, when you visit a blocked site, you will have to wait 2 minutes to access that site. You will also see the message you wrote in the textbox. After 2 minutes, the extension will start blocking again in 60 minutes.
  * 2 minutes and 60 minutes are defaults configurable in the options page
  * If you click away from the page, the tab will close
  * After the 60 minutes are up, all tabs on your blocked list will close

### Why it Works
The idea is very simple: increase the "cost" of going to the websites that you block. 
By effectively forcing you to do nothing for 2 minutes (and with the prompts that you write for yourself), 
you start to think about what else you could be doing instead, and the prospect of doing those things becomes
attractive compared to doing nothing for the next 2 minutes. If you click away to do something else,
the blocked tab will close to help you focus. It reblocks in 60 minutes and closes all tabs that should be blocked so
you never go on a blocked site "binge".
### Build
```shell script
pnpm install
pnpm run build
```
Now the `./dist/` folder can be used as an extension, 
either from Load Unpacked or publishing the zipped file to the Chrome Web Store 