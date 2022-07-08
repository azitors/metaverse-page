import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  Fragment,
  MouseEvent,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { LoadingView } from './LoadingView';
import RootState from '../../store/rootState';
import { UserState } from '../../../shared/types/UserState';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useDispatch, useSelector } from 'react-redux';
import { UserActions, userSelector } from '../../store/userModule';

type WorldContextValue = {
  userList: UserState[];
  setUserList: Dispatch<SetStateAction<UserState[]>>;
  isReady: boolean;
};

interface Props {
  children: React.ReactNode;
}

export const WorldContext = createContext({} as WorldContextValue);

export const WorldContextProvider: FunctionComponent<Props> = ({ children }) => {
  const [userList, setUserList] = useState<UserState[]>([]);
  const { connected, publicKey } = useWallet();
  const dispatch = useDispatch();

  useEffect(() => {
    if (publicKey) {
      dispatch({ type: 'SET_USER_STATE', state: { address: publicKey.toString() } });
    }
  }, [publicKey]);

  const isReady = connected;

  const contextValue = {
    userList,
    setUserList,
    isReady,
  };

  return (
    <WorldContext.Provider value={contextValue}>
      <WalletMultiButton />
      <Fragment>{connected ? <div>{children}</div> : <LoadingView />}</Fragment>
    </WorldContext.Provider>
  );
};
