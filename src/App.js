import "./App.css";
import Home from "./scenes/Home/Home";

function App({ dispatch, default_residents }) {
  return (
    <div className="App">
      <Home dispatch={dispatch} default_residents={default_residents} />
    </div>
  );
}

export default App;
