import './App.css';
import HeaderComponent from './components/containers/header';
import Content from './components/content';

function App() {
  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <div className="container-fluid mb-5">
        <Content></Content>
      </div>
    </div>
  );
}

export default App;
