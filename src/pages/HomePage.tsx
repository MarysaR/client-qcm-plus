import { useEffect } from "react";
import { pingServer } from "../services/pingService";

const HomePage = () => {
  useEffect(() => {
    pingServer();
  }, []);

  return (
    <div>
      <h1>Bienvenue sur QCM-PLUS</h1>
    </div>
  );
};

export default HomePage;
