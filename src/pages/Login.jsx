import React from "react";
import "../styles/login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="phone-frame">
        <div className="login-topbar">Playscope</div>

        <div className="login-overlay">
          <div className="logo-area">
            <div className="logo-icon">🎮</div>
            <h1 className="logo-text">
              Play<span>scope</span>
            </h1>
          </div>

          <form className="login-form">
            <input
              type="email"
              placeholder="Digite o seu E-Mail"
              className="login-input"
            />

            <input
              type="password"
              placeholder="Digite a sua senha"
              className="login-input"
            />

            <button type="button" className="forgot-password">
              Esqueceu a senha?
            </button>

            <button type="submit" className="login-button">
              Login
            </button>

            <p className="register-text">
              Não possui uma conta?
              <br />
              <span>Cadastre-se</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;