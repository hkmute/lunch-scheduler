import "swagger-ui-react/swagger-ui.css";
import SwaggerUI from "swagger-ui-react";
import "./App.css";

function App() {
  return <SwaggerUI url="http://localhost:8080/swagger" />;
}

export default App;
