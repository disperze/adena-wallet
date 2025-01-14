import React from 'react';
import styled from 'styled-components';
import Portal from '@layouts/portal';
import logo from '../../assets/logo-withIcon.svg';
import cancel from '../../assets/cancel-large.svg';
import lock from '../../assets/lock.svg';
import restore from '../../assets/restore.svg';
import help from '../../assets/help-fill.svg';
import statusCheck from '../../assets/check-circle.svg';
import Text from '@components/text';
import { useMatch, useNavigate } from 'react-router-dom';
import { RoutePath } from '@router/path';
import { useCurrentAccount } from '@hooks/use-current-account';
import { SessionStorageValue } from '@common/values';
import { useWalletLoader } from '@hooks/use-wallet-loader';
import { formatAddress, formatNickname } from '@common/utils/client-utils';
import { useWalletAccounts } from '@hooks/use-wallet-accounts';
import { useWallet } from '@hooks/use-wallet';
import plus from '../../assets/plus.svg';
import theme from '@styles/theme';
import Icon from '@components/icons';

interface SubMenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: (e: React.MouseEvent) => void;
  selector?: string;
}

const RestoreWallet = ({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick}>
    <img src={restore} alt='restore wallet' />
    <Text type='body2Reg'>Restore Wallet</Text>
  </Button>
);

const LockWallet = ({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick}>
    <img src={lock} alt='lock wallet' />
    <Text type='body2Reg'>Lock Wallet</Text>
  </Button>
);

const SubMenu: React.FC<SubMenuProps> = ({ open, setOpen, onClick, selector = 'portal-root' }) => {
  const login = useMatch(RoutePath.Login);
  const navigate = useNavigate();
  const [wallet] = useWallet();
  const [, loadWallet] = useWalletLoader();
  const [currentAccount, , changeCurrentAccount] = useCurrentAccount();
  const [walletAccounts] = useWalletAccounts(wallet);

  const addAccountHandler = () => {
    setOpen(false);
    navigate(RoutePath.AddAccount);
  };

  const restoreClickHandler = () => {
    setOpen(false);
    navigate(RoutePath.EnterSeedPhrase);
  };

  const lockClickHandler = async () => {
    setOpen(!open);
    await SessionStorageValue.claer();
    await loadWallet();
    navigate(RoutePath.Login, { replace: true });
  };

  const helpSupportButtonClick = () =>
    window.open('https://docs.adena.app/resources/faq', '_blank');

  const changeAccountHandler = async (addr: string) => {
    await changeCurrentAccount(addr);
    setOpen(false);
    navigate(RoutePath.Wallet);
  };

  return (
    <Portal selector={selector}>
      <Overlay open={open}>
        <Dim onClick={() => setOpen(false)} />
        <Container open={open}>
          <Header>
            <img src={logo} alt='adena logo' />
            <button type='button' onClick={onClick}>
              <Icon name='iconCancel' />
            </button>
          </Header>
          {!login && currentAccount && (
            <Body>
              <ListWrapper>
                {walletAccounts &&
                  walletAccounts.length > 0 &&
                  walletAccounts.map((v, i) => (
                    <ListItem key={i} onClick={() => changeAccountHandler(v.data.address)}>
                      <Text type='body2Reg' display='inline-flex'>
                        {formatNickname(v.data.name, 10)}
                        <Text type='body2Reg' color={theme.color.neutral[9]}>
                          {` (${formatAddress(v.data.address)})`}
                        </Text>
                      </Text>
                      {currentAccount.getAddress() === v.getAddress() && (
                        <img src={statusCheck} alt='status icon' />
                      )}
                    </ListItem>
                  ))}
              </ListWrapper>
              <AddAccountBtn onClick={addAccountHandler}>
                <Text type='body2Bold'>Add Account</Text>
              </AddAccountBtn>
            </Body>
          )}
          <Footer>
            {login ? (
              <RestoreWallet onClick={restoreClickHandler} />
            ) : (
              <LockWallet onClick={lockClickHandler} />
            )}
            <Button onClick={helpSupportButtonClick}>
              <img src={help} alt='help and support' />
              <Text type='body2Reg'>Help &#38; Support</Text>
            </Button>
          </Footer>
        </Container>
      </Overlay>
    </Portal>
  );
};

const Container = styled.div<{ open: boolean }>`
  ${({ theme }) => theme.mixins.flexbox('column', 'center', 'space-between')}
  background-color: ${({ theme }) => theme.color.neutral[7]};
  position: fixed;
  top: 0px;
  left: ${({ open }) => (open ? '0px' : '-100%')};
  width: 270px;
  height: 100%;
  z-index: 99;
  transition: left 0.4s ease;
`;

const Header = styled.div`
  ${({ theme }) => theme.mixins.flexbox('row', 'center', 'space-between')};
  background-color: ${({ theme }) => theme.color.neutral[8]};
  padding: 0px 20px;
  width: 100%;
  height: 50px;
  & > button {
    ${({ theme }) => theme.mixins.flexbox('row', 'center', 'center')};
    width: 14px;
    height: 14px;
    svg {
      width: 14px;
      height: 14px;
      * {
        stroke: ${({ theme }) => theme.color.neutral[9]};
      }
    }
  }
`;

const Footer = styled.div`
  width: 100%;
`;

const Button = styled.button`
  ${({ theme }) => theme.mixins.flexbox('row', 'center', 'flex-start')}
  width: 100%;
  height: 48px;
  padding: 0px 20px;
  background-color: ${({ theme }) => theme.color.neutral[8]};
  & + & {
    border-top: 1px solid ${({ theme }) => theme.color.neutral[6]};
  }
  & > img {
    margin-right: 12px;
  }
`;

const Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 0.4s;
  background-color: rgba(255, 255, 255, 0.05);
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  -webkit-backdrop-filter: blur(20px);
  -moz-backdrop-filter: blur(20px);
  -o-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  z-index: 98;
`;

const Body = styled.div`
  width: 100%;
  flex-grow: 1;
`;

const ListWrapper = styled.ul`
  ${({ theme }) => theme.mixins.flexbox('column', 'center', 'flex-start')};
  width: 100%;
  height: auto;
  max-height: 230px;
  overflow-y: auto;
  border-bottom: 1px solid ${({ theme }) => theme.color.neutral[6]};
`;

const ListItem = styled.li`
  ${({ theme }) => theme.mixins.flexbox('row', 'center', 'space-between')};
  width: 100%;
  cursor: pointer;
  height: 46px;
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.color.neutral[7]};
  transition: all 0.4s ease;
  :hover {
    background-color: ${({ theme }) => theme.color.neutral[6]};
    transition: all 0.4s ease;
  }
`;

const Dim = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${({ theme }) => theme.dimmed400};
`;

const AddAccountBtn = styled.button`
  position: relative;
  padding-left: 24px;
  margin-left: 20px;
  margin: 16px 0px 0px 20px;
  :before {
    content: '';
    width: 16px;
    height: 16px;
    background-image: url(${plus});
    ${({ theme }) => theme.mixins.posTopCenterLeft()}
  }
`;

export default SubMenu;
