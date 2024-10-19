import React from "react";
import styles from "./Navbar.module.css";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Navbar() {
  const { data } = useSession();
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      <h1>Data Dashboard</h1>
      <div className={styles.authButton}>
        {data?.user ? (
          <button onClick={() => signOut()} className={styles.authActionButton}>
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/auth/signin")}
            className={styles.authActionButton}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
