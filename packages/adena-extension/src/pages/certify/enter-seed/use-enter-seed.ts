import { RoutePath } from '@router/path';
import { WalletService } from '@services/index';
import { EnglishMnemonic } from 'adena-module/src/crypto';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const specialPatternCheck = /[{}[]\/?.,;:|\)*~`!^-_+<>@#$%&\\=\('"]/g;

export const useEnterSeed = () => {
  const navigate = useNavigate();
  const [seed, setSeed] = useState('');
  const [error, setError] = useState(false);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const patternCheck = e.target.value.replace(specialPatternCheck, '');
      setSeed(() => patternCheck.toLowerCase());
    },
    [seed],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleButtonClick();
    }
  };

  const handleButtonClick = async () => {
    try {
      const checkedMnemonic = new EnglishMnemonic(seed);
      if (checkedMnemonic) {
        await WalletService.clearWalletAccountData();
        navigate(RoutePath.CreatePassword, {
          state: { seeds: seed },
        });
        setError(false);
        return;
      }
    } catch (e) {
      console.log(e);
    }
    setError(true);
  };

  useEffect(() => {
    if (seed === '') {
      setError(false);
    }
  }, [seed]);

  return {
    seedState: {
      value: seed,
      onChange,
      onKeyDown,
      error: error,
      errorMessage: 'Invalid seed phrase',
    },
    buttonState: {
      onClick: handleButtonClick,
      disabled: !seed,
    },
  };
};
