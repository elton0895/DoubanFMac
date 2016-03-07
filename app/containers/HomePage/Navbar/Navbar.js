import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router';
import styles from './Navbar.scss';

const renderUserItem = (currentUser = {}) => {
    const linkLabel = currentUser.name || '登录';
    const linkIcon = currentUser.id ? 'keyboard_arrow_down' : 'eject';

    return (
      <Link to='#' className={styles.userLink} >
        { linkLabel }
        <i className={cx('material-icons')} > { linkIcon } </i>
      </Link>
    );
  }

export default (currentUser) => {
  return (
    <nav className={styles.navbar} >
      <a href="#logo" className={styles.navLogo} > Logo </a>
      <div className={styles.navItems} >
        <a href="#私人兆赫" className="navItem" > 私人兆赫 </a>
        <a href="#私人歌单" className="navItem" > 私人歌单 </a>
        <a href="#红心歌单" className="navItem" > 红心歌单 </a>
      </div>
      <div className={styles.userItem} >
        { renderUserItem(currentUser) }
      </div>
    </nav>
  );
};
