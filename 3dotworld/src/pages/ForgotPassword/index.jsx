import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post(
        "https://ecommerce-server-fhna.onrender.com/api/auth/forgot-password",
        { email }
      );

      setMessage(data.message || "Password reset link sent to your email");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={submitHandler} style={styles.card}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <button disabled={loading} style={styles.button}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

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

export default ForgotPassword;
