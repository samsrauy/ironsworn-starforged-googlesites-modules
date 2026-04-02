These Javascript files handle all of the basic interconnections between the modules (i.e., the iframes that you use to customize your layout).<br><br> The ```datasworn.js``` functions like "include.h" if you're familiar with C programming. Any changes to rsek's datasworn repo can be fixed here (I just have to know about them).
The calls in datasworn.js allow for this repo to connect to rsek's repo without any action on the part of anyone (I guess except for me if rsek changes the repo). You can think of this as the configuration for this whole thing.
<br><br>
The ```sync.js``` file is where the interconnections between each of the modules, Code.gs, and your Google Sheet happens. Because you're writing in realtime-ish to your Google Sheet spreadsheet, you can potentially run into a activity wall if you try to write too often. To prevent this, this file also controls
a sync cadence with each file providing a random "jitter" to avoid looking like your Google Sheet is being attacked.
