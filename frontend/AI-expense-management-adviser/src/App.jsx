import { BrowserRouter } from "react-router";
import AppLayout from "./layout/AppLayout";
import {Toaster} from "react-hot-toast";

const App = () => {
  return (
    <div className="App">
      <Toaster />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </div>
  );
};

export default App;