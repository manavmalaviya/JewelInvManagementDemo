
import React, { useEffect, useState } from "react";
import "./maincontent.css"
import "./AddInventory.css"
import DatePicker from "react-datepicker";
import { Link, useNavigate } from "react-router-dom";

const AddInventory = (props) => {



  const navigate = useNavigate()



  const [activeMenu, setActiveMenu] = useState(props.inv.items.type !== "" ? props.inv.items.type : "Metal")

  const [startDate, setStartDate] = useState(new Date())

  const [runnerColor, setRunnerColor] = useState(props.inv.items.type === "Runner" ? props.inv.items.runnerColor : "")
  const [runnerPurity, setRunnerPurity] = useState(props.inv.items.type === "Runner" ? props.inv.items.runnerPurity : "")

  const [runnerWeight, setRunnerWeight] = useState(0)
  const [metalType, setMetalType] = useState(props.inv.items.type === "Metal" ? props.inv.items.metalType : "")
  const [alloyType, setAlloyType] = useState(props.inv.items.type === "Alloy" ? props.inv.items.alloyType : "")
  const [metalWeight, setMetalWeight] = useState(0)
  const [alloyWeight, setAlloyWeight] = useState(0)

  const [selectRadio, setSelectRadio] = useState("openingStock")
  const [purchaseFrom, setPurchaseFrom] = useState("")
  const [purchaseDisplay, setPurchaseDisplay] = useState('none')
  const [stoneType, setStoneType] = useState(props.inv.items.type === "Stone" ? props.inv.items.stoneType : "")
  const [stoneShape, setStoneShape] = useState(props.inv.items.type === "Stone" ? props.inv.items.stoneShape : "")
  const [stoneColor, setStoneColor] = useState(props.inv.items.type === "Stone" ? props.inv.items.stoneColor : "")
  const [stoneSize, setStoneSize] = useState(props.inv.items.type === "Stone" ? props.inv.items.stoneSize : "")
  const [stoneQty, setStoneQty] = useState(0)
  const [inventory, setInventory] = useState({
    purchaseDate: "",
    purchaseType: selectRadio,
    purchaseOf: activeMenu,
    PurchaseItem: {
      Metal: {
        metalType: metalType,
        metalWeight: 0
      },
      Stone: {
        stoneType: stoneType,
        stoneShape: stoneShape,
        stoneSize: stoneSize,
        stoneColor: stoneColor,
        stoneQty: 0,
      },
      Runner: {
        runnerColor: runnerColor,
        runnerPurity: runnerPurity,
        runnerWeight: 0
      },
      Alloy: {
        alloyType: alloyType,
        alloyWeight: 0
      }
    },
    purchaseFrom: "",
    Reuse: {
      reuseList: [{
        runnerColor: '',
        runnerPurity: '',
        runnerWeight: 0,
        expGoldWeight: 0,
      }],
      netRunnerMelted: 0,
      netExpectedGold: 0,
      netGoldReceived: 0,
      netLoss: 0,
    }

  })
  const [reuseArray, setReuseArray] = useState([{
    runnerColor: '',
    runnerPurity: '',
    runnerWeight: 0,
    expGoldWeight: 0,
  }])
  const [netLoss, setNetLoss] = useState(0)
  const [totalExpectedGold, setTotalExpectedGold] = useState(0)
  const [totalGoldReceived, setTotalGoldReceived] = useState(0)
  const [totalRunnerMelted, setTotalRunnerMelted] = useState(0)
  // const [addRunner, setAddRunner] = useState(true)
  const [addBtnRunner, setAddBtnRunner] = useState('none')

  const checkIsOpeningStock = (item, type) => {
    const response = isOpeningStock(item, type)

    // if (item === "Runner") {
    //   if (response === undefined) {

    //     setAddRunner(false)
    //     setInvValues("openingStock", "purchaseType", "inventory")
    //     setInvValues('', 'purchaseFrom', 'inventory')
    //   } else {

    //     setAddRunner(true)
    //   }
    // }
    // else {
    if (response === undefined) {
      setShowOpeningStock('flex')
      setSelectRadio('openingStock')
      setPurchaseDisplay('none')
      setInvValues('openingStock', 'purchaseType', 'inventory')
      setInvValues('', 'purchaseFrom', 'inventory')
    }
    else {
      setSelectRadio('purchase')
      setPurchaseDisplay('flex')
      setInvValues('purchase', 'purchaseType', 'inventory')
      setShowOpeningStock('none')
    }
    // }
  }

  const isOpeningStock = (item, type) => {
    try {
      if (item === "Metal") {
        const response = props.invList.find((inv) => inv.purchaseOf === item && inv.PurchaseItem.Metal.metalType === type && inv.purchaseType === 'openingStock');
        return response;
      }
      if (item === 'Stone') {
        const response = props.invList.find((attr) =>
          attr.purchaseOf === item && inventory.PurchaseItem.Stone.stoneType !== '' &&
          inventory.PurchaseItem.Stone.stoneType === attr.PurchaseItem.Stone.stoneType &&
          inventory.PurchaseItem.Stone.stoneShape !== '' &&
          inventory.PurchaseItem.Stone.stoneShape === attr.PurchaseItem.Stone.stoneShape &&
          inventory.PurchaseItem.Stone.stoneColor !== '' &&
          inventory.PurchaseItem.Stone.stoneColor === attr.PurchaseItem.Stone.stoneColor &&
          type !== '' &&
          attr.PurchaseItem.Stone.stoneSize === type && attr.purchaseType === "openingStock");
        return response;
      }
      if (item === 'Alloy') {
        const response = props.invList.find((inv) => inv.purchaseOf === item && item !== '' && inv.PurchaseItem.Alloy.alloyType === type && inv.purchaseType === 'openingStock');
        return response;
      }
      if (item === 'Runner') {
        // console.log(inventory);
        const response = props.invList.find((inv) => inv.purchaseOf === item && item !== '' && inv.PurchaseItem.Runner.runnerPurity === type && inv.PurchaseItem.Runner.runnerColor === inventory.PurchaseItem.Runner.runnerColor && inv.purchaseType === 'openingStock');
        return response;
      }
    } catch (error) {

      console.error('An error occurred checking for Opening Stock', error);
      return null;
    }
  };


  const [showOpeningStock, setShowOpeningStock] = useState('flex')

  const setDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setInvValues(new Date(), "purchaseDate", "inventory");
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
    //eslint-disable-next-line
  }, []);

  const checkEmptyFields = () => {

    let purchaseValid = true;
    if (activeMenu !== 'Melt') {

      if (inventory.purchaseType === "purchase" && activeMenu !== 'Melt') {
        if (inventory.purchaseFrom === "") {
          purchaseValid = false;
        }

      }
      else {
        purchaseValid = true
      }
      const fields = Object.entries([inventory.PurchaseItem[activeMenu]][0]);

      for (const field of fields) {
        const i = field[0]

        if (!inventory.PurchaseItem[activeMenu][i]) {
          return { isValid: false, fielditem: i, purchaseValid: purchaseValid };
        }
      }
      // No empty values found
      return { isValid: true, fielditem: null, purchaseValid: purchaseValid };
    }
    else {

      if (inventory.Reuse.netGoldReceived !== 0) {
        let isValid = null
        let values = null
        inventory.Reuse.reuseList.forEach((inv) => {
          Object.entries(inv).forEach(([keys, value]) => {
            if (keys !== 'expGoldWeight') {

              if ((values !== '' || values !== 0)) {
                isValid = true
                values = keys
              }
              else {
                isValid = false
                values = value
              }
            }

          })
        })
        return { isValid: isValid, fielditem: values, purchaseValid: true }
      }
      else {
        return { isValid: false, fielditem: 'netGoldReceived', purchaseValid: true }
      }
    }
  };



  const add = (e) => {

    e.preventDefault()
    const { isValid, fielditem, purchaseValid } = checkEmptyFields()


    if (isValid && purchaseValid) {
      const updatedList = { ...inventory };
      const filteredPurchaseItem = {};
      if (activeMenu !== "Melt") {
        Object.entries(updatedList.PurchaseItem).forEach(([key, value]) => {
          if (key === activeMenu) {
            filteredPurchaseItem[key] = value;
          }
        });
      }
      else {
        filteredPurchaseItem['Metal'] = {
          metalType: "Gold",
          metalWeight: inventory.Reuse.netGoldReceived
        }
      }
      updatedList.PurchaseItem = filteredPurchaseItem;

      props.addInventoryHandler(updatedList)
      navigate("/invoice")
      props.setActiveItem('/invoice')
    }
    else {
      if (isValid && !(purchaseValid)) {
        alert("Enter Purchase From")
      }
      else {
        alert(fielditem + " is Empty")
      }
    }

  }

  const handleItemClick = (item) => {

    setReuseArray([{
      runnerColor: '',
      runnerPurity: '',
      runnerWeight: 0,
      expGoldWeight: 0,
    }])
    setMetalType('')
    setMetalWeight('')
    setAlloyWeight('')
    setStoneType('')
    setStoneColor('')
    setStoneShape('')
    setAlloyType('')
    setStoneSize('')
    setSelectRadio('openingStock')
    setShowOpeningStock('flex')
    setPurchaseDisplay('none')
    setInvValues(item, "purchaseOf", "inventory")
    setActiveMenu(item)
  }


  const handleRadioClick = (select) => {

    if (select === "openingStock") {
      setPurchaseFrom("")
      setInvValues("", "purchaseFrom", "inventory")
    }
    setSelectRadio(select);

  }

  const setInvValues = async (value, propName, parent) => {


    if (parent === "Metal") {

      setInventory((Inv) => ({
        ...Inv, PurchaseItem: {
          ...Inv.PurchaseItem, Metal: {
            ...Inv.PurchaseItem.Metal, [propName]: value
          }
        }
      }))


    }
    if (parent === "Stone") {

      setInventory((Inv) => ({
        ...Inv, PurchaseItem: {
          ...Inv.PurchaseItem, Stone: {
            ...Inv.PurchaseItem.Stone, [propName]: value
          }
        }
      }))
    }
    if (parent === "Runner") {

      setInventory((Inv) => ({
        ...Inv, PurchaseItem: {
          ...Inv.PurchaseItem, Runner: {
            ...Inv.PurchaseItem.Runner, [propName]: value
          }
        }
      }))
    }
    if (parent === "Alloy") {

      setInventory((Inv) => ({
        ...Inv, PurchaseItem: {
          ...Inv.PurchaseItem, Alloy: {
            ...Inv.PurchaseItem.Alloy, [propName]: value
          }
        }
      }))
    }

    if (parent === "inventory") {
      if (propName === "purchaseDate") {
        setStartDate(value)
        value = setDate(value)

      }
      setInventory((Inv) => ({
        ...Inv, [propName]: value
      }))
    }
  }

  const metalTypeRender = [...new Set(props.attr.map((metal) => {
    if (metal.Type === "Metal") {
      return metal.Metal.metalType
    }
    else {
      return null
    }
  }
  ))].filter((metal) => metal !== null).map((metal) => {
    return (
      <option value={metal} key={metal}>{metal}</option>
    );
  });



  const runnerColorRender = [...new Set(props.attr.map((metal) => {

    if (metal.Type === "Metal") {
      return metal.Metal.metalColor
    }
    else {
      return null
    }
  }
  ))].filter((metal) => metal !== null).map((metal) => {
    return (
      <option value={metal} key={metal}>{metal}</option>
    );
  });


  const alloyTypeRender = [...new Set(props.attr.map((metal) => {

    if (metal.Type === "Metal" && metal.Metal.Alloy.alloyColor !== "") {
      return metal.Metal.metalColor
    }
    else {
      return null
    }
  }

  ))].filter((metal) => metal !== null).map((metal) => {
    return (
      <option value={metal} key={metal}>{metal}</option>
    );
  });


  const runnerPurityRender = [...new Set(props.attr.map((metal) => {
    if (metal.Type === "Metal" && metal.Metal.metalColor === runnerColor) {
      return metal.Metal.metalPurity
    }
    else {
      return null
    }
  }
  ))].filter((metal) => metal !== null).map((metal) => {

    return (
      <option value={metal} key={metal}>{metal}</option>
    );
  });



  const stoneTypeRenderer = [...new Set(props.attr.map((stone) => {
    if (stone.Type === "Stone") {
      return stone.Stone.stoneType
    }
    else {
      return null
    }
  }
  ))].filter((stone) => stone !== null).map((stone) => {
    return (
      <option value={stone} key={stone}>{stone}</option>
    );
  })

  const stoneShapeRenderer = [...new Set(props.attr.map((attrs) => {
    if (attrs.Type === "Stone") {
      if (attrs.Stone.stoneType === stoneType) {
        return attrs.Stone.stoneShape
      }
      else {
        return null
      }
    }
    return null

  }))].filter((attrs) => attrs !== null).map((attrs) => {

    return (
      <option key={attrs} value={attrs}>{attrs}</option>
    );
  })


  const stoneColorRenderer = [...new Set(props.attr.map((attrs) => {
    if (attrs.Type === "Stone") {
      if (attrs.Stone.stoneType === stoneType) {
        if (attrs.Stone.stoneShape === stoneShape) {
          return attrs.Stone.stoneColor
        }
        else {
          return null
        }
      }
      else {
        return null
      }
    }
    return null

  }))].filter((attrs) => attrs !== null).map((attrs) => {

    return (
      <option key={attrs} value={attrs}>{attrs}</option>
    );
  })

  const stoneSizeRenderer = props.attr.map((attr) => {
    if (attr.Type === "Stone" && attr.Stone.stoneType === stoneType && attr.Stone.stoneShape === stoneShape && attr.Stone.stoneColor === stoneColor) {
      return (attr.Stone.stoneSize.map((size) =>
        <option key={"size" + size.size} value={size.size}>{size.size}</option>
      ))
    }
    return null
  })


  const handlecancel = () => {
    // location
    navigate('/inventory')

  }

  const [addBtnDisplay, setAddBtnDisplay] = useState(true)

  const addOrderField = () => {


    const pushOrder = () => {

      let valid = checkEntryEmpty()

      if (valid) {

        if (runnerColor !== "Silver") {

          setAddBtnRunner("block")
          setAddBtnDisplay(false)
          setInventory((reuseOrder) => ({
            ...reuseOrder, Reuse: { ...reuseOrder.Reuse, reuseList: reuseArray }
          }))
        }
        else {
          setAddBtnDisplay(false)
          setInventory((reuseOrder) => ({
            ...reuseOrder, Reuse: { ...reuseOrder.Reuse, reuseList: reuseArray }
          }))
        }
      }
    };

    const removeOrder = async (index) => {

      setAddBtnRunner("none")
      const updatedArray = reuseArray.filter((_, i) => i !== index);
      await setReuseArray(updatedArray);
      setInventory((reuseOrder) => ({
        ...reuseOrder, Reuse: {
          ...reuseOrder.Reuse, reuseList: updatedArray
        }
      }))

    };

    const checkEntryEmpty = () => {
      let valid = null
      for (const [index, singleEntry] of Object.entries(reuseArray)) {

        for (const [key, value] of Object.entries(singleEntry)) {

          if ((value !== '' && value !== 0) || (key === 'expGoldWeight')) {
            valid = true
            continue;
          }
          else {
            valid = false
            alert(`${key} is empty in ${Number(index) + 1} row`)
            break;
          }
        }
        if (valid === true) {
          continue
        }
        else {
          break;
        }
      }
      return valid
    }

    const addNewField = () => {
      let valid = checkEntryEmpty()
      if (valid) {
        setAddBtnDisplay(true)
        setAddBtnRunner("none")
        setReuseArray([...reuseArray, {
          runnerColor: '',
          runnerPurity: '',
          runnerWeight: 0,
          expGoldWeight: 0,
        }]);
      }
    };

    return (
      <div>

        {reuseArray.map((order, index) => (
          <div key={index}>
            <div className="toRowInv melt">
              <select className="ui dropdown" value={order?.runnerColor} onChange={(e) => { setOrderDetail(index, 'runnerColor', e.target.value); setRunnerColor(e.target.value) }} style={{ minWidth: "110px", width: order.runnerColor === 'Silver' ? '15vw' : '10vw' }}>
                <option value="" >Color</option>
                {runnerColorRender}
              </select>

              <select className="ui dropdown" value={order?.runnerPurity} onChange={(e) => { setOrderDetail(index, 'runnerPurity', e.target.value); setRunnerPurity(e.target.value) }} style={{ minWidth: "110px", width: order.runnerColor === 'Silver' ? '15vw' : '10vw' }}>
                <option value=""  >Purity</option>
                {runnerPurityRender}
              </select>

              <div className="ui right labeled input" >
                <input
                  type="number"
                  min='0'
                  step={'0.5'}
                  name="reuseRunnerWeight"
                  placeholder="Runner Weight"
                  style={{ minWidth: "110px", width: order.runnerColor === 'Silver' ? '15vw' : '10vw' }}
                  value={order.runnerWeight !== 0 ? order.runnerWeight : ''}
                  className="dropdownnput"

                  onChange={(e) => { setOrderDetail(index, "runnerWeight", +Number(e.target.value).toFixed(3)) }}
                />

                <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                  <div className="text">gms</div>
                </div>

              </div>
              <div className="ui right labeled input" style={{ display: order.runnerColor === 'Silver' ? 'none' : 'block' }}>
                <input
                  type="number"
                  min='0'
                  step={'0.5'}
                  disabled={true}
                  name="estimatedGoldWeight"
                  placeholder="Est. Gold Weight"
                  style={{ minWidth: "110px", width: "10vw" }}
                  value={order.expGoldWeight}
                  className="dropdownnput"
                />
                <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                  <div className="text">gms</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button className="ui button blue" style={{ height: "fit-content", marginRight: '1rem' }} onClick={(e) => { e.preventDefault(); pushOrder() }}>Add</button>

                <button className="ui button blue" style={{ height: "fit-content", marginRight: '1rem', display: addBtnRunner }} onClick={(e) => { e.preventDefault(); addNewField(index); }}>+</button>

                {reuseArray.length > 1 && (
                  <button
                    className="ui button blue"
                    style={{ marginRight: '1rem' }}
                    onClick={(e) => {
                      e.preventDefault();
                      removeOrder(index)
                    }}
                  >
                    -
                  </button>
                )}
              </div>
            </div>
          </div>

        ))}

      </div>

    );
  };


  useEffect(() => {

    if (reuseArray.runnerWeight !== 0 && reuseArray.runnerColor !== '' && reuseArray.runnerPurity !== "") {
      calcTotalRunnerMelted()
    }
    //eslint-disable-next-line
  }, [reuseArray])
  const setOrderDetail = (index, propName, value) => {

    setAddBtnRunner("none")

    if (propName === 'runnerWeight' && reuseArray[index].runnerColor !== '' && reuseArray[index].runnerColor !== 'Silver' && reuseArray[index].runnerPurity !== '' && reuseArray[index].runnerPurity !== '925') {

      calcExpGoldWeight(index, value)

    }

    setReuseArray((orders) => {
      const updatedOrders = [...orders];
      updatedOrders[index] = { ...updatedOrders[index], [propName]: value };
      return updatedOrders;
    });
  }

  const calcExpGoldWeight = (index, value) => {
    if (reuseArray[index].runnerColor !== 'Silver') {
      let gold = 0;
      if (reuseArray[index].runnerPurity === '10K') {
        gold = 0.42 * value
      }
      if (reuseArray[index].runnerPurity === '14K') {
        gold = 0.59 * value
      }
      if (reuseArray[index].runnerPurity === '18K') {
        gold = 0.755 * value
      }

      setReuseArray((orders) => {
        const updatedOrders = [...orders];
        updatedOrders[index] = { ...updatedOrders[index], expGoldWeight: Number(gold.toFixed(3)) };
        return updatedOrders;
      });
      calcTotalExpectedGold(index, gold)
      // return gold
    }

  }

  const calcTotalRunnerMelted = (index, value) => {
    const tot = reuseArray.reduce((accumulator, melt, i) => {
      return accumulator + melt.runnerWeight;
    }, 0);
    setTotalRunnerMelted(Number(tot).toFixed(3));
    setInventory({
      ...inventory,
      Reuse: {
        ...inventory.Reuse,
        netRunnerMelted: +Number(tot).toFixed(3)
      }
    });

    return tot

  }

  const calcNetLoss = (value) => {
    if (totalExpectedGold !== 0) {
      const loss = +Number((value - totalExpectedGold).toFixed(3))

      setNetLoss(Math.abs(loss))


      setInventory({
        ...inventory, Reuse: {
          ...inventory.Reuse, netLoss: Math.abs(loss), netGoldReceived: +Number(value).toFixed(3)
        }
      })
    }
    else {

      setInventory({
        ...inventory, Reuse: {
          ...inventory.Reuse, netGoldReceived: +Number(value).toFixed(3)
        }
      })
    }
  }

  const calcTotalExpectedGold = (index, value) => {

    let tot = 0
    reuseArray.forEach((melt, i) => {

      if (index !== i) {

        tot += melt.expGoldWeight
      }
      if (index === i) {
        tot += value
      }
    })
    setTotalExpectedGold(+Number(tot.toFixed(3)))
    setInventory({
      ...inventory, Reuse: {
        ...inventory.Reuse, netExpectedGold: +Number(tot.toFixed(3))
      }
    })

  }

  return (
    <div className="mainContent">

      <div className="ui two button invorders">
        <div className="ui top attached tabular menu invorders" style={{ display: "flex", flexWrap: "Wrap", cursor: 'default' }}>
          <div className={`item ${activeMenu === 'Metal' ? 'active' : ''} `} style={{ cursor: "pointer" }} onClick={() => handleItemClick('Metal')}>
            Metal
          </div>
          <div className={`item ${activeMenu === 'Stone' ? 'active' : ''} `} style={{ cursor: "pointer" }} onClick={() => handleItemClick('Stone')} >
            Stone
          </div>

          <div className={`item ${activeMenu === 'Runner' ? 'active' : ''} `} style={{ cursor: "pointer" }} onClick={() => handleItemClick('Runner')} >
            Runner
          </div>
          <div className={`item ${activeMenu === 'Alloy' ? 'active' : ''} `} style={{ cursor: "pointer" }} onClick={() => handleItemClick('Alloy')} >
            Alloy
          </div>
          <div className={`item ${activeMenu === 'Melt' ? 'active' : ''} `} style={{ cursor: "pointer" }} onClick={() => handleItemClick('Melt')} >
            Melt
          </div>

        </div>


        {/* Metal */}

        <div className="ui bottom attached segment invorders" style={{ display: activeMenu === "Metal" ? "" : "none" }} >

          <div className="ui form">

            <div className="ui icon" style={{ display: "flex", justifyContent: "flex-end" }}>
              <i className="cancel icon" style={{ cursor: "pointer", color: "grey" }} onClick={() => { props.resetInv(); handlecancel() }}></i>
            </div>

            <div className="toRowInv" style={{ marginLeft: "5vw" }}>
              <select className="ui dropdown" value={metalType} style={{ marginRight: " 1rem", marginTop: " 1rem" }} onChange={(e) => { setMetalType(e.target.value); setInvValues(e.target.value, "metalType", "Metal"); checkIsOpeningStock(activeMenu, e.target.value) }}>
                <option value="">Type</option>
                {metalTypeRender}
              </select>

              <div className="ui right labeled input" style={{ marginTop: " 1rem" }}>
                <input
                  type="number"
                  name="metalWeight"
                  placeholder="Metal Weight"
                  min='0'
                  step={'0.5'}
                  style={{ minWidth: "110px", width: "15vw" }}
                  value={metalWeight || ""}
                  className="dropdownnput"
                  onChange={(e) => { setInvValues(+Number(e.target.value).toFixed(3), "metalWeight", "Metal"); setMetalWeight(+Number(e.target.value).toFixed(3)) }}
                />
                <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                  <div className="text">gms</div>

                </div>
              </div>
            </div>

            <div style={{ minWidth: "110px", width: "15vw", display: showOpeningStock, marginLeft: '5vw', justifyContent: 'flex-start', alignItems: 'center' }}>
              <div style={{ minWidth: "110px", display: 'flex', justifyContent: 'flex-start', width: "15vw", margin: '0' }}>
                <DatePicker selected={startDate} placeholderText="DD/MM/YY" dateFormat="dd/MM/yy" onChange={(date) => { date !== null ? setInvValues(date, "purchaseDate", "inventory") : setStartDate('') }} />
              </div>
            </div>

            <div className="toRowInv" style={{ marginLeft: "5vw", alignItems: 'center' }}>

              <div className="ui radio checkbox" style={{ marginRight: "2rem", display: showOpeningStock, minWidth: "110px", width: "15vw", }} >
                <input type="radio" name="radio" onChange={() => { handleRadioClick("openingStock"); setPurchaseDisplay("none"); setInvValues("openingStock", "purchaseType", "inventory") }} checked={selectRadio === "openingStock" ? "checked" : ""} />
                <label>Opening Stock</label>
              </div>
              <div className="ui radio checkbox" style={{ display: "flex", minWidth: "110px", width: "15vw" }}>
                <input type="radio" name="radio" onChange={() => { handleRadioClick("purchase"); setPurchaseDisplay("flex"); setInvValues("purchase", "purchaseType", "inventory") }} checked={selectRadio === "purchase" ? "checked" : ""} />
                <label>Purchase</label>
              </div>

              <div style={{ minWidth: "110px", width: "15vw", display: showOpeningStock === 'flex' ? 'none' : 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <div style={{ minWidth: "110px", width: "15vw" }}>
                  <DatePicker selected={startDate} placeholderText="DD/MM/YY" dateFormat="dd/MM/yy" onChange={(date) => { date !== null ? setInvValues(date, "purchaseDate", "inventory") : setStartDate('') }} />
                </div>
              </div>

            </div>

            <div className="toRowInv" style={{ display: purchaseDisplay, marginLeft: "5vw" }} >
              <div className="ui input">
                <input
                  type="purchaseFrom"
                  name="metalPurchase"
                  placeholder="Purchase From"
                  style={{ minWidth: "110px", width: "15vw", marginTop: "0.5rem" }}
                  value={purchaseFrom}
                  onChange={(e) => { setInvValues(e.target.value, "purchaseFrom", "inventory"); setPurchaseFrom(e.target.value) }}
                />
              </div>
            </div>

            <div style={{ display: "flex", marginLeft: "5vw", justifyContent: "flex-Start" }}>
              <div className="ui button blue" style={{ display: "flex", width: "90px", justifyContent: "center" }}
                onClick={(e) => add(e)}>Add</div>
            </div>
          </div>
        </div>

        {/* Stone */}

        <div className="ui bottom attached segment invorders" id="style-2" style={{ height: '80vh', display: activeMenu === "Stone" ? "" : "none" }} >

          <div className="ui form">

            <div className="ui icon" style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>

              <i className="cancel icon" style={{ cursor: "pointer", color: "grey" }} onClick={() => { props.resetInv(); handlecancel() }}></i>

            </div>


            <div className="toRowInv stone">

              <select className="ui dropdown" value={stoneType} style={{ marginTop: "1rem" }} onChange={(e) => { setStoneType(e.target.value); setInvValues(e.target.value, "stoneType", "Stone") }}>
                <option value="">Stone Type</option>
                {stoneTypeRenderer}
              </select>

              <select className="ui dropdown" value={stoneShape} style={{ marginTop: "1rem" }} onChange={(e) => { setStoneShape(e.target.value); setInvValues(e.target.value, "stoneShape", "Stone") }}>
                <option value="">Stone Shape</option>
                {stoneShapeRenderer}
              </select>

              <select className="ui dropdown" value={stoneColor} style={{ marginTop: "1rem" }} onChange={(e) => { setStoneColor(e.target.value); setInvValues(e.target.value, "stoneColor", "Stone") }}>
                <option value="">Stone Color</option>
                {stoneColorRenderer}

              </select>

              <select className="ui dropdown" value={stoneSize} style={{ marginTop: "1rem" }} onChange={(e) => { setInvValues(e.target.value, "stoneSize", "Stone"); setStoneSize(e.target.value); checkIsOpeningStock(activeMenu, e.target.value) }} >
                <option value="">Stone Size</option>
                {stoneSizeRenderer}
              </select>
            </div>

            <div className="toRowInv" style={{ marginLeft: "5vw" }}>
              <div className="ui right labeled input" style={{ marginRight: '5.5rem', minWidth: "110px", width: "15vw" }}>
                <input
                  type="number"
                  min='0'
                  step={'1'}
                  name="stoneQty"
                  placeholder="Qty"
                  pattern="[0-9]*"
                  style={{ minWidth: "150px", width: "12vw" }}
                  value={stoneQty || ""}
                  className="dropdownnput"
                  onChange={(e) => { setInvValues(e.target.validity.valid ? +Number(e.target.value) : 0, "stoneQty", "Stone"); setStoneQty(e.target.validity.valid ? +Number(e.target.value).toFixed(3) : "") }}
                />
                <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                  <div className="text">nos</div>
                </div>
              </div>

              <div style={{ display: 'flex', minWidth: "110px", width: "15vw", justifyContent: 'flex-start', alignItems: 'center' }}>
                <div style={{ width: 'fit-content' }}>
                  <DatePicker selected={startDate} placeholderText="DD/MM/YY" dateFormat="dd/MM/yy" onChange={(date) => { date !== null ? setInvValues(date, "purchaseDate", "inventory") : setStartDate('') }} />
                </div>
              </div>

            </div>

            <div className="toRowInv" style={{ marginLeft: "5vw", marginTop: '0' }}>
              <div className="ui radio checkbox" style={{ marginRight: "1rem", display: showOpeningStock }}>
                <input type="radio" name="radio1" onChange={() => { handleRadioClick("openingStock"); setPurchaseDisplay("none"); setInvValues("openingStock", "purchaseType", "inventory") }} checked={selectRadio === "openingStock" ? "checked" : ""} />
                <label>Opening Stock</label>
              </div>

              <div className="ui radio checkbox" style={{ marginRight: "1rem" }}>
                <input type="radio" name="radio1" onChange={() => { handleRadioClick("purchase"); setPurchaseDisplay("flex"); setInvValues("purchase", "purchaseType", "inventory") }} checked={selectRadio === "purchase" ? "checked" : ""} />
                <label>Purchase</label>
              </div>
            </div>
            <div className="toRowInv" style={{ marginLeft: "5vw", display: purchaseDisplay }} >
              <div className="ui input">
                <input
                  type="purchaseFrom"
                  name="stonePurchase"
                  placeholder="Purchase From"
                  style={{ minWidth: "110px", width: "15vw", marginTop: "0.5rem" }}
                  value={purchaseFrom}
                  onChange={(e) => { setInvValues(e.target.value, "purchaseFrom", "inventory"); setPurchaseFrom(e.target.value) }}
                />
              </div>
            </div>
            <div style={{ display: "flex", marginLeft: "5vw", justifyContent: "flex-Start" }}>
              <div className="ui button blue" style={{ display: "flex", width: "90px", justifyContent: "center" }} onClick={(e) => { add(e) }}>Add</div>
            </div>

          </div>
        </div>


        {/* Runner */}

        <div className="ui bottom attached segment invorders" style={{ display: activeMenu === "Runner" ? "" : "none" }} >

          <div className="ui form">

            <div className="ui icon" style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <Link to={"/inventory"}>
                <i className="cancel icon" style={{ cursor: "pointer", color: "grey" }} onClick={() => { props.resetInv(); handlecancel() }}></i>
              </Link>
            </div>

            <div className="toRowInv Runner">


              <select className="ui dropdown" defaultValue={runnerColor} onChange={(e) => { setInvValues(e.target.value, "runnerColor", "Runner"); setRunnerColor(e.target.value) }} style={{ marginTop: "1rem", marginRight: "5vw" }}>
                <option value="" >Color</option>
                {runnerColorRender}
              </select>

              <select className="ui dropdown" defaultValue={props.inv.items.type === "Runner" ? props.inv.items.runnerPurity : ""} onChange={(e) => { setInvValues(e.target.value, "runnerPurity", "Runner"); checkIsOpeningStock(activeMenu, e.target.value) }} style={{ marginTop: "1rem", marginRight: "5vw" }}>
                <option value=""  >Purity</option>
                {runnerPurityRender}
              </select>

              <div className="ui right labeled input" style={{ marginTop: "1rem" }}>

                <input
                  type="number"
                  min='0'
                  step={'0.5'}
                  name="runnerWeight"
                  placeholder="Runner Weight"
                  style={{ minWidth: "110px", width: "15vw" }}
                  value={runnerWeight || ""}
                  className="dropdownnput"

                  onChange={(e) => { setInvValues(+Number(e.target.value).toFixed(3), "runnerWeight", "Runner"); setRunnerWeight(e.target.value) }}
                />
                <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                  <div className="text">gms</div>
                </div>
              </div>
            </div>

            <div className="toRowInv" style={{ marginLeft: "4vw", alignItems: 'center', display: showOpeningStock }}>


              <div style={{ minWidth: "110px", width: "15vw", display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <div style={{ minWidth: "110px", width: "15vw" }}>
                  <DatePicker selected={startDate} placeholderText="DD/MM/YY" dateFormat="dd/MM/yy" onChange={(date) => { date !== null ? setInvValues(date, "purchaseDate", "inventory") : setStartDate('') }} />
                </div>
              </div>

            </div>

            <div className="toRowInv" style={{ marginLeft: "5vw", marginTop: '0', alignItems: "center", display:"flex"}}>
              <div className="ui radio checkbox" style={{ marginRight: "2rem", minWidth: "110px", width: "15vw", display: showOpeningStock }}>
                <input type="radio" name="radio2" onChange={() => { handleRadioClick("openingStock"); setPurchaseDisplay("none"); setInvValues("openingStock", "purchaseType", "inventory") }} checked={selectRadio === "openingStock" ? "checked" : ""} />
                <label>Opening Stock</label>
              </div>

              <div className="ui radio checkbox" style={{ minWidth: "110px", width: "15vw", marginRight: "5vw",display:"flex" }}>
                <input type="radio" name="radio2" onChange={() => { handleRadioClick("purchase"); setPurchaseDisplay("flex"); setInvValues("purchase", "purchaseType", "inventory") }} checked={selectRadio === "purchase" ? "checked" : ""} />
                <label>Note</label>
              </div>

              <div style={{ minWidth: "110px", width: "15vw", display: showOpeningStock === 'flex' ? 'none' : "flex", alignItems: 'center' }}>
                <div style={{  }}>
                  <DatePicker selected={startDate} placeholderText="DD/MM/YY" dateFormat="dd/MM/yy" onChange={(date) => { date !== null ? setInvValues(date, "purchaseDate", "inventory") : setStartDate('') }} />
                </div>
              </div>
            </div>
            <div className="toRowInv" style={{ marginLeft: "5vw", display: purchaseDisplay }} >
              <div className="ui input">
                <input
                  type="text"
                  name="runnerNote"
                  placeholder="Note"
                  style={{ minWidth: "110px", width: "15vw", marginTop: "0.5rem" }}
                  value={purchaseFrom}
                  onChange={(e) => { setInvValues(e.target.value, "purchaseFrom", "inventory"); setPurchaseFrom(e.target.value) }}
                />
              </div>
            </div>



            <div style={{ display: "flex", marginLeft: "5vw", justifyContent: "flex-Start" }}>
              <button className="ui button blue" style={{ display: "flex", width: "90px", justifyContent: "center" }}
                onClick={(e) => add(e)}>Add</button>
            </div>


          </div>
          <div className="ui bottom attached segment invorders" style={{ display: activeMenu === "Stone" ? "" : "none" }} >

          </div>
        </div>


        {/* Alloy */}
        <div className="ui bottom attached segment invorders" style={{ display: activeMenu === "Alloy" ? "" : "none" }} >

          <div className="ui form">

            <div className="ui icon" style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <Link to={"/inventory"}>
                <i className="cancel icon" style={{ cursor: "pointer", color: "grey" }} onClick={() => { props.resetInv(); handlecancel() }}></i>
              </Link>
            </div>

            <div className="toRowInv alloy" style={{ marginLeft: "5vw" }}>

              <select className="ui dropdown" value={alloyType} style={{ marginRight: " 1rem", marginTop: " 1rem" }} onChange={(e) => { setAlloyType(e.target.value); setInvValues(e.target.value, "alloyType", "Alloy"); checkIsOpeningStock(activeMenu, e.target.value) }}>
                <option value="">Alloy Type</option>
                {alloyTypeRender}
              </select>

              <div className="ui right labeled input" style={{ marginRight: " 1rem", marginTop: " 1rem" }}>

                <input
                  type="number"

                  name="alloyWeight"
                  placeholder="Alloy Weight"
                  min='0'
                  step={'0.5'}
                  style={{ minWidth: "110px", width: "15vw" }}
                  value={alloyWeight || ""}
                  className="dropdownnput"
                  onChange={(e) => { setInvValues(+Number(e.target.value).toFixed(3), "alloyWeight", "Alloy"); setAlloyWeight(+Number(e.target.value).toFixed(3)) }}
                />
                <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                  <div className="text">gms</div>
                </div>
              </div>
            </div>
            <div style={{ minWidth: "110px", width: "15vw", display: showOpeningStock, marginLeft: '5vw', justifyContent: 'flex-start', alignItems: 'center' }}>
              <div style={{ minWidth: "110px", display: 'flex', justifyContent: 'flex-start', width: "15vw", margin: '0' }}>
                <DatePicker selected={startDate} placeholderText="DD/MM/YY" dateFormat="dd/MM/yy" onChange={(date) => { date !== null ? setInvValues(date, "purchaseDate", "inventory") : setStartDate('') }} />
              </div>
            </div>

            <div className="toRowInv" style={{ marginLeft: "5vw", alignItems: 'center' }}>

              <div className="ui radio checkbox" style={{ marginRight: "2rem", display: showOpeningStock, minWidth: "110px", width: "15vw", }} >
                <input type="radio" name="radio3" onChange={() => { handleRadioClick("openingStock"); setPurchaseDisplay("none"); setInvValues("openingStock", "purchaseType", "inventory") }} checked={selectRadio === "openingStock" ? "checked" : ""} />
                <label>Opening Stock</label>
              </div>
              <div className="ui radio checkbox" style={{ display: "flex", minWidth: "110px", width: "15vw" }}>
                <input type="radio" name="radio3" onChange={() => { handleRadioClick("purchase"); setPurchaseDisplay("flex"); setInvValues("purchase", "purchaseType", "inventory") }} checked={selectRadio === "purchase" ? "checked" : ""} />
                <label>Purchase</label>
              </div>

              <div style={{ minWidth: "110px", width: "15vw", display: showOpeningStock === 'flex' ? 'none' : 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <div style={{ minWidth: "110px", width: "15vw" }}>
                  <DatePicker selected={startDate} placeholderText="DD/MM/YY" dateFormat="dd/MM/yy" onChange={(date) => { date !== null ? setInvValues(date, "purchaseDate", "inventory") : setStartDate('') }} />
                </div>
              </div>

            </div>
            <div className="toRowInv" style={{ marginLeft: "5vw", display: purchaseDisplay }}  >
              <div className="ui input">

                <input
                  type="purchaseFrom"
                  name="runnerPurchase"
                  placeholder="Purchase From"
                  style={{ minWidth: "110px", width: "15vw", marginTop: "0.5rem" }}
                  value={purchaseFrom}
                  onChange={(e) => { setInvValues(e.target.value, "purchaseFrom", "inventory"); setPurchaseFrom(e.target.value) }}
                />
              </div>
            </div>
            <div style={{ display: "flex", marginLeft: "5vw", justifyContent: "flex-Start" }}>
              <button className="ui button blue" style={{ display: "flex", width: "90px", justifyContent: "center" }}
                onClick={(e) => add(e)}>Add</button>
            </div>



          </div>
        </div>

        {/* Melt */}
        <div className="ui bottom attached segment invorders" style={{ display: activeMenu === "Melt" ? "" : "none" }} >

          <div className="ui form">

            <div className="ui icon" style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <Link to={"/inventory"}>
                <i className="cancel icon" style={{ cursor: "pointer", color: "grey" }} onClick={() => { props.resetInv(); handlecancel() }}></i>
              </Link>
            </div>

            <div className="toRowInv" style={{ marginLeft: "", alignItems: 'flex-start', display: 'flex', flexDirection: "column", paddingLeft: runnerColor === 'Silver' ? "1.5rem" : "1rem" }}>
              <div className="ui header" style={{ display: "flex", alignItems: "center", marginLeft: "2rem" }}>Date</div>
              <div style={{ marginLeft: "1rem", minWidth: "110px", width: "15vw", display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <div style={{ minWidth: "110px", width: "15vw" }}>
                  <DatePicker selected={startDate} placeholderText="DD/MM/YY" dateFormat="dd/MM/yy" onChange={(date) => { date !== null ? setInvValues(date, "purchaseDate", "inventory") : setStartDate('') }} />
                </div>
              </div>
            </div>

            {addOrderField()}

            <div className="toRowInv melt" style={{ justifyContent: runnerColor === 'Silver' ? 'flex-start' : 'space-between', marginTop: "2rem" }}>
              <div className="ui right labeled input" style={{ display: 'block', marginLeft: runnerColor === 'Silver' ? "3.5vw" : "3vw" }}>
                <input
                  type="number"
                  min='0'
                  step={'0.5'}
                  disabled={true}
                  name="totalRunnerMelted"
                  placeholder="Total Runner Melted"
                  style={{ minWidth: "110px", width: "10vw" }}
                  value={totalRunnerMelted === 0 ? "" : totalRunnerMelted}
                  className="dropdownnput"

                  onChange={(e) => { }}
                />

                <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                  <div className="text">gms</div>
                </div>
              </div>

              <div className="ui right labeled input" style={{ display: runnerColor === 'Silver' ? 'none' : 'block' }}>
                <input
                  type="number"
                  min='0'
                  step={'0.5'}
                  disabled={true}
                  name="totalExpectedGold"
                  placeholder="Total Expected Gold"
                  style={{ minWidth: "110px", width: "10vw" }}
                  value={totalExpectedGold === 0 ? "" : totalExpectedGold}
                  className="dropdownnput"

                  onChange={(e) => { }}
                />
                <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                  <div className="text">gms</div>
                </div>
              </div>

              <div className="ui right labeled input" style={{ display: 'block', marginLeft: runnerColor === 'Silver' ? '3.5vw' : "0" }}>
                <input
                  type="number"
                  min='0'
                  step={'0.5'}
                  name="totalGoldReceived"
                  placeholder="Total Gold Received"
                  style={{ minWidth: "110px", width: "10vw" }}
                  value={totalGoldReceived === 0 ? '' : totalGoldReceived}
                  className="dropdownnput"
                  onChange={(e) => {
                    calcNetLoss(e.target.value); setTotalGoldReceived(e.target.value)
                  }}
                />
                <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                  <div className="text">gms</div>
                </div>
              </div>

              <div className="ui right labeled input" style={{ display: runnerColor === 'Silver' ? 'none' : 'block' }}>
                <input
                  type="number"
                  min='0'
                  step={'0.5'}
                  disabled={true}
                  name="netLoss"
                  placeholder="Net Loss"
                  style={{ minWidth: "110px", width: "10vw" }}
                  value={netLoss === 0 ? '' : netLoss}
                  className="dropdownnput"

                  onChange={(e) => { }}
                />
                <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                  <div className="text">gms</div>
                </div>
              </div>
              <div style={{ minWidth: "110px", width: "10vw" }}></div>
            </div>


            <div style={{ display: "flex", marginLeft: "5vw", justifyContent: "flex-Start" }} >
              <button className="ui button blue" disabled={addBtnDisplay} style={{ display: "flex", width: "90px", justifyContent: "center" }}
                onClick={(e) => add(e)}>Add</button>
            </div>


          </div>

        </div>

      </div>
    </div>
  )
}
export default AddInventory