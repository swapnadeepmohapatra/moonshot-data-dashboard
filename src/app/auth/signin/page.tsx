"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles.module.css";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/");
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form onSubmit={handleLogin}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </div>
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
      <div className={styles.loginLink}>
        <p>
          Do not have an account?{" "}
          <Link href={`/auth/signup?redirect=${searchParams.get("redirect")}`}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
