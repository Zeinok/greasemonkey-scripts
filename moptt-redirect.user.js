// ==UserScript==
// @name                MoPTT redirect
// @name:zh-TW          MoPTT 鄉公所重定向
// @description         Redirect MoPTT to official ptt.cc
// @description:zh-TW   林北就是不想在MoPTT鄉公所上面看
// @namespace           zeinok.mopttredirect
// @match               *://moptt.tw/p/*
// @version             1
// @run-at              document-start
// @grant none
// ==/UserScript==
url = new URL(document.URL);
path = url.pathname.split('/',3)[2];
board = path.split('.',1)[0];
file = path.slice(board.length+1) + '.html';
newURL = 'https://www.ptt.cc/bbs/' + board + '/' + file;
window.location = newURL;

