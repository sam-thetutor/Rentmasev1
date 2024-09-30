import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  FC,
} from "react";
import {
  AuthClient,
  AuthClientCreateOptions,
  AuthClientLoginOptions,
} from "@dfinity/auth-client";
import { canisterId as iiCanId } from "../../../declarations/internet_identity";
import { getAuthClient } from "./nfid";
import { Actor, ActorSubclass, HttpAgent, Identity } from "@dfinity/agent";
import { canisterId, idlFactory } from "../../../declarations/rentmase_backend";
import { _SERVICE, User } from "../../../declarations/rentmase_backend/rentmase_backend.did";
import { _SERVICE as TOKENSERVICE } from "../../../declarations/token/token.did";
import { tokenCanisterId, tokenIDL } from "../constants";
import { useAuthenticateMutation } from "../redux/api/servicesSlice";

const network = process.env.DFX_NETWORK || "local";
const localhost = "http://localhost:4943";
const host = "https://icp0.io";

interface AuthContextType {
  isAuthenticated: boolean | null;
  backendActor: ActorSubclass<_SERVICE> | null;
  tokenCanister: ActorSubclass<TOKENSERVICE> | null;
  identity: Identity | null;
  user: User | null;
  setUser: (user: User) => void;
  login: () => void;
  nfidlogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface DefaultOptions {
  createOptions: AuthClientCreateOptions;
  loginOptions: AuthClientLoginOptions;
}

const defaultOptions: DefaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider:
      network === "ic"
        ? "https://identity.ic0.app/#authorize"
        : `http://${iiCanId}.localhost:4943`,
  },
};

export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [backendActor, setBackendActor] =
    useState<ActorSubclass<_SERVICE> | null>(null);
  const [tokenCanister, setTokenCanister] = useState<ActorSubclass<TOKENSERVICE> | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [
    authenticate
  ] = useAuthenticateMutation();

  useEffect(() => {
    AuthClient.create(options.createOptions).then(async (client) => {
      updateClient(client);
    });
  }, []);

  const login = () => {
    authClient?.login({
      ...options.loginOptions,
      onSuccess: () => {
        updateClient(authClient);
      },
    });
  };

  /************************
   * NFID LOGIN
   **********************/

  const nfidlogin = async () => {
    const authClient = await getAuthClient();
    const isAuthenticated = await authClient.isAuthenticated();
    if (isAuthenticated) {
      updateClient(authClient);
      return;
    }

    await nfidLogin(authClient!);
  };

  const APPLICATION_NAME = "Rentmase";
  const APPLICATION_LOGO_URL =
    "https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg";
  const AUTH_PATH =
    "/authenticate/?applicationName=" +
    APPLICATION_NAME +
    "&applicationLogo=" +
    APPLICATION_LOGO_URL +
    "#authorize";
  const NFID_AUTH_URL = "https://nfid.one" + AUTH_PATH;

  const nfidLogin = async (authClient: AuthClient) => {
    await new Promise((resolve, reject) => {
      authClient.login({
        identityProvider: NFID_AUTH_URL,
        windowOpenerFeatures:
          `left=${window.screen.width / 2 - 525 / 2}, ` +
          `top=${window.screen.height / 2 - 705 / 2},` +
          `toolbar=0,location=0,menubar=0,width=525,height=705`,
        onSuccess: () => {
          setIsAuthenticated(true);
          updateClient(authClient);
        },
        onError: (err) => {
          console.log("error", err);
          reject();
        },
      });
    });

    return authClient.getIdentity();
  };

  async function updateClient(client: AuthClient) {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    setAuthClient(client);

    const _identity = client.getIdentity();
    setIdentity(_identity);

    let agent = await HttpAgent.create({
      host: network === "local" ? localhost : host,
      identity: _identity,
    });

    if (network === "local") {
      agent.fetchRootKey();
    }

    const _tokenCanister: ActorSubclass<TOKENSERVICE> = Actor.createActor(
      tokenIDL,
      {
        agent,
        canisterId: tokenCanisterId,
      }
    );
    setTokenCanister(_tokenCanister);

    const _backendActor: ActorSubclass<_SERVICE> = Actor.createActor(
      idlFactory,
      {
        agent,
        canisterId: canisterId,
      }
    );
    setBackendActor(_backendActor);
  }



  async function logout() {
    await authClient?.logout();
    await updateClient(authClient);
  }

  return {
    isAuthenticated,
    backendActor,
    tokenCanister,
    login,
    logout,
    nfidlogin,
    identity,
    user,
    setUser,
  };
};

interface LayoutProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<LayoutProps> = ({ children }) => {
  const auth = useAuthClient();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
