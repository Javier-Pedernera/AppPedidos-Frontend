import { BrowserRouter,  Routes } from "react-router-dom";
import { renderRoutes, routes } from "./router/index";
// import { Provider } from "react-redux";
// import store from "./Redux/Store/Store";
// import { renderRoutes, routes } from "./routes";


const App = () => {
  return (

    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={Home}/> */}
        {renderRoutes(routes)}
      </Routes>
    </BrowserRouter>
  );
};

export default App;