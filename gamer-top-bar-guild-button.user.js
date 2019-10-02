// ==UserScript==
// @name              Bahamut Top Bar Guild Button
// @name:zh-TW        巴哈全站天公會入口按鈕
// @description       Restore Top Bar Guild button on gamer.com.tw
// @description:zh-TW 把全站天公會入口按鈕帶回來
// @namespace         https://greasyfork.org/users/43801
// @author            ycl <https://greasyfork.org/users/43801>
// @version           5
// @grant             none
// @match             *://*.gamer.com.tw/*
// @run-at            document-start
// ==/UserScript==

// init
let initialized = false;

let observer = new MutationObserver(observerCallback);
observerArgs = {
  childList: true,
  attributes: false,
  subtree: true
}
observer.observe(document, observerArgs)

function observerCallback(mutationList, observer){
  if(initialized) return;
  for(let mutation of mutationList){
    for(let node of mutation.addedNodes){
      if(node instanceof Element){
        if(node.classList.contains('TOP-my')){
          getButtonList().insertBefore(createGuildButton(showTopBarMsg), getButtonList().childNodes[0]);
          initialized = true;
        }
      }
    }
  }
}

let guildTopBarClicked = false;

async function showTopBarMsg(e){
  if(guildTopBarClicked)
    return;
  guildTopBarClicked = true;
  initGuildMsgList();
  getGuildTopBar().appendChild(
    createGuildTopBarList(
      await fetchGuildListDOMNodes()
      )
    );
}

function getGuildTopBar(){
  return document.getElementById('topBarMsg_guild');
}

function initGuildMsgList(){
  getGuildTopBar().classList.add('TOP-msg');
  let title = document.createElement('span');
  title.innerText = '公會社團';
  getGuildTopBar().appendChild(title);
}

function createGuildTopBarList(nodes){
  let guildTopBarList = document.createElement('div');
  guildTopBarList.classList.add('TOP-msglist');
  for(let node of nodes){
    if(node instanceof Element){
      let r = getEntryInfo(node);
      guildTopBarList.appendChild(createGuildListEntry(r.url, r.img, r.name));
    }

  }
  return guildTopBarList;
}

function getEntryInfo(element){
  let url = element.getElementsByTagName('a')[0].href
  let img = element.getElementsByTagName('a')[0].firstChild.src
  let name = element.getElementsByTagName('a')[1].innerText;
  return {
    'url': url,
    'img': img,
    'name': name
  };
}

function createGuildListEntry(url, img, name){
  //<div>
  let entry = document.createElement('div');
  { //<a>
    let link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    { //<span class='TOP-msgpic'>
      let toppic = document.createElement('span');
      toppic.classList.add('TOP-msgpic');
      { //<img>
        let pic = document.createElement('img');
        pic.src = img;
        toppic.appendChild(pic);
      }
      link.appendChild(toppic);
    }
    { //<span class='msgname'>
      let msgname = document.createElement('span');
      msgname.classList.add('msgname');
      msgname.innerText = name;
      link.appendChild(msgname);
    }
    entry.appendChild(link);
  }
  return entry;
}

async function fetchGuildListDOMNodes(){
  const resp = await fetch(
    'https://api.gamer.com.tw/ajax/common/topBar.php?type=guild',
    {credentials: 'include'}
  );
  const parser = new DOMParser();
  const dom = parser.parseFromString(await resp.text(), 'text/html');
  return dom.body.childNodes;
}

function fetchGuildListDOMM(){
  fetch('https://api.gamer.com.tw/ajax/common/topBar.php?type=guild',
  {credentials: 'include'})
    .then(resp => resp.text())
    .then( text => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(text, 'text/html');
      return dom.getRootNode();
    }
  )
}

function getTopBar(){
  return document.getElementById('BH-top-data');
}

function getButtonList(){
  return document.getElementsByClassName('TOP-my')[0].getElementsByTagName('ul')[0];
}

function createGuildButton(onclickCallbackFunc){
  var guildButton = document.createElement('li');
  var guildLink = document.createElement('a');
  guildLink.id = 'topBar_guild';
  if(window.location.host=="www.gamer.com.tw"){
    guildLink.classList.add('topbtn3');
  }
  var hrefAtt = document.createAttribute('href');
  hrefAtt.value = "javascript:TOPBAR_show('guild', '')";
  if(window.location.host=="www.gamer.com.tw"){
    hrefAtt.value = "javascript:TOPBAR_show('guild', 'topbtn3', 'topbtn3now')";
  }
  guildLink.attributes.setNamedItem(hrefAtt);
  var guildIcon = document.createElement('img');
  var srcAtt = document.createAttribute('src');
  srcAtt.value = 'https://i2.bahamut.com.tw/top_icon1.png';
  guildIcon.attributes.setNamedItem(srcAtt);
  guildLink.appendChild(guildIcon);
  guildButton.appendChild(guildLink);
  guildButton.addEventListener('click', onclickCallbackFunc);
  guildButton.classList.add('mobilehide');
  return guildButton
}