import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './hooks/Context';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// @ts-ignore
import { Provider } from 'react-redux';
import { store } from './redux/store';
// @ts-ignore
import { IdentityKitProvider } from "@nfid/identitykit/react"
import "@nfid/identitykit/react/styles.css"
import { NFIDW, Plug, InternetIdentity, Stoic } from "@nfid/identitykit"

ReactDOM.createRoot(document.getElementById('root')).render(
  <IdentityKitProvider signers={[NFIDW, Plug, InternetIdentity, Stoic]} >
  <AuthProvider>
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  </AuthProvider>
  </IdentityKitProvider>
);
