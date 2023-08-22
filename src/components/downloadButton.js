import React, { useEffect, useState } from 'react';
// import { CSVLink } from 'react-csv';
import DatePicker from "react-datepicker";
import moment from 'moment'
import { Dropdown, Icon } from 'semantic-ui-react'; // Assuming you're using Semantic UI React
import XLSX from 'sheetjs-style'



const DownloadButton = ({ allowedLabels, allowedLabelStone, stoneOrderList, mnfOrderList, attrList, addallowedLabels }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [downloadOption, setDownloadOption] = useState('');
    const [metalOption, setMetalOption] = useState('');
    const [stoneShapeOption, setStoneShapeOption] = useState('');
    const [showDownloadLink, setShowDownloadLink] = useState(false);

    const notAllowedListMetal = ['id', "_id", "__v", "Metal", "Runner", "Alloy", 'metalType', "runnerColor", "runnerPurity", "alloyColor"]
    const notAllowedListSilver = ['id', "_id", "__v", "Metal", "Runner", "Alloy", 'metalType', "runnerColor", "runnerPurity", "alloyColor", 'alloyWeight']
    const notAllowedListStone = ['id', "_id", "__v", "stoneOrder"]

    const notAllowed = (subKey, downloadOption, type) => {

        if (downloadOption === "metal" && (type === "Gold" || type === '')) {

            return notAllowedListMetal.includes(subKey)
        }
        if (downloadOption === "metal" && type === "Silver") {

            return notAllowedListSilver.includes(subKey)
        }
        if (downloadOption === "stone") {
            return notAllowedListStone.includes(subKey)

        }
    }

    const [data, setData] = useState([])

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const [disabledbtn, setDisabledbtn] = useState(false)
    // const [goldheaders, setGoldHeaders] = useState([])
    // const [silverheaders, setSilverHeaders] = useState([])
    // const [stoneheaders, setStoneHeaders] = useState([])
    const [headers, setHeaders] = useState([])


    const getHeaders = () => {

        if ((downloadOption === "metal" && metalOption === "Gold") || (downloadOption === "metal" && metalOption === '')) {
            const tempHeaderGold = []
            for (const labels of allowedLabels) {
                tempHeaderGold.push(labels.label)
            }

            if (tempHeaderGold.length > 0) {

                setHeaders(tempHeaderGold)
            }
        }

        if (downloadOption === "metal" && metalOption === "Silver") {

            const tempHeaderSilver = allowedLabels.map((labels) => {
                if (labels.label !== "alloyWeight") {
                    return labels.label
                } else {
                    return undefined;
                }
            }).filter(header => header !== undefined);

            if (tempHeaderSilver.length > 0) {
                setHeaders(tempHeaderSilver)
            }
        }
        if (downloadOption === "stone") {
            const tempHeaderStone = []
            for (const labels of allowedLabelStone) {
                tempHeaderStone.push(labels.label)
            }

            if (tempHeaderStone.length > 0) {
                setHeaders(tempHeaderStone)
            }
        }
    }

    const allowedList = ['givenDate', 'receivedDate', 'metalColor', 'metalPurity', 'metalWeight', 'alloyWeight', 'runnerWeight', 'totalMetalGiven', 'totalMetalReceived', 'totalRunnerReceived', 'usedInOrder', 'castingLoss', 'orderId', 'orderWeight', 'netLoss']

    const allowedStoneList = ['givenDate', "stoneType", 'stoneShape', 'stoneColor', 'stoneSize', 'stoneQty', 'brokenQty', 'orderId']




    function downloadXLSXFile(data, headers, filename) {

        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        range.e.c = headers.length - 1; // Adjust the ending column index based on the number of headers
        worksheet['!ref'] = XLSX.utils.encode_range(range);

        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const xlsxBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

        const blob = new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
    }


    const [isPageUpdated, setIsPageUpdated] = useState(false);
    const addattrs = () => {

        try {
            const temp1 = [];

            if (allowedLabelStone.length === 0) {
                for (const attr of allowedStoneList) {
                    temp1.push({ label: attr, key: attr });
                }

                if (temp1.length > 0) {
                    addallowedLabels(temp1, 'Stone');
                    setIsPageUpdated(true);
                    return;
                }

            }

            if (allowedLabels.length === 0) {
                alert('Setting Up Download Environment. Please try again later.');

                for (const attr of allowedList) {
                    temp1.push({ label: attr, key: attr });
                }

                if (temp1.length > 0) {
                    addallowedLabels(temp1, 'Metal');
                    setIsPageUpdated(true);
                    return;
                }
            }
        } catch (error) {
            // Handle any errors that occur within the try block
            console.error('An error occurred adding allowed labels for download:', error);
        }
    }

    useEffect(() => {

        if (isPageUpdated) {
            // Refresh the page
            window.location.reload();
            setIsPageUpdated(false);
        }
    }, [isPageUpdated]);


    const dateFormat = "DD/MM/YY"
    const checkInRange = (singleOrder) => {
        try {
            if (startDate !== '' && endDate !== '') {

                const date = moment(singleOrder.givenDate, dateFormat).toDate();

                return date >= startDate && date <= endDate;
            }
        } catch (error) {

            console.error('An error occurred while checking date range', error);
        }
    };

    const downloadData = async (mnfOrder, type) => {
        try {

            if (downloadOption === "metal") {
                const tempdata = [];

                for (const singleOrder of mnfOrder) {

                    if (
                        ((metalOption === '') || (metalOption === singleOrder.Metal.metalType)) &&
                        (((startDate !== '' && endDate !== '') && checkInRange(singleOrder)) || (startDate === '' && endDate === '')
                        )
                    ) {
                        console.log(metalOption)
                        const reiterator = (values, tempOrderData) => {
                            for (const [subKey, subValue] of Object.entries(values)) {
                                if (((isNaN(subKey) && !(notAllowed(subKey, downloadOption, type))) && typeof (subValue) !== 'object')) {

                                    tempOrderData[subKey] = subValue;
                                    continue;
                                }
                                if (typeof subValue === 'object') {
                                    if (Object.keys(subValue)[0] === 'orderId') {
                                        const clonedOrderData = { ...tempOrderData };
                                        reiterator(subValue, clonedOrderData);
                                        tempdata.push(clonedOrderData);
                                        continue;
                                    }
                                    reiterator(subValue, tempOrderData);
                                }
                            }
                        };

                        const tempOrderData = {
                            givenDate: '',
                            receivedDate: '',
                            metalColor: '',
                            metalPurity: '',
                            metalWeight: 0,
                            alloyWeight: 0,
                            runnerWeight: 0,
                            totalMetalGiven: 0,
                            totalMetalReceived: 0,
                            totalRunnerReceived: 0,
                            usedInOrder: 0,
                            castingLoss: 0,
                            orderId: '',
                            orderWeight: 0,
                            netLoss: 0,
                        };

                        reiterator(singleOrder, tempOrderData);
                    }
                }

                if (tempdata.length > 0) {

                    setData(tempdata);
                }
            }

            if (downloadOption === "stone") {
                const tempdata = [];
                for (const singleOrder of mnfOrder) {
                    const tempOrderData = {
                        givenDate: "",
                        stoneType: '',
                        stoneShape: '',
                        stoneColor: "",
                        stoneSize: "",
                        stoneQty: 0,
                        brokenQty: 0,
                        orderId: ''
                    };

                    const reiterator = (values) => {
                        for (const [subKey, subValue] of Object.entries(values)) {
                            if (!(notAllowed(subKey, downloadOption, "stone")) && typeof (subValue) !== "object") {
                                tempOrderData[subKey] = subValue;
                            }
                            if (typeof (subValue) === "object") {

                                if (subValue.length === undefined && (subValue.stoneShape === type || type === '')) {
                                    reiterator(subValue);
                                    tempOrderData['givenDate'] = singleOrder.givenDate;
                                    tempdata.push({ ...tempOrderData });
                                }
                            }
                        }
                    };

                    if ((((startDate !== '' && endDate !== '') && checkInRange(singleOrder)) || (startDate === '' && endDate === ''))) {
                        reiterator(singleOrder.stoneOrder);
                    }
                }

                if (tempdata.length > 0) {
                    setData(tempdata);
                }
            }
        } catch (error) {
            console.error('An error occurred: Downloading the data', error);
        }
    };



    useEffect(() => {
        if (data.length > 0) {
            const timer = setTimeout(() => {

                setShowDownloadLink(true)
            }, 100);
            return () => {
                clearTimeout(timer);
            };

        }
    }, [data])

    const handleDownloadOptionChange = (value) => {
        setShowDownloadLink(false)
        setDownloadOption(value);
    };

    const handleMetalOptionChange = (value) => {

        setShowDownloadLink(false)
        setMetalOption(value);
        setData([])
        setStoneShapeOption('');
        setHeaders([])
    };
    
    const handleStoneShapeOptionChange = (value) => {
        setData([])
        setHeaders([])
        setShowDownloadLink(false)
        setMetalOption('');
        setStoneShapeOption(value);
    };


    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setDownloadOption("")
        setData([])
        setHeaders([])
        setStartDate('')
        setEndDate("")
        setMetalOption('')
        setStoneShapeOption('')
        setShowDownloadLink(false)
        setIsPopupOpen(false);
    };



    const optionsRenderer = (prop) => {
        try {
            const uniqueOptions = [...new Set(attrList.map((attr) => {
                if (attr.Type === "Stone") {
                    return attr.Stone[prop];
                }
                if (attr.Type === "Metal") {
                    return attr.Metal[prop];
                }
                else {
                    return null;
                }
            }))].filter((attr) => attr !== null && attr !== undefined);

            const options = uniqueOptions.map((attr, index) => {
                return { key: attr + index.toString(), value: attr, text: attr };
            });
            return options;
        } catch (error) {

            console.error('An error occurred:', error);
            return [];
        }
    };

    const stoneShapeOptions = optionsRenderer("stoneShape");
    stoneShapeOptions.unshift({ key: "Stone", value: "Stone", text: "Stone" })

    const metalTypeOptions = optionsRenderer("metalType")
    metalTypeOptions.unshift({ key: "Metal", value: "Metal", text: "Metal" })

    return (
        <div style={{ userSelect: 'none' }}>
            <div className="download-button" onClick={() => { allowedLabels.length !== 0 && allowedLabelStone.length !== 0 ? openPopup() : addattrs() }}>
                <Icon className="file excel" />
                <div className="text">Download</div>
            </div>
            {isPopupOpen && (
                <div>
                    <div className="popup">
                        <div className="download-interface">
                            <h2>Download</h2>
                            <div className="download-options">
                                <div className='downloadInputfields'>
                                    <div className='dateContainer'>
                                        <div className="ui form date">
                                            <div className="ui header">Start Date </div>
                                            <DatePicker selected={startDate} placeholderText={'dd/mm/yy'} dateFormat="dd/MM/yy" onChange={(date) => { setShowDownloadLink(false); date !== null ? setStartDate(date) : setStartDate('') }} />
                                        </div>
                                        <div className="ui form date">
                                            <div className="ui header" >End Date</div>
                                            <DatePicker selected={endDate} placeholderText={'dd/mm/yy'} dateFormat="dd/MM/yy" onChange={(date) => { setShowDownloadLink(false); date !== null ? setEndDate(date) : setEndDate('') }} />

                                        </div>
                                    </div>
                                    <div>
                                        <Dropdown
                                            placeholder="Select Download Option"
                                            selection
                                            options={[
                                                { key: 'initialInput', value: 'initialInput', text: 'Select' },
                                                { key: 'metal', value: 'metal', text: 'Metal' },
                                                { key: 'stone', value: 'stone', text: 'Stone' },
                                            ]}
                                            className='dropdownoptions'

                                            onChange={(e, { value }) => handleDownloadOptionChange(value)}
                                        />
                                        {downloadOption === 'metal' && (
                                            <Dropdown
                                                placeholder="Select Metal Option"
                                                selection
                                                defaultValue={"Metal"}
                                                options={metalTypeOptions}
                                                onChange={(e, { value }) => {
                                                    handleMetalOptionChange(value);
                                                    if (value !== " ") {
                                                        // setDisabledbtn(false);
                                                    } else {
                                                        // setDisabledbtn(true);
                                                    }
                                                }}



                                                className='dropdownoptions'
                                            // Increase the z-index value
                                            />
                                        )}
                                        {downloadOption === 'stone' && (
                                            <Dropdown
                                                placeholder="Select Stone Shape Option"
                                                selection
                                                defaultValue={"Stone"}
                                                options={stoneShapeOptions}
                                                onChange={(e, { value }) => {
                                                    if (value !== " ") {
                                                        handleStoneShapeOptionChange(value);
                                                        setDisabledbtn(false);
                                                    } else {
                                                        setDisabledbtn(true);
                                                    }
                                                }}


                                                className='dropdownoptions'
                                            // Increase the z-index value
                                            />
                                        )}
                                    </div>
                                </div>
                                {showDownloadLink && (
                                    <div
                                        className='download-button'

                                        onClick={() => { closePopup(); downloadXLSXFile(data, headers, `${downloadOption}_${downloadOption === 'metal' ? metalOption : stoneShapeOption}`) }}
                                    >
                                        Download
                                    </div>
                                )}
                                {!showDownloadLink && (
                                    <div className="download-button white" onClick={disabledbtn ? null : () => { downloadData(downloadOption === "metal" ? mnfOrderList : stoneOrderList, downloadOption === "metal" ? metalOption : stoneShapeOption); getHeaders(); }}>
                                        <Icon className="file excel" />
                                        <div className="text" >Get Data</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="popup-background" onClick={closePopup}></div>
                </div>
            )}
        </div>
    );
};

export default DownloadButton;
