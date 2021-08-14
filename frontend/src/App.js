import './App.css';
import Canvas from './components/Canvas';

function App() {

  
  
  return (
    <div className="App">
      <div className="mainContainer" style={{display: 'block'}}>
        <h1 style={{fontSize:'70px', color:'white'}}>Scribble</h1>
      
        <Canvas/>
      </div>
    </div>
  );
}

export default App;
