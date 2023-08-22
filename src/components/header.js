import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from '../images/website.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faIndustry, faBoxOpen, faList, faReceipt, faRightFromBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import './sidebar.css';
import { useCookies } from "react-cookie";



const Header = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    if (pathname) {
      props.setActiveItem(pathname);
      navigate(pathname);
    }
    //eslint-disable-next-line
  }, []);



  const handleItemClick = (menuName) => {
    props.setActiveItem(menuName);
  };

  const [, , removeCookie] = useCookies(['isAuthenticated']);
  const handleSignOut = () => {
    props.setIsAdmin(false)
    props.setIsAuthenticated(false)
    removeCookie('isAuthenticated')
    removeCookie('user_data')
  }


  return (
    <div className="sidecontentbar">

      <div className="ui vertical fluid tabular menu" style={{ height: "fit-content" }}>
        <img src={logo} className="ui image" alt="Logo" />
      </div>
      <div className="ui vertical fluid tabular menu">
        <div className="hoverIcon" onClick={() => handleItemClick('/')} >

          <Link to="/" className={`item ${props.activeItem === '/' ? 'active' : ''} `} >

            <FontAwesomeIcon icon={faHome} className="icon" />
            <FontAwesomeIcon icon={faHome} className="iconhover" />

          </Link>
          <span className="tooltiptext home">Home</span>
        </div>
        <div className="hoverIcon" onClick={() => handleItemClick('/manufacturing')}>

          <Link to="/manufacturing" className={`item ${props.activeItem === '/manufacturing' || props.activeItem === '/manufacturing/add' ? 'active' : ''} `}  >

            <FontAwesomeIcon icon={faIndustry} className="icon" />
            <FontAwesomeIcon icon={faIndustry} className="iconhover" />

          </Link>
          <span className="tooltiptext manufacturing">Manufacturing</span>
        </div>
        <div className="hoverIcon" onClick={() => handleItemClick('/inventory')}>

          <Link to="/inventory" className={`item ${props.activeItem === '/inventory' || props.activeItem === '/inventory/add' ? 'active' : ''} `}>

            <FontAwesomeIcon icon={faBoxOpen} className="icon" />
            <FontAwesomeIcon icon={faBoxOpen} className="iconhover" />

          </Link>
          <span className="tooltiptext iventory">Stock</span>
        </div>

        <div className="hoverIcon" onClick={() => handleItemClick('/invoice')}>

          <Link to="/invoice" className={`item ${props.activeItem === '/invoice' || props.activeItem === '/invoice/add' ? 'active' : ''} `} >
            <FontAwesomeIcon icon={faReceipt} className="icon receipt" />
            <FontAwesomeIcon icon={faReceipt} className="iconhover" />
          </Link>
          <span className="tooltiptext attrlist">Invoice</span>
        </div>

        <div className="hoverIcon" onClick={() => handleItemClick('/attrlist')}>

          <Link to="/attrlist" className={`item ${props.activeItem === '/attrlist' || props.activeItem === '/attrlist/add' ? 'active' : ''} `} >
            <FontAwesomeIcon icon={faList} className="icon" />
            <FontAwesomeIcon icon={faList} className="iconhover" />
          </Link>
          <span className="tooltiptext attrlist">Attributes</span>
        </div>

      </div>

      <div>

        {props.isAdmin && (
          <div className="ui vertical fluid menu tabular" style={{ height: "fit-content" }}>
            <div className="hoverIcon">
              <Link to="/signup" className={`item`} >
                <FontAwesomeIcon icon={faUserPlus} className="icon" />
              </Link>
              <span className="tooltiptext attrlist">Add User</span>
            </div>
          </div>
        )}

        <div className="ui vertical fluid menu tabular" style={{ height: "fit-content" }}>

          <div className="hoverIcon" onClick={() => handleSignOut()}>

            <Link to="/login" className={`item`} >
              <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
            </Link>
            <span className="tooltiptext attrlist">Log Out</span>
          </div>
        </div>
      </div>

    </div>

  );
};

export default Header;
