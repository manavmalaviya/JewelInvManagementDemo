import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./maincontent.css"
import "./inventory.css"
import { useNavigate } from "react-router-dom";

const Inventory = (props) => {
    let navigate = useNavigate()
    try {
        const [activeMenu, setActiveMenu] = useState("Metal")

        const handleItemClick = (item) => {

            setActiveMenu(item)
        }

        const handleIconClick = async (id) => {
            const response = await props.stockToEdit(id, "stock")
            if (response) {
                navigate("/inventory/add")
            }
        }


        const threshHoldQty = (material, type) => {
            if (material === 'Metal') {
                if (type === 'Gold') {
                    return 10
                }
                if (type === 'Silver') {
                    return 100
                }
            }
            if (material === 'Stone') {
                if (Number(type) >= 0.8 && Number(type) <= 3.00) {
                    return 100
                }

                return 25
            }
            if (material === 'Alloy') {
                return 10
            }
        }

        const metalTable = () => {

            let sortedStockList=null
            sortedStockList=props.availableStock
            sortedStockList.sort((a, b) => a.qty - b.qty);


            return sortedStockList.map((stock, index) => {

                if (activeMenu === "Metal") {

                    if (stock.items.type === "Metal") {
                        return (
                            <tbody key={index}>
                                <tr className={stock.qty < threshHoldQty(stock.items.type,stock.items.metalType) ? "error" : ""}>
                                    <td>{stock.items.type}</td>

                                    <td>{stock.items.metalType}</td>

                                    <td>{stock.items.metalType === "Gold" ? "24K" : "925"}</td>

                                    <td className={stock.qty < threshHoldQty(stock.items.type,stock.items.metalType) ? "error" : ""}><i className="attention icon" style={{ display: stock.qty < threshHoldQty(stock.items.type,stock.items.metalType) ? "" : "none" }}></i> {stock.qty}</td>
                                    <td style={{ width: '6rem' }}>
                                        <div style={{ display: "flex", justifyContent: "space-around", cursor: "pointer" }}>
                                            <i className="icon plus" onClick={() => { handleIconClick(stock) }} />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        )
                    }
                    if (stock.items.type === "Runner") {
                        return (
                            <tbody key={index}>
                                <tr >
                                    <td>{stock.items.type}</td>
                                    <td>{stock.items.runnerColor}</td>
                                    <td>{stock.items.runnerPurity}</td>
                                    <td >{stock.qty}</td>
                                    <td style={{ width: '6rem' }}>
                                        <div style={{ display: "flex", justifyContent: "space-around", cursor: "pointer" }}>

                                            <i className="icon plus" onClick={() => { handleIconClick(stock) }} />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        )
                    }
                    if (stock.items.type === "Alloy") {
                        return (
                            <tbody key={index}>
                                <tr className={stock.qty < threshHoldQty(stock.items.type,stock.items.alloyType) ? "error" : ""}>
                                    <td>{stock.items.type}</td>
                                    <td>{stock.items.alloyType}</td>
                                    <td>-</td>
                                    <td className={stock.qty < threshHoldQty(stock.items.type,stock.items.alloyType) ? "error" : ""}><i className="attention icon" style={{ display: stock.qty < threshHoldQty(stock.items.type,stock.items.alloyType) ? "" : "none" }}></i> {stock.qty}</td>
                                    <td style={{ width: '6rem' }}>
                                        <div style={{ display: "flex", justifyContent: "space-around", cursor: "pointer" }}>

                                            <i className="icon plus" onClick={() => { handleIconClick(stock) }} />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        )
                    }
                }
                if (activeMenu === "Stone") {

                    if (stock.items.type === "Stone") {
                        return (
                            <tbody key={index}>
                                <tr className={stock.qty < threshHoldQty(stock.items.type,stock.items.stoneSize) ? "error" : ""}>
                                    <td>{stock.items.stoneType}</td>
                                    <td>{stock.items.stoneShape}</td>
                                    <td>{stock.items.stoneColor}</td>
                                    <td>{stock.items.stoneSize}  mm</td>
                                    <td className={stock.qty < threshHoldQty(stock.items.type,stock.items.stoneSize) ? "error" : ""}><i className="attention icon" style={{ display: stock.qty < threshHoldQty(stock.items.type,stock.items.stoneSize) ? "" : "none" }}></i> {stock.qty}</td>
                                    <td style={{ width: '6rem' }}>
                                        <div style={{ display: "flex", justifyContent: "space-around", cursor: "pointer" }}>
                                            <i className="icon plus" onClick={() => { handleIconClick(stock) }} />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        )
                    }

                }
                return null;
            })

        }


        return (
            <div className="mainContent">
                <div className="ui form">
                    <div className="ui dividing header">Inventory</div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                    <Link to={"/inventory/add"}>
                        <div className="ui button orange" style={{ display: "flex", width: "8rem", padding: "11px", cursor: 'pointer', alignItems: "center" }}>
                            <i className="plus icon"></i>
                            <div>New Stock</div>
                        </div>
                    </Link>
                </div>

                <div className=" ui two field " style={{ margin: "20px" }}>
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
                                    <tr >
                                        <th>Metal</th>
                                        <th>Type</th>
                                        <th>Purity</th>
                                        <th>Qty</th>
                                        <th ></th>
                                    </tr>
                                </thead>
                                {metalTable()}
                            </table>
                        </div>

                    </div>
                    <div className="ui bottom attached segment" style={{ display: activeMenu === "Stone" ? "" : "none" }} >
                        <div className="scrollable-table" id="style-2">
                            <table className="ui celled table">
                                <thead className="sticky-td" >
                                    <tr>
                                        <th>Type</th>
                                        <th>Shape</th>
                                        <th>Color</th>
                                        <th>Size</th>
                                        <th>Qty</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                {metalTable()}
                            </table>
                        </div>
                    </div>
                </div>

            </div>




        )
    } catch (e) {
        console.log(e)
    }
}
export default Inventory 