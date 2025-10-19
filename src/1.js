
var active_screen_win = "ws-1"
var scr_1_weburl = ""
var scr_2_weburl = ""

if (document.getElementById("nav-tab")) document.getElementById("nav-tab").style.display = "none"
if (document.getElementById("tab-bar")) document.getElementById("tab-bar").style.display = "none"




const WebView = document.querySelector('webview')

WebView.addEventListener('dom-ready', () => {
  WebView.insertCSS(`
  body:{
    border-radius:15px;
  }
  /* width */
::-webkit-scrollbar {
  width: 10px;
  
}

/* Track */
::-webkit-scrollbar-track {
    margin:10px;
  border-radius: 1px;
  height:100px;
  
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #6E7482; 
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #272A29; 
}
  `);
})





function leftBarOpenTab(){
  // expand the sidebar for hover interactions
  var sidebar = document.getElementById('sidebar')
  if (sidebar) sidebar.style.width = '140px'
  var tabs = document.getElementById('tabs')
  if (tabs) tabs.style.opacity = '1'
}

function TopBarOpen(){
  var screen = document.getElementById('screen')
  if (screen) screen.style.height = 'calc(100vh - 56px)'
  var tb = document.getElementById('topbar')
  if (tb) tb.style.height = '64px'
  if (tb) tb.classList.add('topbar-drag')
}



async function LeftBarClose(){
  var sidebar = document.getElementById('sidebar')
  if (sidebar) sidebar.style.width = '92px'
  var tabs = document.getElementById('tabs')
  if (tabs) tabs.style.opacity = '0.95'
    
}

function TopBarClose(){
  if (AppWinState == "full"){
    var screen = document.getElementById('screen')
    if (screen) screen.style.height = 'calc(100vh - 26px)'
    var tb = document.getElementById('topbar')
    if (tb) tb.style.height = '48px'
    if (tb) tb.classList.remove('topbar-drag')
  }
}

function SplitScreen(){
    var type =  document.getElementById("split-ico").className
    if (type == "off"){
        document.getElementById("split-ico").src = "img/spliton.png"
        document.getElementById("split-ico").className = "on"
        document.getElementById("scr-1").style.width = "49.5%"
        document.getElementById("scr-2").style.width = "49.5%"
        document.getElementById("scr-2").style.display = "block"
        
        return
    }
    if ( type == "on"){
        document.getElementById("split-ico").src = "img/screensplit.png"
        document.getElementById("split-ico").className = "off"
        document.getElementById("scr-1").style.width = "100%"
        document.getElementById("scr-2").style.width = "0%"
        document.getElementById("scr-2").style.display = "none"
        
        return
    }
}






function AddTabs(){
  // Create a new sidebar tab and an associated webview.
  var id = 'tab-' + (document.querySelectorAll('#tabs .tab').length + 1)
  var viewId = 'wv-' + crypto.randomUUID().split('-')[0]

  // sidebar tab element
  var tab = document.createElement('div')
  tab.className = 'tab'
  tab.id = id
  tab.innerHTML = `<img src="img/tabdefault.png" alt="tab">`
  tab.addEventListener('click', function(){ activateTab(id, viewId) })

  document.getElementById('tabs').appendChild(tab)

  // create webview container
  var win = document.createElement('section')
  win.className = 'window'
  win.id = viewId
  win.innerHTML = `<webview id="${viewId}-webview" src="components/homegrimapppage.html" allowpopups></webview>`
  document.getElementById('screen').appendChild(win)

  // activate new tab
  activateTab(id, viewId)
}

function activateTab(tabId, viewId){
  // deactivate sidebar tabs
  document.querySelectorAll('#tabs .tab').forEach(t => t.classList.remove('active'))
  var tab = document.getElementById(tabId)
  if (tab) tab.classList.add('active')

  // hide all windows and show selected
  document.querySelectorAll('#screen .window').forEach(w => {
    if (w.id === viewId) { w.style.display = 'block'; w.style.width = '100%'; }
    else { w.style.display = 'none'; w.style.width = '0%'; }
  })

  // update active_screen_win to point to webview id for controls
  var webviewEl = document.getElementById(viewId + '-webview')
  if (webviewEl) active_screen_win = viewId + '-webview'
}


function BackWeb() {
  
  document.getElementById(active_screen_win).goBack()
}

function NextWeb(){
  
  document.getElementById(active_screen_win).goForward()
}

function ReloadWeb(){
  
  document.getElementById(active_screen_win).reload()
}

function checkFocus() {
  
  var active_win = document.activeElement.id
  if (active_win == "ws-1"){
    active_screen_win = "ws-1"
    updateURLgg()
    document.getElementById("scr-1").style.border =  "1px solid rgba(255, 95, 95, 50%)"
    document.getElementById("scr-2").style.border =  "1px solid black"
    
    return
  }
  if (active_win == "ws-2"){
    active_screen_win = "ws-2"
    updateURLgg()
    document.getElementById("scr-2").style.border =  "1px solid rgba(255, 95, 95, 50%)"
    document.getElementById("scr-1").style.border =  "1px solid black"
    
    return
  }
}

window.setInterval(checkFocus, 100); 



document.getElementById("url-bar").addEventListener("keypress", function(event) {

  if (event.key === "Enter") {

    event.preventDefault();
    var querry = String( document.getElementById("url-bar").value)
    if (querry.startsWith("http://")){
      document.getElementById(active_screen_win).src = querry
      return
    }
    if (querry.startsWith("https://")){
      document.getElementById(active_screen_win).src = querry
      return
    }
    else{
      document.getElementById(active_screen_win).src = "https://www.google.com/search?q="+querry
      return
    }
  }
}); 