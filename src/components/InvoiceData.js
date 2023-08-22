import React from "react";

import "./maincontent.css"
import "./inventory.css"

// import StockCard from "./StockCard"
const InvoiceData = (props) => {


    const handleDelete = (invoice) => {
        let index = null
        let readyToDelete = false
        try {

            const updatedStock = props.availableStock.map((stock, i) => {

                if (invoice.purchaseOf === 'Metal' && invoice.purchaseOf === stock.items.type) {
                    if (invoice.PurchaseItem.Metal.metalType === stock.items.metalType) {
                        index = i
                        if ((stock.qty - invoice.PurchaseItem.Metal.metalWeight) > 0) {
                            readyToDelete = true
                            return { ...stock, qty: +Number(stock.qty - invoice.PurchaseItem.Metal.metalWeight).toFixed(3) }
                        }
                        else {
                            alert("Can't Delete  => The Current Stock Will Get -Ve ")
                        }
                    }
                }
                if (invoice.purchaseOf === 'Runner' && invoice.purchaseOf === stock.items.type) {
                    if (invoice.PurchaseItem.Runner.runnerColor === stock.items.runnerColor && invoice.PurchaseItem.Runner.runnerPurity === stock.items.runnerPurity) {
                        index = i
                        if ((stock.qty - invoice.PurchaseItem.Runner.runnerWeight) > 0) {
                            readyToDelete = true

                            return { ...stock, qty: +Number(stock.qty - invoice.PurchaseItem.Runner.runnerWeight).toFixed(3) }
                        }
                        else {
                            alert("Can't Delete  => The Current Stock Will Get -Ve")
                        }
                    }
                }
                if (invoice.purchaseOf === 'Alloy' && invoice.purchaseOf === stock.items.type) {
                    if (invoice.PurchaseItem.Alloy.alloyType === stock.items.alloyType) {
                        index = i
                        if ((stock.qty - invoice.PurchaseItem.Alloy.alloyWeight) > 0) {
                            readyToDelete = true

                            return { ...stock, qty: +Number(stock.qty - invoice.PurchaseItem.Alloy.alloyWeight).toFixed(3) }
                        }
                        else {
                            alert("Can't Delete  => The Current Stock Will Get -Ve ")
                        }
                    }
                }
                if (invoice.purchaseOf === 'Stone' && invoice.purchaseOf === stock.items.type) {
                    if (invoice.PurchaseItem.Stone.stoneType === stock.items.stoneType && invoice.PurchaseItem.Stone.stoneColor === stock.items.stoneColor && invoice.PurchaseItem.Stone.stoneShape === stock.items.stoneShape && invoice.PurchaseItem.Stone.stoneSize === stock.items.stoneSize) {
                        index = i
                        if ((stock.qty - invoice.PurchaseItem.Stone.stoneQty) > 0) {

                            readyToDelete = true
                            return { ...stock, qty: +Number(stock.qty - invoice.PurchaseItem.Stone.stoneQty).toFixed(3) }
                        }
                        else {
                            alert("Can't Delete  => The Current Stock Will Get -Ve")
                        }
                    }
                }
                if (invoice.purchaseOf === 'Melt' && stock.items.type === 'Metal') {
                    if (stock.items.metalType === 'Gold') {
                        index = i
                        if ((stock.qty - invoice.PurchaseItem.Metal.metalWeight) > 0) {
                            readyToDelete = true
                            calcRunner(invoice)
                            return { ...stock, qty: +Number(stock.qty - invoice.PurchaseItem.Metal.metalWeight).toFixed(3) }
                        }
                        else {
                            alert("Can't Delete  => The Current Stock Will Get -Ve ")
                        }
                    }

                }
                return stock

            })
            if (readyToDelete) {
                props.addStockHandler(updatedStock, index, 'update')
                props.deleteInvoiceHandler(invoice._id);
            }

        } catch (e) {
            console.log(e)
        }

    }
    const calcRunner = (invoice) => {
        let updatedArray = props.availableStock
        const i = []
        for (const reuseItem of invoice.Reuse.reuseList) {
            const runnerDetails = { type: "Runner", runnerColor: reuseItem.runnerColor, runnerPurity: reuseItem.runnerPurity }
            // console.log(runnerDetails)
            updatedArray = updatedArray.map((obj, index) => {
                if (JSON.stringify(obj.items) === JSON.stringify(runnerDetails)) {
                    console.log(runnerDetails, obj.items)
                    i.push(index)
                    const tempqty = +Number(obj.qty).toFixed(3)
                    const ogqty = +Number(reuseItem.runnerWeight).toFixed(3)

                    return { ...obj, qty: +Number(tempqty + ogqty).toFixed(3) }
                }
                else {
                    return obj
                }
            });
        }
        if (i.length > 0) {
            for (const index of i) {
                props.addStockHandler(updatedArray, index, "update")
            }
        }

    }

    const inventoryTable = () => {
        try {
            const reverseInvList = props.invList.slice()

            return reverseInvList.reverse().map((stock, index) => {

                if (stock.purchaseOf === "Metal") {
                    return (

                        <tr key={index} >
                            <td>{stock.purchaseDate}</td>
                            <td>{stock.purchaseOf}</td>
                            <td>{stock.PurchaseItem.Metal.metalType}</td>
                            <td>{stock.PurchaseItem.Metal.metalType === "Gold" ? '24K' : "925"}</td>
                            <td>{stock.PurchaseItem.Metal.metalWeight} gms</td>
                            <td>{stock.purchaseType !== "openingStock" ? `Purchase From ${stock.purchaseFrom}` : "Opening Stock"}</td>
                            <td></td>
                            <td style={{ width: '6rem' }}>
                                <div style={{ display: "flex", justifyContent: "space-around", cursor: "pointer" }}>

                                    <i className="icon trash" onClick={() => { handleDelete(stock) }} />
                                </div>
                            </td>
                        </tr>

                    )
                }
                if (stock.purchaseOf === "Runner") {

                    return (

                        <tr key={index}>
                            <td>{stock.purchaseDate}</td>
                            <td>{stock.purchaseOf}</td>
                            <td>{stock.PurchaseItem.Runner.runnerColor}</td>
                            <td>{stock.PurchaseItem.Runner.runnerPurity}</td>
                            <td>{stock.PurchaseItem.Runner.runnerWeight} gms</td>
                            <td>{stock.purchaseType !== "openingStock" ? `${stock.purchaseFrom}` : "Opening Stock"}</td>
                            <td></td>
                            <td style={{ width: '6rem' }}>
                                <div style={{ display: "flex", justifyContent: "space-around", cursor: "pointer" }}>

                                    <i className="icon trash" onClick={() => { handleDelete(stock) }} />
                                </div>
                            </td>
                        </tr>

                    )
                }
                if (stock.purchaseOf === "Alloy") {
                    return (

                        <tr key={index} >
                            <td>{stock.purchaseDate}</td>
                            <td>{stock.purchaseOf}</td>
                            <td>{stock.PurchaseItem.Alloy.alloyType}</td>
                            <td>-</td>
                            <td>{stock.PurchaseItem.Alloy.alloyWeight} gms</td>
                            <td>{stock.purchaseType !== "openingStock" ? `Purchase From ${stock.purchaseFrom}` : "Opening Stock"}</td>
                            <td></td>
                            <td style={{ width: '6rem' }}>
                                <div style={{ display: "flex", justifyContent: "space-around", cursor: "pointer" }}>

                                    <i className="icon trash" onClick={() => { handleDelete(stock) }} />
                                </div>
                            </td>
                        </tr>

                    )
                }
                if (stock.purchaseOf === "Stone") {
                    return (

                        <tr key={index}  >
                            <td>{stock.purchaseDate}</td>
                            <td>{stock.purchaseOf}</td>
                            <td>{stock.PurchaseItem.Stone.stoneColor} {stock.PurchaseItem.Stone.stoneShape} {stock.PurchaseItem.Stone.stoneType}</td>
                            <td>{stock.PurchaseItem.Stone.stoneSize}</td>
                            <td>{stock.PurchaseItem.Stone.stoneQty}</td>
                            <td>{stock.purchaseType !== "openingStock" ? `Purchase From ${stock.purchaseFrom}` : "Opening Stock"}</td>
                            <td></td>
                            <td style={{ width: '6rem' }}>
                                <div style={{ display: "flex", justifyContent: "space-around", cursor: "pointer" }}>
                                    <i className="icon trash" onClick={() => { handleDelete(stock) }} />
                                </div>
                            </td>
                        </tr>

                    )
                }
                if (stock.purchaseOf === 'Melt') {

                    return (

                        <tr key={index} >
                            <td>{stock.purchaseDate}</td>
                            <td>Metal</td>
                            <td>{stock.PurchaseItem.Metal.metalType}</td>
                            <td>{stock.PurchaseItem.Metal.metalType === "Gold" ? '24K' : "925"}</td>
                            <td>{stock.PurchaseItem.Metal.metalWeight} gms</td>
                            <td>-</td>
                            <td><i className="icon check" /></td>

                            <td style={{ width: '6rem' }}>
                                <div style={{ display: "flex", justifyContent: "space-around", cursor: "pointer" }}>
                                    <i className="icon trash" onClick={() => { handleDelete(stock) }} />
                                </div>
                            </td>
                        </tr>

                    )
                }

                return null;
            })
        } catch (e) {
            console.log(e)
        }

    }


    return (
        <div className="mainContent">
            <div className="ui form">
                <div className="ui dividing header">Invoice</div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>

            </div>

            <div className=" ui two field " style={{ margin: "20px" }}>

                <div className="ui bottom attached segment" >
                    <div className="scrollable-table" id="style-2">
                        <table className="ui celled table">
                            <thead className="sticky-td" >
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Details</th>
                                    <th>Purity/Size</th>
                                    <th>Qty</th>
                                    <th>Order Type</th>
                                    <th>Melt</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventoryTable()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InvoiceData 