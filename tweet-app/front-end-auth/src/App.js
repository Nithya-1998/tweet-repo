import './App.css';
import HeaderComponent from './components/containers/header';
import Content from './components/content';

function App() {

  return (

    <div>
      {idleLogout()}
      <HeaderComponent></HeaderComponent>
      <div className="container-fluid mb-5">
        <Content></Content>
      </div>
    </div>
  );
}
export function idleLogout() {
  var t;
  var alertStatus;
  window.onload = resetTimer;
  window.onmousemove = resetTimer;
  window.onmousedown = resetTimer;  // catches touchscreen presses as well      
  window.ontouchstart = resetTimer; // catches touchscreen swipes as well 
  window.onclick = resetTimer;      // catches touchpad clicks as well
  window.onkeydown = resetTimer;
  window.addEventListener('scroll', resetTimer, true); // improved; see comments
  const idleAlert = () => {
    alertStatus = true;
    console.log(alertStatus);
    alert('Screen is idle for more than a minute\nPress Ok to Renew Session');
    window.location.reload();
  }
  function resetTimer() {
    clearTimeout(t);
    t = setTimeout(idleAlert, 100000);
    // time is in milliseconds
  }
  return (alertStatus,
    <div>
      {alertStatus &&
        ''}
    </div>);

}

export default App;
