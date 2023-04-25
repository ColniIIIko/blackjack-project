import React from 'react';
import { render } from '@testing-library/react';
import UserInfo from '../components/UserInfo/UserInfo';
import { act } from 'react-dom/test-utils';
import { GlobalContext, globalStore } from '../stores/GlobalStore';

const renderUserInfo = () =>
  render(
    <GlobalContext.Provider value={globalStore}>
      <UserInfo />
    </GlobalContext.Provider>
  );

describe('UserInfo', () => {
  it('should render user name and balance', () => {
    const { getByText } = renderUserInfo();
    expect(getByText(globalStore.userStore.name)).toBeInTheDocument();
    expect(getByText(globalStore.userStore.balance)).toBeInTheDocument();
  });

  it('should render updated balance', () => {
    const { getByText } = renderUserInfo();
    expect(getByText(globalStore.userStore.balance)).toBeInTheDocument();
    act(() => globalStore.userStore.changeBalance(900));
    expect(getByText('900')).toBeInTheDocument();
  });
});
