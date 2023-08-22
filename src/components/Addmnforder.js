import React, { useState, useEffect, useRef } from "react";
import "./maincontent.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddmnfOrder.css"
import { Link, useNavigate } from "react-router-dom";
const Addmnforder = (props) => {



    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState(props.type)
    const [mnfOrder, setManufacturingOrder] = useState(props.order);
    const [stoneOrder, setStoneOrder] = useState(props.stoneOrder);

    const parts = mnfOrder.givenDate === "" ? "" : mnfOrder.givenDate.split('/');
    const day = mnfOrder.givenDate === "" ? "" : parseInt(parts[0], 10);
    const month = mnfOrder.givenDate === "" ? "" : parseInt(parts[1], 10) - 1;
    const year = mnfOrder.givenDate === "" ? "" : 2000 + parseInt(parts[2], 10);

    const [startDate, setStartDate] = useState(mnfOrder.givenDate === "" ? new Date() : new Date(year, month, day));
    const [endDate, setEndDate] = useState(mnfOrder.receivedDate === "" ? '' : null);

    // const [endDate, setEndDate] = useState(activeMenu==="Metal"? (mnfOrder.receivedDate ===""?undefined: new Date(mnfOrder.receivedDate)): (stoneOrder.receivedDate!=="" ?new Date(stoneOrder.receivedDate):undefined));

    const [metalType, setMetalType] = useState(mnfOrder.Metal.metalType);
    const [runnerColor, setRunnerColor] = useState(mnfOrder.Runner.runnerColor);
    const [metalColor, setMetalColor] = useState(mnfOrder.Metal.metalColor);
    // const [runnerPurity, setRunnerPurity] = useState(mnfOrder.Runner.runnerPurity);
    const [metalPurity, setMetalPurity] = useState(mnfOrder.Metal.metalPurity);
    const [alloyColor, setAlloyColor] = useState(mnfOrder.Metal.Alloy.alloyColor);
    const [metalWeight, setMetalWeight] = useState(mnfOrder.Metal.metalWeight);
    const [alloyWeight, setAlloyWeight] = useState(mnfOrder.Metal.Alloy.alloyWeight);
    const [runnerWeight, setRunnerWeight] = useState(mnfOrder.Runner.runnerWeight);
    const [totalRunnerReceived, setTotalRunnerReceived] = useState(mnfOrder.totalRunnerReceived);

    const initalRunner = useRef(mnfOrder.Runner.runnerWeight);
    const initalMetal = useRef(mnfOrder.Metal.metalWeight);
    const initalAlloy = useRef(mnfOrder.Metal.Alloy.alloyWeight);
    const initaltotal = useRef(mnfOrder.totalRunnerReceived);


    const [orderArray, setOrderArray] = useState(mnfOrder.orderDetails);
    const [stoneOrderArray, setStoneOrderArray] = useState(stoneOrder.stoneOrder);
    const [alloyDisplay, setAlloyDisplay] = useState(metalType === "Gold" ? "block" : "none");
    const [addBtnStone, setAddBtnStone] = useState("none");
    const [addBtnMetal, setAddBtnMetal] = useState("none");
    const [totalWeightGiven, setTotalWeightGiven] = useState(mnfOrder.totalMetalGiven);
    const [totalMetalReceived, setTotalMetalReceived] = useState(mnfOrder.totalMetalReceived);
    const [castingLoss, setCastingLoss] = useState(mnfOrder.castingLoss);
    const [netLoss, setNetLoss] = useState(mnfOrder.netLoss);
    const [usedInOrder, setUsedInOrder] = useState(mnfOrder.usedInOrder || 0);


    const setDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate
    }
    useEffect(() => {


        const formattedDate = setDate(startDate)
        setValues(formattedDate, "givenDate", "initialDate")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        const castLoss = totalWeightGiven - totalMetalReceived


        setCastingLoss(Number(castLoss.toFixed(3)))
        setValues(Number(castLoss.toFixed(3)), "castingLoss", "mnfOrder")
        // }
        // else {

        //     setTotalMetalReceived(0)
        //     setValues(Number(castLoss.toFixed(3)), "castingLoss", "mnfOrder")
        //     alert("Metal received is more the given")
        // }
        // eslint-disable-next-line
    }, [totalMetalReceived, totalWeightGiven])

    useEffect(() => {
        let usedInOrder = totalMetalReceived - totalRunnerReceived;


        if (usedInOrder >= 0) {
            setUsedInOrder(Number(usedInOrder.toFixed(3)));
            setValues(Number(usedInOrder.toFixed(3)), "usedInOrder", "mnfOrder");
        } else {
            alert('Runner Received is greater than metal received');
            setTotalRunnerReceived(0)
            setValues(Number(usedInOrder.toFixed(3)), "usedInOrder", "mnfOrder");
        }

        // eslint-disable-next-line
    }, [totalMetalReceived, totalRunnerReceived]);




    useEffect(() => {
        let usedForOrder = 0;
        orderArray.forEach((order) => {
            usedForOrder += order.orderWeight
        })
        const netLoss = totalWeightGiven - (totalRunnerReceived + usedForOrder)

        setNetLoss(Number(netLoss.toFixed(3)))
        setValues(Number(netLoss.toFixed(3)), "netLoss", "mnfOrder")

        // eslint-disable-next-line
    }, [orderArray, totalRunnerReceived, totalWeightGiven])

    useEffect(() => {
        // Calculate the total weight when any of the weights change
        const total = metalWeight + alloyWeight + runnerWeight;
        setTotalWeightGiven(Number(total.toFixed(3)));

        setValues(Number(total.toFixed(3)), "totalMetalGiven", "mnfOrder")
        // eslint-disable-next-line 
    }, [metalWeight, alloyWeight, runnerWeight])

    const handleItemClick = (Item) => {
        setActiveMenu(Item)
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


    const metalColorRender = [...new Set(props.attr.map((metal) => {

        if (metal.Type === "Metal" && metal.Metal.metalType === metalType) {
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

    // const metalColorRender = [...new Set(props.attr.map((metal)=>{
    //     if(metal.Type==="Metal" &&  metal.Metal.metalType === metalType){
    //        
    //         return metal.Metal.metalColor
    //     }
    // })) ].filter((metal)=> metal !== null).map((metal)=>{
    //     return (
    //         <option key={metal.Metal.metalColor} value={metal.Metal.metalColor}>
    //             {metal.Metal.metalColor}
    //         </option>
    //     );
    // })


    const metalPurityRender = props.attr.map((attrs) => {
        if (attrs.Type === "Metal") {
            if (attrs.Metal.metalType === metalType && attrs.Metal.metalColor === metalColor) {
                return (
                    <option key={attrs.Metal.metalPurity} value={attrs.Metal.metalPurity}>
                        {attrs.Metal.metalPurity}
                    </option>
                );
            }
        }
        else {
            return null; // Exclude the option when the condition is not met
        }
        return null;
    });


    const stoneTypeRenderer = (index) => {
        return [...new Set(props.attr.map((stone) => {
            if (stone.Type === "Stone") {
                return stone.Stone.stoneType
            }
            else {
                return null
            }
        }
        ))].filter((stone) => stone !== null).map((stone) => {

            return (
                <option value={stone} key={stone + index.toString()} >{stone}</option>
            );

        })
    }

    const stoneShapeRenderer = (index) => {
        return [...new Set(props.attr.map((attrs) => {
            if (attrs.Type === "Stone") {

                if (attrs.Stone.stoneType === stoneOrderArray[index].stoneType) {

                    return attrs.Stone.stoneShape
                }
                else {
                    return null;
                }

            }
            return null
        }))].filter((attrs) => { return attrs !== null }).map((attrs) => {


            return (
                <option key={attrs + index.toString()} value={attrs} >{attrs}</option>
            );
        })
    }


    const stoneColorRenderer = (index) => {
        return [...new Set(props.attr.map((attrs) => {
            if (attrs.Type === "Stone") {
                if (attrs.Stone.stoneType === stoneOrderArray[index].stoneType && attrs.Stone.stoneShape === stoneOrderArray[index].stoneShape) {

                    return attrs.Stone.stoneColor

                }

                return null

            }

            return null

        }))].filter((attrs) => attrs !== null).map((attrs) => {

            return (
                <option key={attrs + index.toString()} value={attrs} >{attrs} </option>
            );
        })
    }

    const stoneSizeRenderer = (index) => {
        return props.attr.map((attr) => {
            if (attr.Type === "Stone" && attr.Stone.stoneType === stoneOrderArray[index].stoneType && attr.Stone.stoneShape === stoneOrderArray[index].stoneShape && attr.Stone.stoneColor === stoneOrderArray[index].stoneColor) {
                return (attr.Stone.stoneSize.map((size) =>
                    <option key={size.size + index.toString()} value={size.size} >{size.size}</option>
                ))
            }
            return null
        })
    }


    const addOrderField = () => {
        const pushOrder = () => {
            if (activeMenu === "Metal") {
                setAddBtnMetal("block")
                setManufacturingOrder((mnfOrder) => ({
                    ...mnfOrder, orderDetails: orderArray
                }))
            }
            if (activeMenu === "Stone") {
                setAddBtnStone("block")
                setStoneOrder((stoneOrder) => ({
                    ...stoneOrder, stoneOrder: stoneOrderArray
                }))
            }
        };

        const removeOrder = async (index) => {

            if (activeMenu === "Metal") {
                setAddBtnMetal('none')
                const updatedArray = orderArray.filter((_, i) => i !== index);
                await setOrderArray(updatedArray);
                setManufacturingOrder((mnfOrder) => ({
                    ...mnfOrder, orderDetails: updatedArray
                }))
            }

            if (activeMenu === "Stone") {
                setAddBtnStone('none')
                const updatedArray = stoneOrderArray.filter((_, i) => i !== index);
                await setStoneOrderArray(updatedArray);
                setStoneOrder((stoneOrder) => ({
                    ...stoneOrder, stoneOrder: updatedArray
                }))
            }
        };

        const addNewField = (index) => {


            if (activeMenu === "Metal") {
                setAddBtnMetal("none")
                setOrderArray([...orderArray, { orderId: "", orderWeight: 0 }]);

            }
            if (activeMenu === "Stone") {
                setAddBtnStone("none")

                setStoneOrderArray([...stoneOrderArray, {
                    stoneQty: 0,
                    brokenQty: 0,
                    orderId: stoneOrderArray[index].orderId,
                    stoneType: stoneOrderArray[index].stoneType,
                    stoneShape: stoneOrderArray[index].stoneShape,
                    stoneColor: stoneOrderArray[index].stoneColor,
                    stoneSize: ""
                }]);


            }
        };


        return (
            <div>

                <div style={{ display: activeMenu === "Metal" ? "block" : "none" }}>

                    {orderArray.map((order, index) => (
                        <div style={{ display: "flex", alignItem: "center" }} key={index}>

                            <div className="toRowMnfExtended">
                                <div className="toRowMnfExtended" style={{ marginLeft: "0" }}>
                                    <div className="toColumnMnf">
                                        <div>Order Id</div>
                                        <div className="ui input" style={{ border: "1px solid black", borderRadius: "5px" }}>
                                            <input
                                                type="text"
                                                name="tempOrderId"
                                                placeholder="Order Id"
                                                style={{ minWidth: "110px", width: "15vw" }}
                                                value={order.orderId || ""}
                                                className="dropdownnput"
                                                onChange={(e) => setOrderDetail(index, "orderId", capitaliseWord(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div className="toColumnMnf" style={{ marginLeft: "1vw" }}>
                                        <div>Order Weight</div>
                                        <div className="ui right labeled input" style={{ border: "1px solid black", borderRadius: "5px" }}>
                                            <input
                                                type="number"
                                                min='0'
                                                step={'0.5'}
                                                name="tempOrderWeight"
                                                placeholder="Order Weight"

                                                style={{ minWidth: "110px", width: "15vw" }}
                                                value={order.orderWeight || ''}
                                                className="dropdownnput"
                                                onChange={(e) => setOrderDetail(index, "orderWeight", +Number(e.target.value).toFixed(3))}
                                            />
                                            <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                                                <div className="text">gms</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="toRowMnfExtended" style={{ display: "flex", marginLeft: "auto" }}>
                                <button className="ui button blue" style={{ marginRight: '1rem' }} onClick={(e) => { e.preventDefault(); pushOrder() }}>Add</button>
                                <button className="ui button blue" style={{ marginRight: '1rem', display: addBtnMetal }} onClick={(e) => { e.preventDefault(); addNewField() }}>+</button>
                                {orderArray.length > 1 && (
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
                    ))}
                </div>

                <div style={{ display: activeMenu === "Stone" ? "block" : "none" }}>
                    {stoneOrderArray.map((order, index) => (
                        <div style={{ display: "flex", alignItems: "center" }} key={index}>
                            <div className="indexNumber">{index + 1}</div>

                            <div className="toColumnMnf" style={{ width: '100%', marginTop: '0' }} key={index}>
                                <div className="toRowInv stone">

                                    <select className="ui dropdown"
                                        defaultValue={stoneOrderArray[index]?.stoneType}

                                        style={{ marginTop: "1rem" }} onChange={(e) => { e.preventDefault(); setOrderDetail(index, "stoneType", e.target.value); }}>
                                        <option value="">Stone Type</option>
                                        {stoneTypeRenderer(index)}
                                    </select>

                                    <select className="ui dropdown"
                                        defaultValue={stoneOrderArray[index]?.stoneShape}
                                        style={{ marginTop: "1rem" }}
                                        onChange={(e) => {

                                            setOrderDetail(index, "stoneShape", e.target.value)
                                        }}
                                    >
                                        <option value="">Stone Shape</option>
                                        {stoneShapeRenderer(index)}

                                    </select>

                                    <select className="ui dropdown"
                                        defaultValue={stoneOrderArray[index]?.stoneColor}
                                        style={{ marginTop: "1rem" }} onChange={(e) => { setOrderDetail(index, "stoneColor", e.target.value) }}>
                                        <option value="">Stone Color</option>
                                        {stoneColorRenderer(index)}

                                    </select>

                                    <select className="ui dropdown"
                                        defaultValue={stoneOrderArray[index]?.stoneSize}
                                        style={{ marginTop: "1rem" }} onChange={(e) => { setOrderDetail(index, "stoneSize", e.target.value) }}>
                                        <option value="">Stone Size</option>
                                        {stoneSizeRenderer(index)}
                                    </select>
                                </div>

                                <div style={{ display: "flex", alignItem: "center" }} key={index}>
                                    <div className="toRowMnfExtended" style={{ marginLeft: "5.5vw" }}>
                                        <div className="toColumnMnf">
                                            <div>Order Id</div>
                                            <div className="ui labeled input">
                                                <input
                                                    type="text"
                                                    name="tempOrderId1"
                                                    placeholder="Order Id"
                                                    style={{ minWidth: "110px", width: "15vw" }}
                                                    value={order.orderId || ""}
                                                    className="dropdownnput"
                                                    onChange={(e) => setOrderDetail(index, "orderId", capitaliseWord(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        <div className="toColumnMnf" style={{ marginLeft: "1vw" }}>

                                            <div>Stone Qty</div>

                                            <div className="ui right labeled input" >
                                                <input
                                                    type="number"
                                                    name="stoneQty"
                                                    min='0'
                                                    step={'1'}
                                                    pattern="[0-9]*"
                                                    placeholder="Qty"
                                                    style={{ minWidth: "150px", width: "12vw" }}
                                                    value={order.stoneQty || ""}
                                                    className="dropdownnput"
                                                    onWheel={(e) => e.target.blur()}
                                                    onChange={(e) => { setOrderDetail(index, "stoneQty", e.target.validity.valid ? +Number(e.target.value) : 0) }}
                                                />

                                                <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                                                    <div className="text">nos</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="toColumnMnf" style={{ marginLeft: "1vw" }}>
                                            <div>Broken Qty</div>
                                            <div className="ui right labeled input" >
                                                <input
                                                    type="number"
                                                    name="brokenQty"
                                                    min='0'
                                                    step={'0.5'}
                                                    pattern="[0-9]*"
                                                    placeholder="Qty"
                                                    style={{ minWidth: "150px", width: "12vw" }}
                                                    value={order.brokenQty || ""}
                                                    className="dropdownnput"
                                                    onWheel={(e) => e.target.blur()}
                                                    onChange={(e) => { setOrderDetail(index, "brokenQty", e.target.validity.valid ? +Number(e.target.value) : 0) }}

                                                />
                                                <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                                                    <div className="text">nos</div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                    <div className="toRowMnfExtended" style={{ display: "flex", marginLeft: "auto" }}>
                                        <button className="ui button blue" style={{ marginRight: '1rem' }} onClick={(e) => { e.preventDefault(); pushOrder() }}>Add</button>
                                        <button className="ui button blue" style={{ marginRight: '1rem', display: addBtnStone }} onClick={(e) => { e.preventDefault(); addNewField(index); }}>+</button>
                                        {stoneOrderArray.length > 1 && (
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
                                <div className={stoneOrderArray.length > 0 && index !== (stoneOrderArray.length - 1) ? "ui divider" : ''}> </div>

                            </div>
                        </div>

                    ))}
                </div>
            </div>

        );
    };

    const setOrderDetail = (index, propName, value) => {

        if (activeMenu === "Metal") {
            setAddBtnMetal("none")

            setOrderArray((orders) => {
                const updatedOrders = [...orders];
                updatedOrders[index] = { ...updatedOrders[index], [propName]: value };
                return updatedOrders;
            });

        }

        if (activeMenu === "Stone") {
            setAddBtnStone("none")
            setStoneOrderArray((orders) => {
                const updatedOrders = [...orders];
                updatedOrders[index] = { ...updatedOrders[index], [propName]: value };
                return updatedOrders;

            });

        }
    }

    const capitaliseWord = (values) => {
        return values = values.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    const setValues = async (value, propName, parent) => {


        if (parent === "Alloy") {

            await setManufacturingOrder((mnfOrder) => ({
                ...mnfOrder, Metal: {
                    ...mnfOrder.Metal, Alloy: {
                        ...mnfOrder.Metal.Alloy, [propName]: value
                    }
                }
            }))
        }

        if (parent === "Metal") {

            await setManufacturingOrder((mnfOrder) => ({
                ...mnfOrder, Metal: {
                    ...mnfOrder.Metal, [propName]: value
                }
            }))



        }

        if (parent === "Runner") {

            await setManufacturingOrder((mnfOrder) => ({
                ...mnfOrder, Runner: {
                    ...mnfOrder.Runner, [propName]: value
                }
            }))
        }

        if (parent === "mnfOrder") {

            await setManufacturingOrder((mnfOrder) => ({
                ...mnfOrder, [propName]: value
            }))
        }

        if (parent === "initialDate") {


            await setManufacturingOrder((mnfOrder) => ({
                ...mnfOrder, [propName]: value
            }))
            await setStoneOrder((stoneOrder) => ({
                ...stoneOrder, [propName]: value
            }))
        }

        if (parent === "common") {

            if (propName === "receivedDate") {

                if (value > new Date(startDate) || value.getDate() === new Date(startDate).getDate()) {
                    await setEndDate(value)

                    value = setDate(value)
                }
                else {
                    alert("Receive Date Cant be Ahead of Issue Date")
                }
            }
            if (propName === "givenDate") {
                await setStartDate(value)
                value = setDate(value)

            }

            await setManufacturingOrder((mnfOrder) => ({
                ...mnfOrder, [propName]: value
            }))
            await setStoneOrder((stoneOrder) => ({
                ...stoneOrder, [propName]: value
            }))

        }
    }
    const excludeForGold = ['receivedDate','usedInOrder', 'brokenQty', 'castingLoss', 'netLoss', 'orderDetails', '__v', 'Runner', 'runnerColor', 'runnerWeight']
    const excludeForSilver = ['receivedDate', 'usedInOrder' ,'Alloy', 'brokenQty', "alloyColor", 'alloyWeight', 'castingLoss', 'Runner', 'runnerColor', 'runnerWeight', "Metal",'metalWeight','netLoss', 'orderDetails', '__v']

    const checkForEmptyValues = (obj, type, keyPath = []) => {

        for (const [key, value] of Object.entries(obj)) {
            const currentKeyPath = [...keyPath, key];

            if (type === "Gold" || type === "Stone") {
                if (!excludeForGold.includes(key) && (value === null || value === undefined || value === "" || value === 0)) {
                    return currentKeyPath.join(" "); // Found an empty value
                }
            }
            if (type === "Silver") {

                if (!excludeForSilver.includes(key) && (value === null || value === undefined || value === "" || value === 0)) {
                    return currentKeyPath.join(" "); // Found an empty value
                }
            }
            if (type === '') {
                return "Type Not Defined"
            }
            if (typeof value === "object" && !Array.isArray(value)) {
                const nestedEmptyField = checkForEmptyValues(value, type, currentKeyPath);
                if (nestedEmptyField) {
                    return nestedEmptyField; // Found an empty value in a nested object
                }
            }
        }
        return false; // No empty values found
    };

    const checkForOtherEntry = (item) => {
        const i = []
        stoneOrderArray.forEach((stone, index) => {

            let tempStone = { stoneType: stone.stoneType, stoneShape: stone.stoneShape, stoneColor: stone.stoneColor, stoneSize: stone.stoneSize }
            let tempItem = { stoneType: item.stoneType, stoneShape: item.stoneShape, stoneColor: item.stoneColor, stoneSize: item.stoneSize }
            if (JSON.stringify(tempStone) === JSON.stringify(tempItem)) {
                i.push(index)
            }
        })
        let tempQty = 0;
        if (i.length > 0) {
            i.forEach((index) => {

                tempQty += stoneOrderArray[index].stoneQty
            })
            return tempQty;
        }
    }

    const checkIndividualStock = (type, item, purity) => {
        if (activeMenu === "Metal") {
            let foundValue = false
            let msg = ''

            for (const stock of props.stock) {
                if (foundValue) {
                    continue;
                }
                if (stock.items.type === type && type !== "Runner") {
                    if (stock.items.metalType === item) {
                        if (stock.qty >= Math.abs(metalWeight - initalMetal.current)) {
                            msg = 'found'
                            foundValue = true;
                        }
                        else {
                            msg = 'foundButlow';
                            const alertmsg = (`${stock.items.metalType}  "Low in Stock"`)
                            alert(alertmsg)

                        }
                    }
                    if (metalType === "Gold" && stock.items.type === "Alloy") {
                        if (stock.items.alloyType === item) {
                            if (stock.qty >= Math.abs(alloyWeight - initalAlloy.current)) {
                                msg = 'found'
                                foundValue = true;
                            }
                            else {
                                msg = 'foundButlow';
                                alert(`${stock.items.alloyType} Alloy "Low in Stock"`)


                            }
                        }
                    }
                }

                if (type === "Runner" && stock.items.type === type) {

                    msg = 'found'
                    foundValue = true;
                    // if (stock.items.runnerColor === item && stock.items.runnerPurity === metalPurity) {

                    //     // if (stock.qty >= ((initalRunner.current + totalRunnerReceived) - (initaltotal.current + runnerWeight)) || )  {
                    //     //     msg = 'found'
                    //     //     foundValue = true;
                    //     // }
                    //     // else {
                    //     //     msg = 'foundButlow';
                    //     //     alert(`${stock.items.runnerColor}  ${stock.items.runnerPurity} Low in Stock`)
                    //     // }
                    // }

                }
            }

            if (msg === '') {
                alert(`${type} ${item} Not In Inventory`)
            }

            return foundValue
        }
        if (activeMenu === "Stone") {
            let foundStone = false
            let msg = ''
            if (type === "Stone") {
                props.stock.forEach((stock) => {
                    if (stock.items.type === "Stone") {
                        if (stock.items.stoneType === item.stoneType && stock.items.stoneShape === item.stoneShape && stock.items.stoneColor === item.stoneColor && stock.items.stoneSize === item.stoneSize) {
                            const tempQty = checkForOtherEntry(item)
                            foundStone = true
                            if (stock.qty >= tempQty) {
                                msg = 'found'
                                return
                            }
                            else {
                                foundStone = false
                                msg = 'foundButLow'
                                alert(`${item.stoneShape} ${item.stoneType} ${item.stoneColor} ${item.stoneSize}mm Low In Stock`);
                                return
                            }
                        }
                    }

                })
                if (msg === '') {
                    alert(`${item.stoneType} ${item.stoneShape}  ${item.stoneColor} ${item.stoneSize} Not Available In Stock`)
                }
            }
            return foundStone
        }

    }
    const checkStock = () => {
        if (activeMenu === "Metal") {

            let runnerAvailable = null
            let metalAvailable = null
            let alloyAvailable = null
            // Metal Stock
            alloyAvailable = checkIndividualStock("Metal", metalType, "")
            // Alloy Stock  

            metalAvailable = metalType === "Silver" ? true : checkIndividualStock("Alloy", alloyColor, "");
            // Runner Stock
            runnerAvailable = checkIndividualStock("Runner", runnerColor, metalPurity)
            return { metal: metalAvailable, alloy: alloyAvailable, runner: runnerAvailable }
        }
        if (activeMenu === "Stone") {
            let stoneavailable = null

            stoneavailable = stoneOrderArray.map((stone) => {
                return checkIndividualStock("Stone", stone, "")
            })
            let foundstone = true

            stoneavailable.forEach((stone) => {
                if (!foundstone) {
                }
                if (!stone) {
                    foundstone = false
                }
            })
            return { stone: foundstone }
        }
    }

    // Updates Existing Stock
    const update = async (e) => {

        e.preventDefault()


        if (activeMenu === "Metal") {

            if (checkForEmptyValues(mnfOrder, mnfOrder.Metal.metalType)) {
                alert(checkForEmptyValues(mnfOrder, mnfOrder.Metal.metalType))
            }

            else {
                try {

                    const { metal, runner, alloy } = checkStock();
                    if (metal && runner && alloy) {

                        const response = await props.addManufacturingOrder(mnfOrder);
                        let i = [];
                        const updatedArray = props.stock.map((stock, index) => {

                            if (stock.items.type === "Metal") {
                                if (stock.items.metalType === mnfOrder.Metal.metalType) {


                                    const quant = +Number(stock.qty - mnfOrder.Metal.metalWeight + initalMetal.current).toFixed(3)

                                    i.push(index)
                                    return { ...stock, qty: quant }
                                }
                                else {
                                    return stock
                                }
                            }

                            if (stock.items.type === "Alloy") {
                                if (stock.items.alloyType === mnfOrder.Metal.Alloy.alloyColor) {
                                    const quant = +Number(stock.qty - mnfOrder.Metal.Alloy.alloyWeight + initalAlloy.current).toFixed(3)
                                    console.log(quant, mnfOrder.Metal.Alloy.alloyWeight, initalAlloy.current)
                                    i.push(index)
                                    return { ...stock, qty: quant }
                                }
                                else {
                                    return stock
                                }
                            }

                            if (stock.items.type === "Runner") {
                                if (stock.items.runnerColor === mnfOrder.Runner.runnerColor && stock.items.runnerPurity === mnfOrder.Runner.runnerPurity) {

                                    const quant = +Number(stock.qty - (initaltotal.current + mnfOrder.Runner.runnerWeight) + (initalRunner.current + totalRunnerReceived)).toFixed(3)
                                    i.push(index)

                                    return { ...stock, qty: quant }
                                }
                                else {
                                    return stock
                                }
                            }

                            return stock;
                        })



                        i.map(async (index) => {
                            await props.addStock(updatedArray, index, "update")
                            return;
                        })


                        if (response === true) {
                            navigate("/manufacturing")
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }

        if (activeMenu === "Stone") {
            if (checkForEmptyValues(stoneOrderArray, "Stone")) {
                alert(checkForEmptyValues(stoneOrderArray, "Stone"))
            }
            else {
                const { stone } = checkStock();
                if (stone) {
                    const response = await props.addStoneOrder(stoneOrder);
                    let tempstocklist = props.stock
                    for (const item of stoneOrderArray) {

                        const { updatedArray, index } = await loop(tempstocklist, item)
                        tempstocklist = updatedArray

                        await props.addStock(tempstocklist, index, "update")
                    }
                    if (response === true) {
                        navigate("/manufacturing")
                    }
                }
            }
        }
    }

    async function loop(tempstocklist, item) {
        let i = null
        const updatedArray = await tempstocklist.map((stock, index) => {
            if (stock.items.type === "Stone" && stock.items.stoneType === item.stoneType && stock.items.stoneShape === item.stoneShape && stock.items.stoneColor === item.stoneColor && stock.items.stoneSize === item.stoneSize) {
                i = index
                const quant = stock.qty - item.stoneQty
                return { ...stock, qty: quant }
            }
            else {
                return stock
            }
        })
        return { updatedArray, index: i };
    }

    return (
        <div className="mainContent">
            <form className="ui form " >
                <div className="mnfOrderHeader" style={{ display: 'flex', alignItems: "flex-start", justifyContent: 'space-between' }}>

                    <div className="toRowMnf">

                        <div className="toColumnMnf" style={{ marginRight: "10px" }}>
                            <div className="ui header">Issue Date</div>
                            <DatePicker selected={startDate} placeholderText="DD/MM/YY" dateFormat="dd/MM/yy" onChange={(date) => { date !== null ? setValues(date, "givenDate", "common") : setStartDate('') }} />
                        </div>
                        <div className="toColumnMnf" style={{ marginRight: "10px", display: activeMenu === "Metal" ? "block" : "none" }}>
                            <div className="ui header" >Recieve Date</div>
                            <DatePicker selected={endDate} placeholderText="DD/MM/YY" dateFormat="dd/MM/yy" onChange={(date) => { date !== null ? setValues(date, "receivedDate", "common") : setStartDate('') }} />
                        </div>

                    </div>

                    <div className="ui icon" style={{ display: "flex", justifyContent: "flex-end", marginTop: "0", marginBottom: "1rem" }}>
                        <Link to={"/manufacturing"}>
                            <i className="cancel icon" style={{ cursor: "pointer", color: "grey" }}></i>
                        </Link>
                    </div>
                </div>

                <div className="ui top attached tabular menu" style={{ display: "flex", flexWrap: "Wrap" }}>
                    <div className={`item ${activeMenu === 'Metal' ? 'active' : ''} `} style={{ cursor: "pointer" }} onClick={() => { handleItemClick('Metal'); setValues("Metal", "orderType", "mnfOrder") }}>
                        Metal
                    </div>
                    <div className={`item ${activeMenu === 'Stone' ? 'active' : ''} `} style={{ cursor: "pointer" }} onClick={() => { handleItemClick('Stone'); setValues("Stone", "orderType", "mnfOrder") }} >
                        Stone
                    </div>
                </div>

                {/* Metal */}

                <div className="ui bottom attached segment mnfOrder " id="style-2" style={{ display: activeMenu === "Metal" ? "" : "none" }} >

                    <div className="ui dividing header">Metal</div>

                    <div className="toColumnMnf" >

                        <div className="toRowMnf metal">

                            <select className="ui dropdown" defaultValue={metalType} style={{ marginTop: "1rem" }} onChange={(e) => {
                                setValues(capitaliseWord(e.target.value), "metalType", "Metal");

                                e.target.value === "Gold" ? setAlloyDisplay("block") : setAlloyDisplay("none");
                                if (e.target.value === "Silver") {

                                    setRunnerColor("Silver")
                                    setValues('Silver', "runnerColor", "Runner")
                                    setValues('', "alloyColor", "Alloy")
                                    setMetalColor('Silver');
                                    setValues('Silver', "metalColor", "Metal")
                                    setMetalPurity("925");
                                    setValues('925', "metalPurity", "Metal")
                                    // setRunnerPurity("925")
                                    setValues('925', "runnerPurity", "Runner")


                                }
                                setMetalType(capitaliseWord(e.target.value));


                            }}>
                                <option value="">Type</option>
                                {metalTypeRender}
                            </select>

                            <select className="ui dropdown" style={{ marginTop: "1rem" }} disabled={
                                metalType === "Silver"}
                                id="metalColorSelect"
                                value={metalColor} onChange={(e) => {
                                    setMetalColor(capitaliseWord(e.target.value));
                                    setValues(capitaliseWord(e.target.value), "metalColor", "Metal"); setValues(capitaliseWord(e.target.value), "runnerColor", "Runner"); setRunnerColor(capitaliseWord(e.target.value));


                                    if (alloyDisplay === "block") {
                                        setAlloyColor(capitaliseWord(e.target.value)); setValues(capitaliseWord(e.target.value), "alloyColor", "Alloy")
                                    }
                                    else {
                                        setAlloyColor(""); setValues("", "alloyColor", "Alloy")
                                    }
                                }
                                }
                            >
                                <option value="">Color</option>
                                {metalColorRender}
                            </select>

                            <select className="ui dropdown" disabled={metalType === "Silver"}
                                id="metalPuritySelect"
                                style={{ marginTop: "1rem" }} value={metalPurity} onChange={(e) => {
                                    setValues(capitaliseWord(e.target.value), "metalPurity", "Metal"); setValues(capitaliseWord(e.target.value), "runnerPurity", "Runner");

                                    setMetalPurity(capitaliseWord(e.target.value))

                                }} >
                                <option value="">Purity</option>
                                {metalPurityRender}
                            </select>

                            <div className="ui right labeled input" style={{ marginTop: "1rem" }}>

                                <input
                                    type="number"
                                    name="metalWeight"
                                    min='0'
                                    step={'0.5'}
                                    placeholder="Metal Weight"
                                    style={{ minWidth: "110px", width: "15vw" }}
                                    value={metalWeight === 0 ? "" : metalWeight}
                                    className="dropdownnput"
                                    onWheel={(e) => e.target.blur()}
                                    onChange={(e) => { setValues(+Number(e.target.value).toFixed(3), "metalWeight", "Metal"); setMetalWeight(+Number(e.target.value).toFixed(3)) }}
                                />
                                <div className="ui dropdown label" style={{ marginTop: "0", minWidth: "0", width: "fit-content" }}>
                                    <div className="text">gms</div>
                                </div>
                            </div>
                        </div>



                    </div>




                    <div className="alloyRow" style={{ display: alloyDisplay }}>
                        <label className="ui header">Alloy</label>

                        <div className="alloyContainer ">
                            <input
                                type="text"
                                name="Alloy Color"
                                placeholder="Alloy Color"
                                disabled
                                style={{ minWidth: "110px", width: "15vw", marginTop: "1rem" }}
                                value={alloyColor}

                            />
                            <div className="ui right labeled input" style={{ marginLeft: "1vw", marginTop: "1rem" }}>
                                <input
                                    type="number"
                                    min='0'
                                    step={'0.5'}
                                    name="alloyWeight"
                                    placeholder="Alloy Weight"
                                    style={{ minWidth: "110px", width: "15vw" }}
                                    value={alloyWeight === 0 || 0 ? "" : alloyWeight}
                                    className="dropdownnput"
                                    onWheel={(e) => e.target.blur()}
                                    onChange={(e) => {
                                        if (alloyDisplay === "block") {
                                            setValues(+Number(e.target.value).toFixed(3), "alloyWeight", "Alloy");
                                            setAlloyWeight(+Number(e.target.value).toFixed(3));
                                        } else {
                                            setValues(0, "alloyWeight", "Alloy");
                                            setAlloyWeight(0);
                                        }
                                    }}
                                />
                                <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content", marginTop: "0" }}>
                                    <div className="text">gms</div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="ui dividing header">Runner</div>
                    <div className="toColumnMnf">

                        <div className="toRowMnf metal">


                            <input
                                type="text"
                                name="Runner Color"
                                placeholder="Runnner Color"
                                disabled
                                style={{ minWidth: "110px", width: "15vw", marginTop: "1rem" }}
                                value={runnerColor}
                            />
                            <input
                                type="text"
                                name="Runner Purity"
                                placeholder="Runner Purity"
                                disabled
                                style={{ minWidth: "110px", width: "15vw", marginTop: "1rem" }}
                                value={metalPurity}

                                onChange={(e) => { setValues(capitaliseWord(e.target.value), "runnerPurity", "Runner") }}
                            />

                            <div className="ui right labeled input" style={{ marginTop: "1rem" }}>

                                <input
                                    type="number"
                                    name="runnerWeight"
                                    min='0'
                                    step={'0.5'}
                                    placeholder="Runner Weight"
                                    style={{ minWidth: "110px", width: "15vw" }}
                                    value={runnerWeight === 0 ? "" : runnerWeight}
                                    className="dropdownnput"
                                    onWheel={(e) => e.target.blur()}
                                    onChange={(e) => { setValues(+Number(e.target.value).toFixed(3), "runnerWeight", "Runner"); setRunnerWeight(+Number(e.target.value).toFixed(3)) }}
                                />
                                <div className="ui dropdown label" style={{ minWidth: "0", marginTop: "0", width: "fit-content" }}>
                                    <div className="text">gms</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ui dividing header">Total</div>

                    <div className="toColumnMnf">
                        <div className="toRowMnf total">
                            <div className="toColumnMnf">
                                <div>Metal Given</div>
                                <div className="ui right labeled input" style={{ border: "1px solid black", borderRadius: "5px" }}>

                                    <input
                                        type="number"
                                        min='0'
                                        step={'0.5'}
                                        name="metalWeightGiven"
                                        placeholder="Metal Given"
                                        style={{ minWidth: "110px", width: "15vw" }}
                                        disabled
                                        value={totalWeightGiven === 0 ? "" : totalWeightGiven}

                                    />
                                    <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                                        <div className="text">gms</div>
                                    </div>
                                </div>
                            </div>
                            <div className="toColumnMnf">
                                <div>Metal Recieved</div>
                                <div className="ui right labeled input">

                                    <input
                                        type="number"
                                        min='0'
                                        step={'0.5'}
                                        name="metalWeightRecieved"
                                        placeholder="Metal Recieved"
                                        style={{ minWidth: "110px", width: "15vw" }}
                                        value={totalMetalReceived === 0 ? "" : totalMetalReceived}
                                        className="dropdownnput"
                                        onChange={(e) => { setValues(+Number(e.target.value).toFixed(3), "totalMetalReceived", "mnfOrder"); setTotalMetalReceived(+Number(e.target.value).toFixed(3)) }}
                                    />
                                    <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                                        <div className="text">gms</div>
                                    </div>
                                </div>
                            </div>
                            <div className="toColumnMnf">
                                <div>Runner Received</div>
                                <div className="ui right labeled input">

                                    <input
                                        type="number"
                                        min='0'
                                        step={'0.5'}
                                        name="runnerWeightReceived"
                                        placeholder="Runner Received"
                                        style={{ minWidth: "110px", width: "15vw" }}
                                        value={totalRunnerReceived === 0 ? "" : totalRunnerReceived}
                                        className="dropdownnput"
                                        onChange={(e) => { setValues(+Number(e.target.value).toFixed(3), "totalRunnerReceived", "mnfOrder"); setTotalRunnerReceived(+Number(e.target.value).toFixed(3)) }}
                                    />
                                    <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                                        <div className="text">gms</div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="toRowMnf total " >
                            <div className="toColumnMnf">
                                <div >Casting Loss</div>
                                <div className="ui right labeled input" style={{ border: "1px solid black", borderRadius: "5px" }}>

                                    <input
                                        type="number"
                                        min='0'
                                        step={'0.5'}
                                        name="castingLoss"
                                        placeholder="Casting Loss"
                                        style={{ minWidth: "110px", width: "15vw" }}
                                        value={castingLoss}
                                        disabled
                                        className="dropdownnput"
                                        onChange={(e) => setValues(+Number(e.target.value).toFixed(3), "castingLoss", "mnfOrder")}
                                    />
                                    <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                                        <div className="text">gms</div>
                                    </div>
                                </div>
                            </div>
                            <div className="toColumnMnf">
                                <div >Net Loss</div>
                                <div className="ui right labeled input" style={{ border: "1px solid black", borderRadius: "5px" }}>

                                    <input
                                        type="number"
                                        min='0'
                                        step={'0.5'}
                                        name="Net Loss"
                                        placeholder="Net Loss"
                                        style={{ minWidth: "110px", width: "15vw" }}
                                        value={netLoss}
                                        disabled
                                        className="dropdownnput"
                                        onChange={(e) => setValues(+Number(e.target.value).toFixed(3), "Net Loss", "nfOrder")}
                                    />
                                    <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                                        <div className="text">gms</div>
                                    </div>
                                </div>
                            </div>
                            <div className="toColumnMnf">
                                <div >Used In Order</div>
                                <div className="ui right labeled input" style={{ border: "1px solid black", borderRadius: "5px" }}>

                                    <input
                                        type="number"
                                        name="usedInOrder"
                                        min='0'
                                        step={'0.5'}
                                        placeholder="Used In Order"
                                        style={{ minWidth: "110px", width: "15vw" }}
                                        value={usedInOrder}
                                        disabled
                                        className="dropdownnput"
                                        onChange={(e) => setValues(+Number(e.target.value).toFixed(3), "usedInOrder", "mnfOrder")}
                                    />
                                    <div className="ui dropdown label" style={{ minWidth: "0", width: "fit-content" }}>
                                        <div className="text">gms</div>
                                    </div>
                                </div>
                            </div>


                        </div>

                        {addOrderField()}


                    </div>


                    <div className="toRowMnfExtended" style={{ justifyContent: "flex-end", flexWrap: "wrap", marginBottom: "10px", marginRight: "5vw" }}>
                        <button className="ui button blue" onClick={(e) => { e.preventDefault(); update(e) }}>Update</button>
                    </div>
                </div>

                {/* Stone */}

                <div className="ui bottom attached segment stoneOrder" id="style-2" style={{ display: activeMenu === "Stone" ? "" : "none" }} >
                    <div className="ui dividing header" >Stone</div>


                    <div className="ui form" style={{ marginTop: "0" }}>

                        {addOrderField()}

                        <div style={{ display: "flex", margin: "2rem", justifyContent: "flex-end" }}>
                            <button className="ui button blue" style={{ display: "flex", width: "90px", justifyContent: "center", cursor: "pointer" }} disabled={addBtnStone === "none"} onClick={(e) => { e.preventDefault(); update(e) }}>Update</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>

    );

}
export default Addmnforder;