// src/styles/GlobalStyles.tsx
import { Global } from "@emotion/react";

const GlobalStyles = () => (
  <Global
    styles={`
      /* Reset moderno e box-sizing */
      *, *::before, *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      /* Root e fontes */
      html {
        scroll-behavior: smooth;
        font-size: 16px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      body {
        font-family: 'Google Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: var(--background);
        color: var(--text-color);
        line-height: 1.6;
        min-height: 100vh;
        overflow-x: hidden;
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      /* Variáveis CSS padrão */
      :root {
        --primary-color: #0076c0;
        --primary-hover: #005fa3;
        --avatar-blue: #4285F4;
        --background: #f4f7fa;
        --white: #ffffff;
        --gray: #e2e8f0;
        --dark-gray: #4a5568;
        --text-color: #1a202c;
        --success: #38a169;
        --danger: #e53e3e;
        --warning: #dd6b20;
        --transition-fast: 0.2s ease;
        --transition-slow: 0.4s ease;
        --radius-sm: 0.25rem;
        --radius-md: 0.75rem;
        --radius-lg: 1rem;
        --shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
        --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
        --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
        --shadow-lg: 0 10px 25px rgba(0,0,0,0.3);
        --text-shadow: 0 1px 2px rgba(0,0,0,0.2);
      }

      /* Links */
      a {
        color: var(--primary-color);
        text-decoration: none;
        transition: color var(--transition-fast);
      }
      a:hover, a:focus {
        color: var(--primary-hover);
        outline: none;
      }

      /* Botões padrão */
      button {
        font-family: inherit;
        cursor: pointer;
        border: none;
        border-radius: var(--radius-md);
        padding: 0.6rem 1.2rem;
        background-color: var(--primary-color);
        color: var(--white);
        transition: background-color var(--transition-fast), box-shadow var(--transition-fast);
        user-select: none;
      }
      button:hover, button:focus {
        background-color: var(--primary-hover);
        box-shadow: 0 0 8px var(--primary-hover);
        outline: none;
      }
      button:disabled {
        background-color: var(--gray);
        cursor: not-allowed;
        box-shadow: none;
      }

      /* Inputs, selects, textareas */
      input, select, textarea {
        font-family: inherit;
        font-size: 1rem;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--gray);
        border-radius: var(--radius-sm);
        width: 100%;
        transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        background-color: var(--white);
        color: var(--text-color);
      }
      input::placeholder, textarea::placeholder {
        color: var(--gray);
        opacity: 1;
      }
      input:focus, select:focus, textarea:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(0, 118, 192, 0.3);
        outline: none;
        background-color: var(--white);
      }
      input:disabled, select:disabled, textarea:disabled {
        background-color: #f9fafb;
        color: var(--gray);
        cursor: not-allowed;
      }

      /* Tabelas responsivas e com estilo moderno */
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1.5rem;
        font-size: 0.9rem;
      }
      th, td {
        border: 1px solid var(--gray);
        padding: 0.75rem 1rem;
        text-align: left;
        vertical-align: middle;
      }
      th {
        background-color: var(--primary-color);
        color: var(--white);
        font-weight: 600;
        user-select: none;
      }
      tr:nth-of-type(even) {
        background-color: #edf2f7;
      }
      tr:hover {
        background-color: rgba(0, 118, 192, 0.1);
      }

      /* Scrollbar customizado para webkit browsers */
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      ::-webkit-scrollbar-track {
        background: var(--background);
      }
      ::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 6px;
        transition: background-color var(--transition-fast);
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--primary-hover);
      }

      /* Modais (padrão Chakra UI) */
      .chakra-modal__content {
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-lg);
        transition: all var(--transition-slow);
        background-color: var(--white);
      }

      /* Avatar circular (ex: UserMenu) */
      .user-avatar {
        background-color: var(--avatar-blue);
        color: var(--white);
        border-radius: 9999px;
        font-weight: 700;
        font-size: 1rem;
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        text-shadow: var(--text-shadow);
        box-shadow: var(--shadow-sm);
      }

      /* Menu de usuário estilo Google */
      .user-menu {
        background: var(--white);
        border: 1px solid var(--gray);
        border-radius: var(--radius-md);
        padding: 1.25rem;
        min-width: 240px;
        box-shadow: var(--shadow-md);
        font-family: 'Google Sans', sans-serif;
        transition: all var(--transition-fast);
        user-select: none;
      }

      /* Efeito fade-in */
      .fade-in {
        animation: fadeIn 0.4s ease-in;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Container centralizado para login e formulários */
      .login-container {
        background: var(--white);
        padding: 2rem;
        border-radius: var(--radius-lg);
        max-width: 400px;
        margin: 3rem auto;
        box-shadow: var(--shadow-lg);
      }

      /* Responsividade: tabelas viram blocos */
      @media (max-width: 768px) {
        table, thead, tbody, th, td, tr {
          display: block;
          width: 100%;
        }
        tr {
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--gray);
          padding-bottom: 0.5rem;
        }
        th {
          display: none;
        }
        td {
          padding-left: 50%;
          position: relative;
          text-align: left;
          border: none;
          border-bottom: 1px solid var(--gray);
        }
        td::before {
          position: absolute;
          top: 50%;
          left: 1rem;
          width: 45%;
          white-space: nowrap;
          font-weight: 600;
          transform: translateY(-50%);
          color: var(--dark-gray);
          content: attr(data-label);
        }
      }

      /* === Menu escondido que aparece ao passar o mouse === */
      .menu-group {
        display: inline-block;
        user-select: none;
        margin-right: 30px;
        cursor: pointer;
      }
      .menu-group strong {
        display: block;
      }
      .menu-group .buttons-container {
        display: none;
        flex-direction: column;
        gap: 5px;
        margin-top: 5px;
      }
      .menu-group:hover .buttons-container {
        display: flex;
      }

      .page-center {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* <-- alinhado ao topo */
  align-items: center;
  min-height: 100vh;
  padding: 2rem 1rem; /* aumentei o padding top */
  font-family: 'Google Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--background);
  color: var(--text-color);
}

      .page-center h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
        text-align: center;
      }
      .page-center p {
        font-size: 1.1rem;
        text-align: center;
        max-width: 600px;
        margin-bottom: 2rem;
      }
      .page-center button {
        margin-top: 1rem;
      }

      /* === Fim do menu escondido === */
    `}
  />
);



export default GlobalStyles;
