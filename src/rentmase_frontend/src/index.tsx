import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './hooks/Context';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@nfid/identitykit/react/styles.css"
// @ts-ignore
import { IdentityKitProvider } from "@nfid/identitykit/react"
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { NFIDW, Plug, InternetIdentity, Stoic } from "@nfid/identitykit"


const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <IdentityKitProvider signers={[NFIDW, Plug, InternetIdentity, Stoic]} >
        <AuthProvider>
          <App />
          <ToastContainer />
        </AuthProvider>
      </IdentityKitProvider>
    </Provider>
  );
} else {
  console.error("Root element not found");
}
