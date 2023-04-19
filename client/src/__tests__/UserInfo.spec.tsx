import React from 'react';
import { render } from '@testing-library/react';
import { UserContext, userStore } from '../stores/UserStore/UserStore';
import UserInfo from '../components/UserInfo/UserInfo';
import { act } from 'react-dom/test-utils';

const renderUserInfo = () =>
  render(
    <UserContext.Provider value={userStore}>
      <UserInfo />
    </UserContext.Provider>
  );

describe('UserInfo', () => {
  it('should render user name and balance', () => {
    const { getByText } = renderUserInfo();
    expect(getByText(userStore.name)).toBeInTheDocument();
    expect(getByText(userStore.balance)).toBeInTheDocument();
  });

  it('should render updated balance', () => {
    const { getByText } = renderUserInfo();
    expect(getByText(userStore.balance)).toBeInTheDocument();
    act(() => userStore.changeBalance(900));
    expect(getByText('900')).toBeInTheDocument();
  });
});
