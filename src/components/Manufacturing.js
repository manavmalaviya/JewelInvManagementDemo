import React, { useEffect, useRef, useState } from "react";
import "./maincontent.css"
import "./Manufacturing.css"
import axios from "axios";

import PendingList from "./PendingList";
import CompletedList from "./CompletedList";

import { Link } from "react-router-dom";
import DownloadButton from "./downloadButton";



const Manufacturing = (props) => {

  const [activeMenu, setActiveMenu] = useState('Pending');
  const [subActiveMenu, setSubActiveMenu] = useState('Metal');
  const url = "https://jewelry-mnf-backend.vercel.app";

  const inputEl = useRef("");

  const getSearchTerm = () => {
    props.searchHandler(inputEl.current.value, activeMenu === "Pending" || subActiveMenu === "Metal" ? "mnfOrder" : "stone", activeMenu);
  }

  const handleItemClick = async (menuName) => {
    await setActiveMenu(menuName);

  };
  const handlesubmenu = async (menuName) => {
    await setSubActiveMenu(menuName);

  };


  const updatedeletedStock = async (order, type) => {

    // props.deleteHandler
    if (type === "mnfOrder") {

      const metal = [order.Metal.metalType, order.Metal.metalWeight]
      const runner = [order.Runner.runnerColor, order.Runner.runnerPurity, order.Runner.runnerWeight]
      const alloy = [order.Metal.Alloy.alloyColor, order.Metal.Alloy.alloyWeight]
      const totalRunnerReceived = order.totalRunnerReceived
      const indexarr = []

      const updatedArray = await props.availableStock.map((stock, index) => {
        if (stock.items.type === "Metal" && stock.items.metalType === metal[0]) {
          indexarr.push(index)
          return { ...stock, qty: +Number(stock.qty + metal[1]).toFixed(3) }
        }
        if (stock.items.type === "Runner" && stock.items.runnerColor === runner[0] && stock.items.runnerPurity === runner[1]) {
          indexarr.push(index)
          const temp = +Number(stock.qty - totalRunnerReceived + runner[2]).toFixed(3)
          return { ...stock, qty: temp }
        }
        if (stock.items.type === "Alloy" && stock.items.alloyType === alloy[0]) {
          indexarr.push(index)
          return { ...stock, qty: +Number(stock.qty + alloy[1]).toFixed(3) }
        }
        return stock
      })

      console.log(indexarr)

      for (const i of indexarr) {
        const res = await props.addStockHandler(updatedArray, i, 'update')
        if (res) {
          await props.deleteHandler(order._id, type)
        }
      }

    }

    if (type === "stoneOrder") {
      const indexarr = [];

      let tempavailableStock = props.availableStock;
      let counter = 0;

      for (const stoneodr of order.stoneOrder) {
        let innerCounter = 0; // Separate counter for inner function

        tempavailableStock = await tempavailableStock.map((stock, index) => {
          const stone = [stoneodr.stoneType, stoneodr.stoneColor, stoneodr.stoneShape, stoneodr.stoneSize, stoneodr.stoneQty];

          if (stock.items.type === "Stone" && stock.items.stoneType === stone[0] && stock.items.stoneColor === stone[1] && stock.items.stoneShape === stone[2] && stock.items.stoneSize === stone[3]) {
            indexarr[index] = index;

            return { ...stock, qty: stock.qty + stone[4] };
          }

          innerCounter++;
          return stock;
        });

        counter += innerCounter; // Update the counter after each iteration

      }

      if (counter !== props.availableStock.length) {
        for (const index in indexarr) {
          if (index !== null) {
            const res = await props.addStockHandler(tempavailableStock, index, 'update');
            if (res) {
              await props.deleteHandler(order._id, type);
              return;
            }
          }
        }
      }

      if (counter === props.availableStock.length) {
        await props.deleteHandler(order._id, type);
        alert("Stock Does not Exist in Inventory .... Deleted");
        return;
      }
    }

  }

  const renderPendingList = () => {
    const reverseList = props.PendingList.slice()
    return (
      reverseList.reverse().map((order, index) => {
        return (
          <PendingList key={index} order={order} deleteHandler={updatedeletedStock} orderToEdit={props.orderToEdit} />
        )
      }
      )
    )
  }

  const renderCompletedList = () => {

    const reverseList = props.CompletedList.slice()
    const reverseListStone = props.stoneOrderList.slice()

    return (
      <>
        {reverseList.reverse().map((order, index) => {


          return (
            <CompletedList key={index} order={order} activeMenu={subActiveMenu} type="Metal" deleteHandler={updatedeletedStock} />
          )
        })}
        {reverseListStone.reverse().map((order, index) => {
          if (order.givenDate) {
            return (

              <CompletedList key={index} order={order} activeMenu={subActiveMenu} deleteHandler={updatedeletedStock} type="Stone" />

            )

          }
          return null;

        })}

      </>)

  }

  const [allowedList, setAllowedList] = useState()
  const [allowedListStone, setAllowedListStone] = useState()


  useEffect(() => {
    const getAllowedAttrs = async () => {

      const responseMetal = await axios.get(`${url}/manufacturing`, { params: { type: "Metal" } })
      const responseStone = await axios.get(`${url}/manufacturing`, { params: { type: "Stone" } })

      if (responseMetal) {
        setAllowedList(responseMetal.data)
      }
      if (responseStone) {
        setAllowedListStone(responseStone.data)
      }
    }
    getAllowedAttrs()
  }, [])



  return (
    <div className="mainContent">

      <div className="buttonContainer" >

        <DownloadButton allowedLabels={typeof (allowedList) !== "undefined" ? allowedList : []} allowedLabelStone={typeof (allowedListStone) !== "undefined" ? allowedListStone : []} stoneOrderList={props.stoneOrderList} mnfOrderList={props.mnfOrderList} attrList={props.attrList} addallowedLabels={props.addallowedLabels} />

        <Link to={"/manufacturing/add"}>
          <div className="addButton">
            Add
          </div>
        </Link>
      </div>

      <div className="ui two field mnfOrder" style={{ margin: "20px" }}>
        <div className="ui top attached tabular menu">
          <div className={`item ${activeMenu === 'Pending' ? 'active' : ''} `} style={{ cursor: "pointer" }} onClick={() => handleItemClick('Pending')}>
            Pending
          </div>
          <div className={`item ${activeMenu === 'completed' ? 'active' : ''} `} style={{ cursor: "pointer" }} onClick={() => handleItemClick('completed')} >
            Completed
          </div>
          <div className="right menu">
            <div className="item">
              <div className="ui transparent icon input">
                {/* form metals only type color purity and date and for stone evrything except brokenQty */}
                <input type="text" ref={inputEl} placeholder="Search" value={props.term} onChange={getSearchTerm} />
                <i className="search link icon"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="ui bottom attached segment" style={{ display: activeMenu === "Pending" ? "" : "none" }} >
          {props.PendingList.length > 0 || props.stoneOrderList.length > 0 ?
            (


              <div className="scrollable-table" id="style-2">
                <table className="ui celled table">
                  <thead className="sticky-td">
                    <tr style={{ border: "1px solid black" }}>
                      <th className="topborder">Issue Date</th>
                      <th className="topborder">Metal</th>
                      <th className="topborder">Purity</th>
                      <th className="topborder">Color</th>
                      <th className="topborder">Weight</th>
                      <th className="topborder">Alloy Weight</th>
                      <th className="topborder">Runner Weight</th>
                      <th className="topborder">Total</th>
                      <th className="topborder"></th>
                    </tr>
                  </thead>
                  {renderPendingList()}
                </table>
              </div>

            ) : (
              <div>No Pending List</div>
            )
          }

        </div>

        <div className="ui bottom attached segment" style={{ display: activeMenu === "completed" ? "" : "none" }} >

          <div className="ui attached tabular menu">
            <div className={`item ${subActiveMenu === 'Metal' ? 'active' : ''} `} style={{ cursor: "pointer" }} onClick={() => handlesubmenu('Metal')}>
              Metal
            </div>
            <div className={`item ${subActiveMenu === 'Stone' ? 'active' : ''} `} style={{ cursor: "pointer" }} onClick={() => handlesubmenu('Stone')} >
              Stone
            </div>
          </div>

          <div className="ui attached segment" style={{ display: subActiveMenu === "Metal" ? "" : "none" }} >

            {props.CompletedList.length > 0 ?
              (

                <div className="scrollable-table" id="style-2">
                  <table className="ui celled table">
                    <thead className="sticky-td ">
                      <tr style={{ border: "1px solid black" }}>
                        <th className="topborder dark-heading">Issue Date</th>
                        <th className="topborder">Recieve Date</th>
                        <th className="topborder">Metal</th>
                        <th className="topborder">Weight</th>
                        <th className="topborder">Alloy Weight</th>
                        <th className="topborder">Runner Weight</th>
                        <th className="topborder">Total Given</th>
                        <th className="topborder">Total Recieved</th>
                        <th className="topborder">Runner Received</th>
                        <th className="topborder">Used in Order</th>
                        <th className="topborder"></th>
                      </tr>
                    </thead>
                    {renderCompletedList()}
                  </table>
                </div>
              ) : (
                <div>No Completed List</div>
              )
            }

          </div>
          <div className="ui attached segment" style={{ display: subActiveMenu === "Stone" ? "" : "none" }} >

            {props.stoneOrderList.length > 0 ?
              (

                <div className="scrollable-table" id="style-2">
                  <table className="ui celled table">
                    <thead className="sticky-td">
                      <tr style={{ border: "1px solid black" }}>
                        <th className="topborder">Issue Date</th>

                        <th className="topborder"> Type</th>
                        <th className="topborder">Shape</th>
                        <th className="topborder">Color</th>
                        <th className="topborder">Size</th>
                        <th className="topborder">Qty</th>
                        <th className="topborder">Broken Qty</th>
                        <th className="topborder">Order</th>
                        <th className="topborder"></th>
                      </tr>
                    </thead>

                    {renderCompletedList()}

                  </table>
                </div>
              ) : (
                <div>No Completed List</div>
              )
            }

          </div>
        </div>

      </div>


    </div>
  );
}
export default Manufacturing;