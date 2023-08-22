import React, { useEffect, useState } from "react";
import csvtojson from 'csvtojson'
import './maincontent.css'
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import './Manufacturing.css'
import { Link } from "react-router-dom";

const ImportData = (props) => {
    const url="https://jewelry-mnf-backend.vercel.app"
    const [allowedList, setAllowedList] = useState([])
    const [allowedListSilver, setAllowedListSilver] = useState([])
    const [allowedListStone, setAllowedListStone] = useState([])
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [importType, setImportType] = useState('')
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    };
    useEffect(() => {

        const getAllowedAttrs = async () => {

            const responseMetal = await axios.get(`${url}/manufacturing`, { params: { type: "Metal" } })
            const responseStone = await axios.get(`${url}/manufacturing`, { params: { type: "Stone" } })

            if (responseMetal) {
                const tempList = Object.values(responseMetal.data).map((list) => {
                    return list.label
                })
                const tempsilverlist = tempList.filter((attr) => attr !== "alloyWeight")
                setAllowedListSilver(tempsilverlist)
                setAllowedList(tempList)
            }
            if (responseStone) {
                const tempList = Object.values(responseStone.data).map((list) => {
                    return list.label
                })

                setAllowedListStone(tempList)
            }
        }
        getAllowedAttrs()
    }, [])



    const metalObjects = ["metalType", "metalColor", "metalPurity", "metalWeight"]
    const runnerObjects = ["runnerWeight"]
    const alloyObjects = ['alloyWeight']
    const orderObjects = ['orderId', 'orderWeight']
    const stoneObjects = ['stoneSize', 'stoneQty', 'brokenQty']
    const [orderList, setOrderList] = useState([])

    const isObjectAttr = (key) => {
        if (metalObjects.includes(key)) {
            return { type: 'Metal' }
        }
        if (runnerObjects.includes(key)) {

            return { type: 'Runner' }
        }
        if (alloyObjects.includes(key)) {

            return { type: 'Alloy' }
        }
        if (orderObjects.includes(key)) {

            return { type: 'Order' }
        }
        return { type: "" }
    }

    const excludeForGoldnSilver = ['receivedDate', 'brokenQty', 'castingLoss', 'netLoss', 'orderId', "orderWeight", '__v']
    const excludeForSilver = ['receivedDate', "alloyColor", 'alloyWeight', 'castingLoss', 'netLoss', 'orderId', "orderWeight", '__v']


    const checkForEmptyValues = (obj, index, type) => {
        for (const [key, value] of Object.entries(obj)) {


            if (type === "Gold" || type === "Stone") {

                if (!excludeForGoldnSilver.includes(key) && (value === null || value === undefined || value === "" || value === 0)) {
                    return index
                }
            }
            if (type === "Silver") {

                if (!(excludeForSilver.includes(key)) && (value === null || value === undefined || value === "" || value === 0)) {

                    return index
                }
            }

        }
        return false; // No empty values found
    };

    const setMetalorderData = (jsonArray, metalType) => {

        const tempOrderList = []
        for (const [keys, labels] of Object.entries(jsonArray)) {
            const tempOrder = {
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
                    },
                },
                Runner: {
                    runnerWeight: 0,
                    runnerColor: "",
                    runnerPurity: "",
                },

                totalMetalGiven: 0,
                totalMetalReceived: 0,
                totalRunnerReceived: 0,
                castingLoss: 0,
                usedInOrder: 0,
                netLoss: 0,
                orderDetails: [{
                    orderId: "",
                    orderWeight: 0
                }],

            }

            if (!(checkForEmptyValues(labels, keys, metalType))) {
                for (const [subKey, subLabel] of Object.entries(labels)) {
                    const { type } = isObjectAttr(subKey)
                    if (type === "Runner") {
                        tempOrder[type][subKey] = +subLabel
                        tempOrder[type]['runnerColor'] = labels.metalColor
                        tempOrder[type]['runnerPurity'] = labels.metalPurity
                        continue;

                    }
                    if (type === "Alloy") {
                        tempOrder['Metal'][type][subKey] = +subLabel
                        tempOrder['Metal'][type]['alloyColor'] = labels.metalColor
                        continue;

                    }
                    if (type === "Metal") {
                        if (subKey === "metalWeight") {
                            tempOrder[type]['metalType'] = metalType
                            tempOrder[type][subKey] = +subLabel
                            continue;
                        }

                        tempOrder[type][subKey] = subLabel
                        continue;
                    }
                    if (type === "Order") {

                        if (subKey === "orderWeight") {
                            tempOrder['orderDetails'][0][subKey] = +subLabel
                            continue;
                        }
                        else {
                            tempOrder["orderDetails"][0][subKey] = subLabel
                            continue;
                        }
                    }
                    if (subKey !== 'givenDate' && subKey !== 'receivedDate') {
                        tempOrder[subKey] = +subLabel
                        continue;
                    }
                    else {
                        if (subLabel !== "") {
                          
                            const [day, month, year] = subLabel.split("-");
                            const tempDate = new Date(`${day}/${month}/${year}`);
                           
                            tempOrder[subKey] = tempDate.toLocaleDateString('en-US', options)
                            continue;
                        }
                        else {
                            tempOrder[subKey] = subLabel
                            continue;
                        }
                    }
                }

                tempOrderList.push({ ...tempOrder })
            }
            else {

                // console.log("Removing Order at " + checkForEmptyValues(labels, keys, metalType) + " Index")
                return []
            }
        }
   
        setOrderList(tempOrderList)
        return tempOrderList

    }

    const setStoneOrderData = (jsonArray) => {
        const tempOrderList = []
        for (const [keys, labels] of Object.entries(jsonArray)) {
            const tempOrder = {
                id: uuidv4(),
                givenDate: '',
                stoneOrder: [{
                    stoneShape: "",
                    stoneColor: "",
                    stoneSize: 0,
                    stoneQty: 0,
                    brokenQty: 0,
                    orderId: ""
                }]
            }
            if (!(checkForEmptyValues(labels, keys, 'Stone'))) {
                for (const [subKey, subLabel] of Object.entries(labels)) {

                    if (subKey !== 'givenDate') {
                        if (stoneObjects.includes(subKey)) {
                            tempOrder['stoneOrder'][0][subKey] = +subLabel
                            continue;
                        }
                        tempOrder['stoneOrder'][0][subKey] = subLabel
                    }
                    else {
                        const [day, month, year] = subLabel.split("-");
                        const tempDate = new Date(`${day}/${month}/${year}`);

                        tempOrder[subKey] = tempDate.toLocaleDateString('en-US', options)
                        continue;
                    }
                }

                tempOrderList.push({ ...tempOrder })
            }
            else {
                // console.log("Removing Order at " + checkForEmptyValues(labels, keys, 'Stone') + " Index")
                return []
            }
        }
        console.log(tempOrderList)
        setOrderList(tempOrderList)
        return (tempOrderList)
    }

    const addBulkOrders = async (order) => {
        let response = null
        let data = 0
       
        if (order.length > 0) {
          
            if (importType !== "Stone") {
                response = await axios.post(`${url}/`, order, { params: { type: "Metal" } })
            }
            if (importType === "Stone") {
                response = await axios.post(`${url}/`, order, { params: { type: "Stone" } })
            }
         
            if (response.data.length > 0) {
                alert("Data Uploaded")
            }
        }


    }

    const findMissingLabels = (headerRow) => {
        let missingLabels = []
        let unwantedLabels = []
        if (importType === "Gold") {
            missingLabels = allowedList.filter((attr) => !(headerRow.includes(attr)))
            unwantedLabels = headerRow.filter((attr) => !(allowedList.includes(attr)))
        }
        if (importType === "Silver") {
            missingLabels = allowedListSilver.filter((attr) => !(headerRow.includes(attr)))
            unwantedLabels = headerRow.filter((attr) => !(allowedListSilver.includes(attr)))
        }
        if (importType === "Stone") {
            missingLabels = allowedListStone.filter((attr) => !(headerRow.includes(attr)))
            unwantedLabels = headerRow.filter((attr) => !(allowedListStone.includes(attr)))
        }
        if (missingLabels.length > 0 || unwantedLabels.length > 0) {

            alert("Data not supported. Missing labels " + "-" + missingLabels.map(label => label).join(", ") + " Unwanted / Unappropriate Labels -" + unwantedLabels.map(label => label).join(", "));
            setIsPopupOpen(false)
            setImportType('')
            return false;
        }
        return true
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {

            const csvData = e.target.result;
            const jsonArray = await csvtojson().fromString(csvData);


            const headerRow = Object.keys(jsonArray[0]);

            if (findMissingLabels(headerRow)) {

                if (importType === "Gold") {
                    const response = await setMetalorderData(jsonArray, importType)
                    if (response.length > 0) {
                        addBulkOrders(response)
                    }
                    return
                }

                if (importType === "Silver") {
                    const response = await setMetalorderData(jsonArray, importType)
                    if (response.length > 0) {
                        addBulkOrders(response)
                    }
                    return
                }

                if (importType === "Stone") {

                    const response = await setStoneOrderData(jsonArray)
                    if (response.length > 0) {
                        addBulkOrders(response)
                    }
                    return
                }

            }
            // alert('Improper ')





        };

        reader.readAsText(file);
    };

    const openPopUp = () => {
        setIsPopupOpen(true)
    }
    const closePopUp = () => {

        setImportType("")
        props.setActiveItem("/")
        setIsPopupOpen(false)
    }
    const setType = (type) => {
        setImportType(type);
    }
    return (
        <div>
            <div className="hoverIcon">
        
                <Link className={'item'} onClick={openPopUp}>

                    <FontAwesomeIcon icon={faFileImport} className="icon" />
                </Link>
                <span className="tooltiptext import">Import</span>
            </div>
            <div className="maincontent">

                {isPopupOpen && (
                    <div>
                        <div className="popup">
                            <div className="download-interface import">
                                <div className="btnContainer" style={{ display: importType !== "" ? "none" : "flex" }}>

                                    <div className="ui button white optionBtn" onClick={() => { setType("Gold") }}>Gold</div>
                                    <div className="ui button white optionBtn" onClick={() => { setType("Silver") }}>Silver</div>
                                    <div className="ui button white optionBtn" onClick={() => { setType("Stone") }}>Stone</div>
                                </div>
                                <div className="file-uploader" style={{ display: importType !== "" ? "block" : "none" }} >
                                    <label htmlFor="file-input" className="file-label">
                                        Upload File
                                    </label>
                                    <input
                                        id="file-input"
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="file-input"
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="popup-background" onClick={closePopUp}></div>
                    </div>
                )}
            </div>
        </div>

    );
}
export default ImportData;