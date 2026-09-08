import { BrowserRouter } from "react-router";
import AppLayout from "./layout/AppLayout";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </div>
  );
};

export default App;