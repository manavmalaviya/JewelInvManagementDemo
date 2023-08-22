
import React, { useEffect, useState } from "react"
import { Line } from 'react-chartjs-2'
import { Icon, Divider, Dropdown, Statistic } from 'semantic-ui-react'
import "./maincontent.css";
import "./home.css";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, //x axis
  LinearScale, //y axis
  PointElement,
  Tooltip,

} from 'chart.js';
ChartJS.register(
  LineElement,
  CategoryScale, LinearScale,
  PointElement,
  Tooltip

);

const Homestats = (props) => {


  // const headers = [
  //   { label: 'Name', key: 'name' },
  //   { label: 'Age', key: 'age' },
  //   // Add more headers as needed
  // ];

  // const data = [
  //   { name: 'John Doe', age: 25 },
  //   { name: 'Jane Smith', age: 30 },
  //   // Add more data objects as needed
  // ];

  // const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const shortMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const navigate = useNavigate()
  const [goldLossList, setGoldLossList] = useState([])
  const [silverLossList, setSilverLossList] = useState([])
  const setDate = (date) => {
    const parts = date === "" ? "" : date.split('/');
    const day = date === "" ? "" : parseInt(parts[0], 10);
    const month = date === "" ? "" : parseInt(parts[1], 10) - 1;
    const year = date === "" ? "" : 2000 + parseInt(parts[2], 10);

    const formatedDate = new Date(year, month, day)
    return formatedDate
  }

  const [selectedYear, setSelectedYear] = useState((new Date()).getFullYear());

  const [selectedType, setSelectedType] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {



    const goldData = [];
    const silverData = [];

    props.mnfOrderList.forEach((order) => {
      const newDate = setDate(order.givenDate);
      const year = newDate.getFullYear();


      if (year === selectedYear) {
        if (order.Metal.metalType === "Silver") {
          if (order.orderDetails[0].orderWeight > 0) {
            const obj = { x: shortMonth[newDate.getMonth()], y: order.netLoss };
            silverData.push(obj);
          } else {
            const obj = { x: shortMonth[newDate.getMonth()], y: order.castingLoss };
            silverData.push(obj);
          }
        }
        if (order.Metal.metalType === "Gold") {
          if (order.orderDetails[0].orderWeight > 0) {
            const obj = { x: shortMonth[newDate.getMonth()], y: order.netLoss };
            goldData.push(obj);
          } else {
            const obj = { x: shortMonth[newDate.getMonth()], y: order.castingLoss };
            goldData.push(obj);
          }
        }
      }
    });

    props.invList.forEach((inv) => {
      const newDate = setDate(inv.purchaseDate);
      const year = newDate.getFullYear();

      if (year === selectedYear && inv.purchaseOf === 'Melt') {
        const obj = { x: shortMonth[newDate.getMonth()], y: inv.Reuse.netLoss };
        goldData.push(obj);
      }
    });

    setSilverLossList(silverData);
    setGoldLossList(goldData);

    const calcMonthLoss = (list, prop) => {
      let losses = []
      shortMonth.forEach((Month) => {
        let loss = 0;
        list.forEach((order) => {
          if (order.x === Month) {
            loss += order.y
          }
        })
        
        losses.push(+Number(loss).toFixed(3))
      })
      if (prop === "gold") {

        setGoldLossList(losses)
      }
      if (prop === "silver") {
        setSilverLossList(losses)
      }
    }
    if (goldData.length > 0) {

      calcMonthLoss(goldData, "gold")
    }
    if (silverData.length > 0) {
      calcMonthLoss(silverData, "silver")
    }
    // eslint-disable-next-line
  }, [props.mnfOrderList,selectedYear])




  const gdata = {
    labels: shortMonth,
    datasets: [
      goldLossList.length > 0 && {
        label: "Monthly Loss (Gold)",
        data: goldLossList,
        backgroundColor: 'rgba(0, 123, 255, 0.4)',
        borderColor: "rgba(0, 123, 255, 1)",
        pointBorderColor: "rgba(0, 123, 255, 1)",
        tension: 0.1,
        borderWidth: 2,
        pointBackgroundColor: "rgba(0, 123, 255, 1)",
        pointRadius: 3,
        pointHoverRadius: 4,
      },
      silverLossList.length > 0 && {
        label: "Monthly Loss (Silver)",
        data: silverLossList,
        backgroundColor: 'rgba(255, 193, 7, 0.4)',
        borderColor: "rgba(255, 193, 7, 1)",
        pointBorderColor: "rgba(255, 193, 7, 1)",
        tension: 0.1,
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 193, 7, 1)",
        pointRadius: 3,
        pointHoverRadius: 4,
      },
    ].filter(Boolean),
  }


  const options = {
    plugins: {
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(0, 0, 0, 0.8)",
        borderWidth: 1,
      },
      legend: {
        display: false,
      }
    },
    interaction: {
      mode: "index",
      intersect: false,
      intersectAxis: "x",
      cursor: "pointer", // Cursor style on hover
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(0, 0, 0, 0.6)",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: "rgba(0, 0, 0, 0.6)",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
  }

  const stoneRenderer = (prop) => {
    const uniqueStones = [...new Set(props.availableStock.map((stone, key) => {
      if (stone.items.type === "Stone") {
        return stone.items[prop];
      } else {
        return null;
      }
    }))].filter((stone) => stone !== null);

    const options = uniqueStones.map((stone, index) => {
      return { key: stone + index.toString(), value: stone, text: stone };
    });


    return options;
  };

  let stoneTypeOptions = stoneRenderer("stoneType");
  stoneTypeOptions.unshift({ key: "blank1", value: "", text: "Type" })
  let stoneShapeOptions = stoneRenderer("stoneShape");
  stoneShapeOptions.unshift({ key: "blank2", value: "", text: "Shape" })
  let stoneColorOptions = stoneRenderer("stoneColor");
  stoneColorOptions.unshift({ key: "blank3", value: "", text: "Color" })
  let stoneSizeOptions = stoneRenderer("stoneSize");
  stoneSizeOptions.unshift({ key: "blank4", value: "", text: "Size" })

  let totgoldloss = 0
  goldLossList.forEach((loss) => {

    totgoldloss += loss
  })
  let totsilverloss = 0
  silverLossList.forEach((loss) => {

    totsilverloss += loss
  })

  props.availableStock.sort((a, b) => a.qty - b.qty)


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
  let index =0;
  const lessStockRenderer = props.availableStock.map((stock) => {
    if (stock.items.type === "Metal" && stock.qty < threshHoldQty(stock.items.type, stock.items.metalType)) {
      index++
      return (<div key={index} className="item">
        <Statistic size='mini'>
          <Statistic.Label>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: "10px" }}>
              <span className="index">{index}</span>
              <span style={{ marginLeft: '0.5em', font: "10px", width: "fit-content" }}> Metal</span>
            </div>
          </Statistic.Label>

          <Statistic.Label className="content">
            <div className="btmContent" style={{ color: "red" }}>
              <div className="itemdesc">{stock.items.runnerColor} {stock.items.metalType}</div>
              <div style={{ display: 'flex', width: "60px", marginRight: "10px", alignItems: 'center', justifyContent: "flex-end" }}>
                <div className="itemqty" style={{ marginRight: "0.5rem" }}>{stock.qty}</div>
                <div className="plusicon" onClick={() => handleIconClick(stock)}>
                  <Icon className={'plus square icon'} />
                </div>
              </div>
            </div>
          </Statistic.Label>
        </Statistic>
      </div>)
    }
    // if (stock.items.type === "Runner") {
    //   return (<div key={index} className="item">
    //     <Statistic size='mini'>
    //       <Statistic.Label>
    //         <div style={{ display: 'flex', alignItems: 'center', marginBottom: "10px" }}>
    //           <span className="index">{index + 1}</span>
    //           <span style={{ marginLeft: '0.5em', font: "10px", width: "fit-content" }}>Runner</span>
    //         </div>
    //       </Statistic.Label>
    
    //       <Statistic.Label className="content">
    //         <div className="btmContent"  >
    //           <div className="itemdesc">
    //             {stock.items.runnerColor} {stock.items.runnerPurity}</div>
    //           <div style={{ display: 'flex', width: "60px", marginRight: "10px", alignItems: 'center', justifyContent: "flex-end" }}>
    //             <div className="itemqty" style={{ marginRight: "0.5rem" }}>{stock.qty}</div>
    //             <div className="plusicon" onClick={() => handleIconClick(stock)}>
    //               <Icon />
    //             </div>
    //           </div>
    //         </div>
    //       </Statistic.Label>
    //     </Statistic>      </div>)
    // }
    if (stock.items.type === "Alloy" && stock.qty < threshHoldQty(stock.items.type, stock.items.alloyType)) {
    index++
    return (<div key={index} className="item">
        <Statistic size='mini'>
          <Statistic.Label>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: "10px" }}>
              <span className="index">{index }</span>
              <span style={{ marginLeft: '0.5em', width: "fit-content" }}>Alloy</span>
            </div>
          </Statistic.Label>

          <Statistic.Label className="content">
            <div className="btmContent" style={{ color: "red" }}>

              <div className="itemdesc">{stock.items.runnerColor} {stock.items.alloyType}</div>

              <div style={{ display: 'flex', width: "60px", marginRight: "10px", alignItems: 'center', justifyContent: "flex-end" }}>
                <div className="itemqty" style={{ marginRight: "0.5rem" }}>{stock.qty}</div>
                <div className="plusicon" onClick={() => handleIconClick(stock)}>
                  <Icon className={'plus square icon'} />
                </div>
              </div>
            </div>

          </Statistic.Label>
        </Statistic>
      </div>)
    }
    // if (stock.items.type === "Stone") {
    //   return (<div key={index} className="item">
    //     <Statistic size='mini'>
    //       <Statistic.Label>
    //         <div style={{ display: 'flex', alignItems: 'center', marginBottom: "10px" }}>
    //           <span className="index" >{index + 1}</span>
    //           <span style={{ marginLeft: '0.5em', font: "10px", width: "fit-content" }}>Stone</span>
    //         </div>
    //       </Statistic.Label>

    //       <Statistic.Label className={stock.qty < threshHoldQty(stock.items.type, stock.items.stoneSize) ? 'content' : ''}>
    //         <div className="btmContent" style={stock.qty < threshHoldQty(stock.items.type, stock.items.stoneSize) ? { color: "red" } : {}}>
    //           <div className="itemdesc">{stock.items.stoneShape} {stock.items.stoneType}  {stock.items.stoneColor} {stock.items.stoneSize} mm</div>

    //           <div style={{ display: 'flex', width: "60px", marginRight: "10px", alignItems: 'center', justifyContent: "flex-end" }}>
    //             <div className="itemqty" style={{ marginRight: "0.5rem" }}>{stock.qty}</div>
    //             <div className="plusicon" onClick={() => handleIconClick(stock)}>
    //               <Icon className={stock.qty < threshHoldQty(stock.items.type, stock.items.stoneSize) ? 'plus square icon' : ''} />
    //             </div>
    //           </div>
    //         </div>

    //       </Statistic.Label>
    //     </Statistic>
    //   </div>
    //   )
    // } 
    return null
  })


  const handleIconClick = async (id) => {
    const response = await props.stockToEdit(id, "stock")
    if (response) {
      navigate("/inventory/add")
      props.setActiveItem("/inventory")
    }
  }

  const lessStoneStockRenderer = () => {
    let index = 0;
    if (selectedType === "Type") {
      setSelectedType("")
    }
    if (selectedColor === "Color") {
      setSelectedColor("")
    }
    if (selectedShape === "Shape") {
      setSelectedShape("")
    }
    if (selectedSize === "Size") {
      setSelectedSize("")
    }
    return props.availableStock.map((stock) => {
      if (
        stock.items.type === "Stone" &&
        (!selectedType || stock.items.stoneType === selectedType) &&
        (!selectedShape || stock.items.stoneShape === selectedShape) &&
        (!selectedColor || stock.items.stoneColor === selectedColor) &&
        (!selectedSize || stock.items.stoneSize === selectedSize)&& stock.qty < threshHoldQty(stock.items.type, stock.items.stoneSize)
      ) {
        index++
        return (
          <div className="item" key={stock._id}>
            <Statistic size="mini">
              <Statistic.Label>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: "10px" }}>
                  <span className="index">{index}</span>
                  <span style={{ marginLeft: '0.5em', font: "10px", width: "fit-content" }}>Stone</span>
                </div>
              </Statistic.Label>
              <Statistic.Label className={'content'}>
                <div className="btmContent" style={{ color: "red" }}>
                  <div className="itemdesc">{stock.items.stoneShape} {stock.items.stoneType} {stock.items.stoneColor} {stock.items.stoneSize} mm</div>
                  <div style={{ display: 'flex', width: "50px", alignItems: 'center', justifyContent: "flex-end" }}>
                    <div className="itemqty" style={{ marginRight: "0.5rem" }}>{stock.qty}</div>
                    <div className="plusicon" onClick={() => handleIconClick(stock)}>
                      <Icon className={ 'plus square icon' } />
                    </div>
                  </div>
                </div>
              </Statistic.Label>
            </Statistic>
          </div>
        );
      }
      return null;
    }).filter(Boolean);
  }

  const handleYearChange = (date) => {
    if (date) {
      setSelectedYear(date.getFullYear());
    } else {
      setSelectedYear(null);
    }
  };

  // const handleTypeChange = (e, { value }) => {
  //   setSelectedType(value);
  // };

  // const handleShapeChange = (e, { value }) => {
  //   setSelectedShape(value);
  // };

  // const handleColorChange = (e, { value }) => {
  //   setSelectedColor(value);
  // };

  // const handleSizeChange = (e, value) => {
  //   console.log(e)
  //   setSelectedSize(value);
  // };



  return (
    <div className="chart-container mainContent">


      <div className="top-chart ">
        <div className="card graph">

          <div className="topAnanlyisBar ">
            <div className="ui form" style={{ width: "30%" }}>
              <DatePicker

                placeholderText=""
                dateFormat="yyyy"
                showYearPicker
                selected={new Date(selectedYear, 0, 1) }
                wrapperClassName="year-picker-wrapper"
                onChange={handleYearChange}
              />
              {/* date !== null ? setValues(date, "givenDate", "common") : setStartDate('')  */}
            </div>
            <div className="loss-cards">
              <div className="small-card">
                <Statistic size="mini">
                  <Statistic.Label>Gold Loss</Statistic.Label>
                  <Statistic.Value>{+Number(totgoldloss).toFixed(3)}</Statistic.Value>
                </Statistic>
              </div>
              <div className="small-card">
                <Statistic size="mini">
                  <Statistic.Label>Silver Loss</Statistic.Label>
                  <Statistic.Value>{+Number(totsilverloss).toFixed(3)}</Statistic.Value>
                </Statistic>
              </div>
            </div>
          </div>
          <Line data={gdata} options={options} />
        </div>

        <div className="card lessStock" id="style-2">
          <div className="ui relaxed divided list">
            {lessStockRenderer}
          </div>
        </div>
      </div>
      <div className="top-chart" >
        <div className="card lessstone" >
          <div className="stone-options">
            <Dropdown
              placeholder="Type"
              selection
              className="custom-dropdown"
              options={stoneTypeOptions}
              onChange={(e) => { lessStoneStockRenderer(); setSelectedType(e.target.outerText) }}
            />
            <Dropdown
              placeholder="Shape"
              selection
              className="custom-dropdown"
              onChange={(e) => { lessStoneStockRenderer(); setSelectedShape(e.target.outerText) }}
              options={stoneShapeOptions}
            />
            <Dropdown
              placeholder="Color"
              selection
              className="custom-dropdown"
              onChange={(e) => { lessStoneStockRenderer(); setSelectedColor(e.target.outerText) }}

              options={stoneColorOptions}
            />
            <Dropdown
              placeholder="Size"
              selection
              className="custom-dropdown"
              onChange={(e) => { lessStoneStockRenderer(); setSelectedSize(e.target.outerText) }}
              options={stoneSizeOptions}
            />
          </div>
          <Divider />
          <div className="lessStoneStock" id="style-2">
            <div className="ui relaxed divided list">
              {lessStoneStockRenderer("")}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Homestats;
