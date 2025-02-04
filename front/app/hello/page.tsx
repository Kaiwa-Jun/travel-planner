"use client";
import { useEffect, useState } from "react";

export default function HelloPage() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchHello = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/v1/hello");
        const data = await response.text();
        setMessage(data);
      } catch (error) {
        console.error("Error fetching hello:", error);
        setMessage("エラーが発生しました");
      }
    };

    fetchHello();
  }, []);

  return (
    <div>
      <h1>Hello Page</h1>
      <p>{message}</p>
    </div>
  );
}
