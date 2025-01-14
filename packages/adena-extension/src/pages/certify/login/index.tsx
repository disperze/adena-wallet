import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Text from '@components/text';
import theme from '@styles/theme';
import Button, { ButtonHierarchy } from '@components/buttons/button';
import DefaultInput from '@components/default-input';
import { useWalletLoader } from '@hooks/use-wallet-loader';
import { useLocation, useNavigate } from 'react-router-dom';
import { RoutePath } from '@router/path';
import { ValidationService } from '@services/index';
import LoadingWallet from '@components/loading-screen/loading-wallet';

const text = 'Enter\nYour Password';

const Wrapper = styled.main`
  ${({ theme }) => theme.mixins.flexbox('column', 'center', 'stretch')}
  width: 100%;
  height: 100%;
`;

export const Title = styled.p`
  ${({ theme }) => theme.fonts.header4};
  margin: 54px 0px 56px;
  white-space: pre-wrap;
  width: 100%;
`;

export const ForgetPwd = styled.button`
  display: inline-block;
  margin-top: 32px;
`;

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [state, , loadWalletByPassword] = useWalletLoader();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [validateState, setValidateState] = useState(true);

  useEffect(() => {
    switch (state) {
      case 'FINISH':
        navigate(RoutePath.Home);
        break;
      default:
        break;
    }
  }, [state]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  useEffect(() => {
    setValidateState(true);
  }, [password]);

  const login = async () => {
    try {
      if (ValidationService.validateWrongPasswordLength(password)) {
        const result = await loadWalletByPassword(password);
        if (result !== 'FINISH') {
          setValidateState(false);
        }
      }
    } catch (e) {
      setValidateState(false);
      console.log(e);
    }
  };

  const onChangePasswordInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    [password],
  );

  const onClickUnLockButton = () => login();

  const onKeyEventUnLockButton = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && location.pathname === '/login') {
      login();
    }
  };

  const onClickForgotButton = () => navigate(RoutePath.EnterSeedPhrase);

  return (
    <Wrapper>
      <Title>{text}</Title>
      <DefaultInput
        type='password'
        placeholder='Password'
        onChange={onChangePasswordInput}
        onKeyDown={onKeyEventUnLockButton}
        error={!validateState}
        ref={inputRef}
      />
      <ForgetPwd onClick={onClickForgotButton}>
        <Text type='body2Reg' color={theme.color.neutral[9]}>
          Forgot Password?
        </Text>
      </ForgetPwd>
      <Button
        fullWidth
        hierarchy={ButtonHierarchy.Primary}
        onClick={onClickUnLockButton}
        margin='auto 0px 0px'
      >
        <Text type='body1Bold'>Unlock</Text>
      </Button>
    </Wrapper>
  );
};
