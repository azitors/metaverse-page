import { css } from '@emotion/react';
import { FC } from 'react';
import ReactLoading from 'react-loading';

export const LoadingView: FC = () => (
  <div css={loadingView}>
    <p>Walletを連携してください</p>
    <ReactLoading type="spokes" height={350} width={200} className="loadingIcon" />
  </div>
);

const loadingView = css`
  position: absolute;
  left: 0;
  top: 3rem;
  width: 100vw;
  height: 100vh;
  font-size: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  color: white;
  font-weight: bold;
  background: -moz-linear-gradient(top left, #2193b0, #6dd5ed);
  background: -webkit-linear-gradient(top left, #2193b0, #6dd5ed);
  & > p {
    margin-bottom: 10%;
  }
  & > loadingIcon {
  }
`;
