function openSideNav() {
  closeBottomNav();
  document.getElementById("sideDelve").style.width = "500px";
  document.getElementById("sideDelveMain").style.width = "500px";
  document.getElementById("openSideNav").style.width = "0px";
  document.getElementById("main").style.marginRight = "500px";
  //document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  //document.getElementById("main").addEventListener('click', function(){ closeSideNav(); } );
}

function closeSideNav() {
  document.getElementById("sideDelve").style.width = "50px";
  document.getElementById("sideDelveMain").style.width = "0px";
  document.getElementById("openSideNav").style.width = "50px";
  document.getElementById("main").style.marginRight= "50px";
  //document.body.style.backgroundColor = "white";
}

function openBottomNav() {
  closeSideNav();
  document.getElementById("bottomORM").style.height = "500px";
  document.getElementById("bottomORMMain").style.height = "450px";
  document.getElementById("main").style.marginBottom = "500px";
  document.getElementById("bottomNavUp").style.display = "none";
  document.getElementById("bottomNavDown").style.display = "table";
  document.getElementById("ORMframe").contentDocument.location.reload(true);
  var frameElement = document.getElementById("ORMframe");
  frameElement.contentWindow.location.href = frameElement.src;
  //document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  //document.getElementById("main").addEventListener('click', function(){ closeSideNav(); } );
}

function closeBottomNav() {
  document.getElementById("bottomORM").style.height = "50px";
  document.getElementById("bottomORMMain").style.height = "0px";
  document.getElementById("main").style.marginBottom= "50px";
  document.getElementById("bottomNavUp").style.display = "table";
  document.getElementById("bottomNavDown").style.display = "none";
  //document.body.style.backgroundColor = "white";
}

function closeAllNavs() {
  closeSideNav();
  closeBottomNav();
}
