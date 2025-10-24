import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const KommPakt = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/home");
  }, [navigate]);

  return null;
};

export default KommPakt;
