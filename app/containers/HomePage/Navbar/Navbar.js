import React from 'react';
import Dropdown from 'react-dropdowns';
import cx from 'classnames';
import { Signin } from 'containers';
import styles from './Navbar.scss';

function UserItem({ currentUser = {}, showSigninModal, logoutUser }) {
  if (currentUser.id !== 0) {
    return (
      <div>
        <Dropdown
          className={styles.dropdown}
          toggle={
            <a href="#" className={styles.userLink} >
              { currentUser.name }
              <i className={cx('material-icons')} > keyboard_arrow_down </i>
              <Signin />
            </a>
          }
        >
          <Dropdown.Item label="退出" onClick={logoutUser} />
        </Dropdown>
      </div>
    );
  }

  return (
    <a href="#" className={styles.userLink} onClick={showSigninModal} >
      登录
    <i className={cx('material-icons')} > eject </i>
    <Signin />
    </a>
  );
}

export default ({ currentUser, showSigninModal, logoutUser }) => {
  return (
    <nav className={styles.navbar} >
      <a href="#logo" className={styles.navLogo} > Logo </a>
      <div className={styles.navItems} >
        <a href="#" className="navItem" > 更多 MHz </a>
        <a href="#" className="navItem" >
          私人 MHz
          <i className="material-icons" > volume_up </i>
        </a>
        <a href="#" className="navItem" > 红心 MHz </a>
      </div>
      <div className={styles.userItem} >
        <UserItem
          currentUser={currentUser}
          showSigninModal={showSigninModal}
          logoutUser={logoutUser}
        />
      </div>
    </nav>
  );
};
