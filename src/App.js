import React, { useEffect, useState } from "react";
import Header from "./components/header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import AttributeList from "./components/AttributesList";
import AddAtrribute from "./components/Addattributes";
import Manufacturing from "./components/Manufacturing"
import Addmnforder from "./components/Addmnforder";
import Editpendingorders from "./components/editPendingOrder";
import Inventory from "./components/inventory";
import AddInventory from "./components/AddInventory";
import Homestats from "./components/home";
import InvoiceData from "./components/InvoiceData";
import Authentication from "./components/login/authentication";
// import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScrewdriver } from '@fortawesome/free-solid-svg-icons';
import RouterComponent from "./components/login/router";
import './App.css';
// require('dotenv').config()


function App() {


  // styling variables
  // const [cookies] = useCookies(['isAuthenticated', "user_data"]);
  // const [alloyColor,setAlloyColor]= useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeItem, setActiveItem] = useState('/');

  const [attributesList, setAttributesList] = useState([])
  const [manufacturingOrderList, setmanufacturingOrderList] = useState([])
  const [stoneOrderList, setStoneOrderList] = useState([]);
  const [invList, setInvList] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingSearchResults, setPendingSearchResults] = useState([]);
  const [completedSearchResults, setCompletedSearchResults] = useState([]);
  const [stoneSearchResults, setStoneSearchResults] = useState([]);
  const [editThisOrder, setEditThisOrder] = useState();
  const [availableStock, setAvailableStock] = useState([]);
  const [editType, setEditType] = useState();
  const [PendingList, setPendingList] = useState([]);
  const [CompletedList, setCompletedList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state

  const url = "https://jewel-inv-management-backend-demo.vercel.app"

  useEffect(() => {
    // Simulate a delay of 2 seconds
    setTimeout(() => {
      setIsLoading(false); // Set loading state to false after the delay
    }, 1500);
  }, []);


  useEffect(() => {
    const checkIfAlone = async () => {

      const response = await axios.get(`${url}/login`)
      if (response.data) {
        setIsAuthenticated(true)
        setIsAdmin(true)
      }
    }
    checkIfAlone()
  }, [])


  const firstOrder = {
    id: uuidv4(),
    givenDate: '',
    receivedDate: "",

    Metal: {
      metalWeight: 0,
      metalType: "",
      metalColor: "",
      metalPurity: "",
      Alloy: {
        alloyWeight: 0,
        alloyColor: ""
      }
    },
    Runner: {
      runnerWeight: 0,
      runnerColor: "",
      runnerPurity: "",
    },

    totalMetalGiven: 0,
    totalMetalReceived: 0,
    totalRunnerReceived: 0,
    usedInOrder: 0,
    castingLoss: 0,
    netLoss: 0,
    orderDetails: [{
      orderId: "",
      orderWeight: 0
    }],


  }
  const firstStoneOrder = {
    id: uuidv4(),
    givenDate: '',
    stoneOrder: [
      {
        stoneType: "",
        stoneShape: "",
        stoneColor: "",
        stoneSize: "",
        stoneQty: 0,
        brokenQty: 0,
        orderId: ""
      }
    ]
  }

  const [addDirectInventory, setAddDirectInventory] = useState({
    items: {
      type: ""
    }
  })




  const resetAddDirectInventory = () => {
    setAddDirectInventory({
      items: {
        type: ""
      }
    })
  }
  const addManufacturingOrder = async (orderList) => {

    try {
      const response = await axios.post(`${url}/manufacturing/add`, orderList, { params: { type: "Metal" } })

      if (response.data.acknowledged === true) {

        const updatedList = [...manufacturingOrderList];
        const index = manufacturingOrderList.findIndex((document) => document._id === orderList._id)
        updatedList[index] = orderList
        await setmanufacturingOrderList(updatedList);

        return true
      }
      if (response.data) {
        await setmanufacturingOrderList([...manufacturingOrderList, response.data[0]])
        return true
      }
    } catch (e) {
      alert(e);
    }
  }


  const addStoneOrder = async (orderList) => {

    try {
      const response = await axios.post(`${url}/manufacturing/add`, orderList, { params: { type: "Stone" } })


      if (response.data) {
        await setStoneOrderList([...stoneOrderList, response.data[0]])
        return true
      }
    } catch (e) {
      alert(e)
    }
  }

  const addAttrHandler = async (state) => {

    try {



      const addid = { id: uuidv4(), ...state }

      const response = await axios.post(`${url}/attrlist/add`, addid)
      if (response.data) {

        await setAttributesList([...attributesList, addid]);

      }
      else {
        alert("Already Exists");
      }
    } catch (e) {
      alert("Error adding Item")
    }

  }

  const addInventoryHandler = async (inv) => {
    try {
      const addid = { id: uuidv4(), ...inv }
      calcStock(inv)

      const response = await axios.post(`${url}/inventory/add`, addid)
      if (response.data) {

        await setInvList([...invList, addid]);
        resetAddDirectInventory()
      }
      else {
        alert("Already Exists");
        resetAddDirectInventory()
      }
    } catch (e) {
      alert(e)
    }

  }


  const addallowedLabels = async (list, type) => {
    try {

      if (list.length > 0 && type === "Metal") {

        await axios.post(`${url}/manufacturing`, list, { params: { type: "Metal" } })
      }
      if (list.length > 0 && type === "Stone") {

        await axios.post(`${url}/manufacturing`, list, { params: { type: "Stone" } })
      }
    } catch (e) {

    }
  }

  const deleteInvoiceHandler = async (id) => {

    try {
      const response = await axios.delete(`${url}/invoice`, { params: { type: id } })
      if (response) {
        const updatedInvOrder = await invList.filter((order) => order._id !== id)
        await setInvList(updatedInvOrder)
        return true
      }
    } catch (e) {
      console.log(`Error Deleting The Invoice :-> ${e}`)
    }

  }
  const addStockHandler = async (stock, index, reqType) => {
    try {
      if (reqType === "post") {

        const response = await axios.post(`${url}/`, stock, { params: { type: "Stock" } })
        if (response.data) {
          await setAvailableStock([...availableStock, stock])
          return true
        }
      }
      if (reqType === "update") {
        // console.log("Update Request",stock,index)
        const response = await axios.patch(`${url}/`, stock[index])
        if (response.data) {
          await setAvailableStock(stock)
          return true
        }
      }
      return false
    } catch (e) {
      console.log(e)
      return false
    }
  }


  const deleteHandler = async (props, propName) => {
    let response = null

    response = await axios.delete(`${url}/`, { params: { props, propName } });

    if (response.data.acknowledged === true) {
      const newData = await retrieveDataHandler(propName)

      if (propName === "attr") {
        await setAttributesList(newData);
        return true
      }
      if (propName === "mnfOrder") {

        await setmanufacturingOrderList(newData)
        return true
      }
      if (propName === "stoneOrder") {
        await setStoneOrderList(newData)
        return true
      }
      if (propName === 'stock') {
        await setInvList(newData)
        return true
      }
    }
    else {
      alert(response);
    }
  }



  const retrieveDataHandler = async (reqOf) => {
    let response = null

    if (reqOf === "attr") {

      response = await axios.get(`${url}/`, { params: { type: "attr" } });
    }

    if (reqOf === "mnfOrder") {
      response = await axios.get(`${url}/`, { params: { type: "mnfOrder" } });

    }

    if (reqOf === "stoneOrder") {
      response = await axios.get(`${url}/`, { params: { type: "stoneOrder" } });

    }

    if (reqOf === "invOrder") {
      response = await axios.get(`${url}/`, { params: { type: "invOrder" } });

    }
    if (reqOf === "stock") {
      response = await axios.get(`${url}/`, { params: { type: "stock" } });
    }
    if (reqOf === "allowedList") {
      response = await axios.get(`${url}/manufacturing`, { params: { type: "Metal" } });
    }

    return response.data;
  }

  // Loads One time when site starts
  useEffect(() => {
    const timer = setInterval(async () => {
      const getAllAttributes = async () => {
        const response = await retrieveDataHandler("attr");

        setAttributesList(response);
      };
      const getAllOrderList = async () => {
        const response = await retrieveDataHandler("mnfOrder");

        setmanufacturingOrderList(response);
      };
      const getAllStoneOrderList = async () => {
        const response = await retrieveDataHandler("stoneOrder");

        setStoneOrderList(response);
      };
      const getAllinvList = async () => {
        const response = await retrieveDataHandler("invOrder");


        setInvList(response);
      };
      const getAllStock = async () => {
        const response = await retrieveDataHandler("stock");

        setAvailableStock(response);
      };
      getAllinvList();
      getAllStoneOrderList();
      getAllAttributes();
      getAllOrderList();
      getAllStock();
    }, 5000); // Refresh every 5 second
    return () => {
      clearInterval(timer); // Clear the interval when the component unmounts
    };
  }, [])
  // Loads One time when site starts
  useEffect(() => {

    const getAllAttributes = async () => {
      const response = await retrieveDataHandler("attr");

      setAttributesList(response);
    };
    const getAllOrderList = async () => {
      const response = await retrieveDataHandler("mnfOrder");

      setmanufacturingOrderList(response);
    };
    const getAllStoneOrderList = async () => {
      const response = await retrieveDataHandler("stoneOrder");

      setStoneOrderList(response);
    };
    const getAllinvList = async () => {
      const response = await retrieveDataHandler("invOrder");


      setInvList(response);
    };
    const getAllStock = async () => {
      const response = await retrieveDataHandler("stock");

      setAvailableStock(response);
    };
    getAllinvList();
    getAllStoneOrderList();
    getAllAttributes();
    getAllOrderList();
    getAllStock();

  }, [])


  function isObjectPresent(targetObject, list) {
    return list.some((obj) => JSON.stringify(obj.items) === JSON.stringify(targetObject));
  }

  const calcStock = (item) => {

    let items = null
    let qty = null;
    const { purchaseOf, PurchaseItem } = item;
    if (purchaseOf === "Metal") {
      items = { type: "Metal", metalType: PurchaseItem.Metal.metalType };
      qty = PurchaseItem.Metal.metalWeight;
    }
    if (purchaseOf === "Runner") {
      items = {
        type: "Runner",
        runnerColor: PurchaseItem.Runner.runnerColor,
        runnerPurity: PurchaseItem.Runner.runnerPurity
      };
      qty = PurchaseItem.Runner.runnerWeight;
    }
    if (purchaseOf === "Alloy") {
      items = {
        type: "Alloy",
        alloyType: PurchaseItem.Alloy.alloyType
      };

      qty = PurchaseItem.Alloy.alloyWeight;

    }

    if (purchaseOf === "Stone") {

      items = {
        type: "Stone",
        stoneType: PurchaseItem.Stone.stoneType,
        stoneShape: PurchaseItem.Stone.stoneShape,
        stoneSize: PurchaseItem.Stone.stoneSize,
        stoneColor: PurchaseItem.Stone.stoneColor
      };
      qty = PurchaseItem.Stone.stoneQty;
    }

    if (purchaseOf === 'Melt') {

      items = { type: "Metal", metalType: 'Gold' };
      qty = item.Reuse.netGoldReceived;

      // for Runner
      let updatedArray = availableStock
      const i = []
      for (const reuseItem of item.Reuse.reuseList) {
        const runnerDetails = { type: "Runner", runnerColor: reuseItem.runnerColor, runnerPurity: reuseItem.runnerPurity }
        console.log(runnerDetails)
        updatedArray = updatedArray.map((obj, index) => {
          if (JSON.stringify(obj.items) === JSON.stringify(runnerDetails)) {
            console.log(runnerDetails, obj.items)
            i.push(index)
            const tempqty = +Number(obj.qty).toFixed(3)
            const ogqty = +Number(reuseItem.runnerWeight).toFixed(3)

            return { ...obj, qty: +Number(tempqty - ogqty).toFixed(3) }
          }
          else {
            return obj
          }
        });
      }
      if (i.length > 0) {
        for (const index of i) {
          addStockHandler(updatedArray, index, "update")
        }
      }



    }

    if (!(isObjectPresent(items, availableStock))) {
      const stock = { items, qty }
      addStockHandler(stock, 0, "post")
    }


    else {
      let i = null;
      const updatedArray = availableStock.map((obj, index) => {
        if (JSON.stringify(obj.items) === JSON.stringify(items)) {
          i = index
          const tempqty = +Number(obj.qty).toFixed(3)
       
          const ogqty = +Number(qty).toFixed(3)
    
      
          
          return { ...obj, qty: +Number(tempqty + ogqty).toFixed(3) }
        }
        else {
          return obj
        }
      });

      addStockHandler(updatedArray, i, "update")

    }
  }

  // Timer to referesh Evry 10 sec

  useEffect(() => {
    const timer = setInterval(async () => {

      const response = await retrieveDataHandler("attr");
      setAttributesList(response);
    }, 5000); // Refresh every 5 second
    return () => {
      clearInterval(timer); // Clear the interval when the component unmounts
    };
    //eslint-disable-next-line
  }, []);

  const getThisOrderDetail = async (order, listName) => {
    let response = null
    if (listName === "mnfOrder") {

      response = manufacturingOrderList.find((document) => document._id === order._id)
      if (response) {
        await setEditThisOrder(response)
        setEditType("Metal")
        return true
      }
      else {
        return false
      }
    }
    if (listName === "stock") {

      response = availableStock.find((document) => document._id === order._id)

      if (response) {
        await setAddDirectInventory(response)
        return true
      }
      else {
        return false
      }
    }

  }


  useEffect(() => {
    const pendList = []
    manufacturingOrderList.forEach((order) => {
      if (order.receivedDate === "") {
        pendList.push(order)
      }
    })
    setPendingList(pendList)
    const compList = []
    manufacturingOrderList.forEach((order) => {

      if (order.receivedDate !== "") {
        compList.push(order)
      }
    })
    setCompletedList(compList)
  }, [manufacturingOrderList])

  const searchhandler = async (search, type, status) => {

    setSearchTerm(search)

    if (searchTerm !== "" && search !== "") {
      if (type === "mnfOrder") {
        const newordermnfList = await manufacturingOrderList.filter((mnfOrder) => {
          let filterString = []
          const metal = mnfOrder.Metal;
          if (status === "Pending") {
            filterString = [
              mnfOrder.givenDate,
              metal?.metalType,
              metal?.metalColor,
              metal?.metalPurity,
            ].join(" ").toLowerCase();
          }

          if (status === "Completed") {
            filterString = [
              mnfOrder.givenDate,
              mnfOrder.receivedDate,
              metal?.metalType,
              metal?.metalColor,
              metal?.metalPurity,
            ].join(" ").toLowerCase();
          }

          const orderDetails = []
          mnfOrder.orderDetails.forEach((order) => {
            orderDetails.push(order.orderId)
          })

          const orders = orderDetails.join(" ").toLowerCase() + filterString
          return orders.includes(search.toLowerCase())

          // return filterString.includes(search);
        })
        if (status === "Pending") {
          setPendingSearchResults(newordermnfList)
        }
        if (status === "Completed") {
          setCompletedSearchResults(newordermnfList)
        }
      }
      if (type === "stone") {
        const searchLowercase = search.toLowerCase()
        const newStoneOrderList = await stoneOrderList.map((order) => {
          let filterString = []
          filterString.push(order.givenDate)
          const orderDetails = []
          order.stoneOrder.forEach((stoneodr) => {
            orderDetails.push(stoneodr.stoneType)
            orderDetails.push(stoneodr.stoneColor)
            orderDetails.push(stoneodr.stoneSize)
            orderDetails.push(stoneodr.stoneShape)
            orderDetails.push(stoneodr.orderId)
          })
          const orders = orderDetails.join(" ").toLowerCase() + " " + filterString



          if (orders.includes(searchLowercase)) {

            const filtered = order.stoneOrder.filter((stone) =>

              [stone.stoneType, stone.stoneShape, stone.stoneColor, stone.stoneSize, stone.orderId]
                .join(" ")
                .toLowerCase()
                .includes(searchLowercase))

            return {
              ...order, stoneOrder: filtered
            }
          }
          return null
        }).filter((odr) => odr !== null)

        setStoneSearchResults(newStoneOrderList)

      }
    }
    else {
      setPendingSearchResults([])
      setCompletedSearchResults([])
      setStoneSearchResults([])
    }


  }

  return (
    <div className="scrollbar" id="style-2">
      <Router>
        {
          isLoading ? (
            // Render loading screen with moving loading icon
            <React.Fragment>
              <>
                <div class="loading-overlay">
                  <div class="loading-content">
                    <div>

                      <FontAwesomeIcon icon={faScrewdriver} spin size="xl" class="loading-icon" />
                      {/* <FontAwesomeIcon icon={faSpinner} spin size="4x" class="loading-icon" /> */}
                      <span>Loading...</span>
                    </div>
                  </div>
                </div>
              </>
              <>
                <RouterComponent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
              </>
            </React.Fragment>
          ) : (
            <>

              {isAuthenticated && (
                <Header
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                  isAdmin={isAdmin}
                  setIsAdmin={setIsAdmin}
                />
              )}

              <Routes>

                {isAuthenticated ? (
                  <>
                    <Route path="/" element={<Homestats activeItem={activeItem} setActiveItem={setActiveItem} mnfOrderList={manufacturingOrderList} stockToEdit={getThisOrderDetail} stoneOrderList={stoneOrderList} availableStock={availableStock} invList={invList} />} />

                    <Route path="/attrlist" element={<AttributeList deleteFunction={deleteHandler} attributesList={attributesList} />} />

                    <Route path="/attrlist/add" element={<AddAtrribute addAttrHandler={addAttrHandler} />} />

                    <Route path="/manufacturing" element={<Manufacturing deleteHandler={deleteHandler} term={searchTerm} availableStock={availableStock} addStockHandler={addStockHandler} retrieveDataHandler={retrieveDataHandler} addallowedLabels={addallowedLabels} mnfOrderList={manufacturingOrderList} attrList={attributesList} invList={invList} PendingList={pendingSearchResults.length > 0 ? pendingSearchResults : PendingList} CompletedList={completedSearchResults.lenght > 0 ? completedSearchResults : CompletedList} stoneOrderList={stoneSearchResults.length > 0 ? stoneSearchResults : stoneOrderList} searchHandler={searchhandler} orderToEdit={getThisOrderDetail} />} />

                    <Route path="/manufacturing/add" element={<Addmnforder order={firstOrder} addStock={addStockHandler} stock={availableStock} setStock={setAvailableStock} stoneOrder={firstStoneOrder} attr={attributesList} addStoneOrder={addStoneOrder} addManufacturingOrder={addManufacturingOrder} type={"Metal"} />} />

                    <Route path="/manufacturing/edit" element={<Editpendingorders order={editThisOrder} addStock={addStockHandler} stock={availableStock} setStock={setAvailableStock} metalOrder={firstOrder} stoneOrder={firstStoneOrder} attr={attributesList} addManufacturingOrder={addManufacturingOrder} addStoneOrder={addStoneOrder} type={editType} />} />

                    <Route path="/inventory" element={<Inventory stockToEdit={getThisOrderDetail} availableStock={availableStock} />} />

                    <Route path="/invoice" element={<InvoiceData deleteInvoiceHandler={deleteInvoiceHandler} addStockHandler={addStockHandler} availableStock={availableStock} invList={invList} />} />

                    <Route path="/inventory/add" element={<AddInventory activeItem={activeItem} setActiveItem={setActiveItem} inv={addDirectInventory} resetInv={resetAddDirectInventory} attr={attributesList} addInventoryHandler={addInventoryHandler} invList={invList} />} />

                    <Route path="/signup" element={<Authentication setActiveItem={setActiveItem} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} type='signup' />} />

                  </>
                ) : (

                  <>
                    <Route path="/login" element={<Authentication setActiveItem={setActiveItem} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} type='login' isAdmin={isAdmin} setIsAdmin={setIsAdmin} />} />
                    <Route path="*" element={<Authentication setActiveItem={setActiveItem} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} type='login' isAdmin={isAdmin} setIsAdmin={setIsAdmin} />} />
                  </>
                )}
              </Routes>
            </>

          )
        }


      </Router>
    </div>
  )
};

export default App;
