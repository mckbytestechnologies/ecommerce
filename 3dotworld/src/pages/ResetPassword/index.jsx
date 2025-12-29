import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      const { data } = await axios.post(
        `https://ecommerce-server-fhna.onrender.com/api/auth/reset-password/${token}`,
        { password }
      );

      setMessage(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid or expired token");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={submitHandler} style={styles.card}>
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button style={styles.button}>Reset Password</button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: { display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" },
  card: { width: 350, padding: 20, boxShadow: "0 0 10px #ccc", borderRadius: 8 },
  input: { width: "100%", padding: 10, marginBottom: 15 },
  button: { width: "100%", padding: 10 }
};

export default ResetPassword;
