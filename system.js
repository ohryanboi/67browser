// Clock
function updateClock(){
  const now=new Date();
  document.getElementById("clock").textContent=
    now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}
setInterval(updateClock,1000);
updateClock();

