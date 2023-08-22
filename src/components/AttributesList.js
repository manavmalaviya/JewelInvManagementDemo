import React, { useState } from "react";
import './maincontent.css';
// import {Link} from "react-router-dom";
import AttrDetail from "./AttributeDetail";
import { Link } from "react-router-dom";

const AttrList = (props) => {

    const [activeMenu, setActiveMenu] = useState("Metal")
    const handleItemClick = (item) => {

        setActiveMenu(item)
    }

    const metalTable = () => {

        return props.attributesList.map((attr,index) => {
            
            return (
             
                    <AttrDetail key={ index} activeMenu={activeMenu} deleteThisAttr={props.deleteFunction} attr={attr} />
            

            )
        })
    }

    return (
        <div className="mainContent">

            <Link to={"/attrlist/add"}>
                <div className="button" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button className="ui button orange" >Add</button>
                </div>
            </Link>

            <div className="ui header"> Attributes List <hr />
            </div>

            <div className=" ui two button ">
                <div className="ui top attached tabular menu" style={{ display: "flex", flexWrap: "Wrap" }}>
                    <div className={`item ${activeMenu === 'Metal' ? 'active' : ''} `} style={{ cursor: "pointer" }} onClick={() => handleItemClick('Metal')}>
                        Metal
                    </div>
                    <div className={`item ${activeMenu === 'Stone' ? 'active' : ''} `} style={{ cursor: "pointer" }} onClick={() => handleItemClick('Stone')} >
                        Stone
                    </div>
                </div>
                <div className="ui bottom attached segment" style={{ display: activeMenu === "Metal" ? "" : "none" }} >

                    <div className="scrollable-table" id="style-2">
                        <table className="ui celled table">
                            <thead className="sticky-td">
                                <tr style={{border:"1px solid black"}}>
                                    <th className="topborder">Type</th>
                                    <th className="topborder">Color</th>
                                    <th className="topborder">Purity</th>
                                    <th className="topborder">Alloy</th>
                                    <th className="topborder"></th>
                                </tr>
                            </thead>
                            {metalTable()}
                        </table>
                    </div>

                </div>
                <div className="ui bottom attached segment" style={{ display: activeMenu === "Stone" ? "" : "none" }} >

                    <div className="scrollable-table" id="style-2">
                        <table className="ui celled table">
                            <thead className="sticky-td">
                                <tr >
                                    <th className="topborder" >Type</th>
                                    <th className="topborder">Shape</th>
                                    <th className="topborder">Color</th>
                                    <th className="topborder">Size</th>
                                    <th className="topborder"></th>
                                </tr>
                            </thead>
                            {metalTable()}
                        </table>
                    </div>

                </div>
            </div>

        </div>
    );
};
export default AttrList;
