// @flow

import nacl from 'tweetnacl';
import pokemon from 'pokemon';
import { setConnectUserData } from './index';

export const addConnection = () => (dispatch) => {
  const { publicKey } = nacl.sign.keyPair();

  const nameornym = pokemon.random();
  const userData = {
    publicKey,
    avatar: '',
    nameornym,
  };

  dispatch(setConnectUserData(userData));
};