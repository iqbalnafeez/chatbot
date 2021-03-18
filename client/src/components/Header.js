import React from 'react'
import {Link} from "react-router-dom";
const Header = () => {
    return <div>
        <nav><div className="nav-wrapper">
            <Link to={'/'} className = "brand-logo"> Get Quotes</Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><Link to={"/quote"}>Quote</Link></li>
           <li><Link to={"/about"}>About Us</Link></li>
            <li><Link to={"/"}>Landing</Link></li>
        </ul></div></nav>
    </div>
}
export default  Header;
