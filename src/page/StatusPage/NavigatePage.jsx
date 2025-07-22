import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function NavigatePage() {
  const token = localStorage.getItem("sessionToken");
  const navigate = useNavigate();
  const called = useRef(false); //Flag to prevent call API more than 1 time

  const navigateResultPayment = async () => {
    const resultUrl = window.location.href;

    try {
      const response = await fetch(
        `http://localhost:8080/api/payments/callback?url=${encodeURIComponent(
          resultUrl
        )}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.ok) {
        const data = await response.text();

        if (data === "SUCCESS") {
          navigate("/SUCCESS");
        } else {
          navigate("/ERROR");
        }
      } else {
        navigate("/ERROR");
      }
    } catch (error) {
      console.error("Lỗi gọi callback:", error);
      navigate("/ERROR");
    }
  };

  useEffect(() => {
    if (!called.current) {
      called.current = true;
      navigateResultPayment();
    }
  }, []);

  return null;
}
