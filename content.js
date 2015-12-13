
var j = document.createElement('script');
j.src = chrome.extension.getURL('jquery-1.11.3.min.js');
(document.head || document.documentElement).appendChild(j);

var u = document.createElement('script');
u.src = chrome.extension.getURL('jquery-ui.min.js');
(document.head || document.documentElement).appendChild(u);

var g = document.createElement('script');
g.src = chrome.extension.getURL('gmail.js');
(document.head || document.documentElement).appendChild(g);

var s = document.createElement('script');
s.src = chrome.extension.getURL('main.js');
(document.head || document.documentElement).appendChild(s);