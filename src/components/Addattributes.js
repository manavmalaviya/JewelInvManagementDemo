import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./maincontent.css";

import './addAttributes.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


const AddAtrribute = (props) => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("Stone")
    const [type, setType] = useState("Stone")
    const [alloyVisibility, setalloyVisibility] = useState("none");
    const [isLoading, setIsLoading] = useState(false)
    const [attrState, setAttrState] = useState(
        {
            Type: type,
            Metal: {
                metalType: "",
                metalColor: "",
                metalPurity: "",
                includesAlloy: "False",
                Alloy: {
                    alloyColor: ""
                },
            },
            Stone: {
                stoneType: "",
                stoneShape: "",
                stoneColor: "",
                stoneSize: []
            }

        });
    // Stone:{

    // }
    // const [stoneAttr,setStoneAttr]=useState({
    //     Type:
    // })
    const changeRoute = (route) => {
        navigate(route);
    }

    const handleClick = async (type) => {
        await setActiveMenu(type);
        await setType(type);
        // return "checked"
    }
    const add = async (e) => {
        setIsLoading(true)
        const newAttrState = {}
        newAttrState.Type = attrState.Type
        if (type === "Stone") {
            handleChange(entries, "stoneSize", "Stone")
        }


        e.preventDefault();

        const isAnyFieldEmpty = Object.values(attrState[type]).some((value) => value === "");


        if (isAnyFieldEmpty) {
            setIsLoading(false)
            alert("Missing Fields Not Allowed")
        }
        else {

            if (type === "Stone") {
                newAttrState.Stone = attrState.Stone
                if (newAttrState.Stone.stoneSize.length < 1) {
                    newAttrState.Stone.stoneSize = entries
                }
            }
            else {
                newAttrState.Metal = attrState.Metal

            }
            await props.addAttrHandler(newAttrState);
            navigate("/attrlist")
        }

    }


    const [entries, setEntries] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            const trimmedInputValue = inputValue.trim();
            if (!entries.some((entry) => entry.size === trimmedInputValue)) {
                setEntries([...entries, { size: trimmedInputValue }]);
            }
            else (
                alert("Duplicate Sizes Not")
            )
            setInputValue('');
        }
    };

    const handleDelete = (index) => {

        setEntries(entries.filter((_, i) => i !== index));
    }


    const handlePaste = (event) => {
        const pastedData = event.clipboardData.getData('Text');
        const separatedValues = pastedData.split(' ').filter(value => value.trim() !== '');

        if (separatedValues.length > 0) {
            event.preventDefault();
            separatedValues.map(async (item, index) => {

                // await setInputValue(item)
                if (item.trim() !== " ") {
                    const trimmedInputValue = item.trim();
                    if (!entries.some((entry) => entry.size === trimmedInputValue)) {
                        await setEntries(entries => [...entries, { size: trimmedInputValue }])
                    }
                    else {
                        alert(item + " Already exists")
                    }
                    // await setInputValue("")
                }

            })
        }
    };

    const capitaliseWord = (values) => {
        if (typeof (values) === 'boolean') {
            values = values ? "true" : "false"
        }

        return values = values.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    const handleChange = async (value, PropName, parent) => {


        if (parent === "Metal") {
            if (PropName === "includesAlloy" && value === "True") {
                setalloyVisibility("block")

                setAttrState((attrState) => ({
                    ...attrState, Metal: {
                        ...attrState.Metal, Alloy: { alloyColor: attrState.Metal.metalColor }
                    }
                }))
            }
            else {
                await setalloyVisibility("none");
                setAttrState((attrState) => ({
                    ...attrState, Metal: {
                        ...attrState.Metal, Alloy: { alloyColor: "" }
                    }
                }))
            }
            setAttrState((attr) => ({
                ...attr, Metal: {
                    ...attr.Metal, [PropName]: value
                }
            }))
        }
        if (parent === "attrList") {
            setAttrState((attr) => ({
                ...attr, [PropName]: value
            }))
        }
        else {

            if (PropName === "stoneSize") {

                await setAttrState((attr) => ({
                    ...attr, Stone: {
                        ...attr.Stone, stoneSize: value
                    }
                }))
            }

            setAttrState((attr) => ({
                ...attr, Stone: {
                    ...attr.Stone, [PropName]: value
                }
            }))
        }


    }
    return (

        <div className="mainContent">
            <form className="ui form">

                <div className="ui top attached tabular menu">
                    <div className={`item ${activeMenu === 'Metal' ? 'active' : ''} `} onClick={() => { handleClick('Metal'); handleChange(capitaliseWord('Metal'), "Type", "attrList") }}>
                        Metal
                    </div>
                    <div className={`item ${activeMenu === 'Stone' ? 'active' : ''} `} onClick={() => { handleClick('Stone'); handleChange(capitaliseWord('Stone'), "Type", "attrList") }} >
                        Stone
                    </div>
                </div>

                <div className="ui form" style={{ display: activeMenu === "Metal" ? "block" : "none" }}  >
                    <div className="field two">
                        <div className="column">
                            <label style={{ marginLeft: "10vw", fontWeight: "bold" }}>{activeMenu}</label>
                            <div className="one fields">
                                <div className="field ">
                                    <input

                                        type="text"
                                        name="metalType"
                                        placeholder="Metal Type"
                                        style={{ minWidth: "110px", width: "15vw", marginLeft: "10vw" }}
                                        value={attrState.Metal.metalType}
                                        onChange={(e) => handleChange(capitaliseWord(e.target.value), "metalType", "Metal")}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <label style={{ minWidth: "110px", marginLeft: "10vw", fontWeight: "bold" }}>{activeMenu} Color</label>
                            <div className="one fields">
                                <div className="field">
                                    <input

                                        type="text"
                                        name="metalColor"
                                        placeholder="Metal Color"
                                        style={{ minWidth: "110px", width: "15vw", marginLeft: "10vw" }}
                                        value={attrState.Metal.metalColor}
                                        onChange={(e) => handleChange(capitaliseWord(e.target.value), "metalColor", "Metal")} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label style={{ marginLeft: "10vw" }}>Purity</label>
                        <div className="fields">
                            <div className="four wide field">
                                <input

                                    type="text"
                                    name="purity"
                                    placeholder="Purity"
                                    style={{ minWidth: "110px", marginLeft: "10vw", width: "20vw" }}
                                    value={attrState.Metal.metalPurity}
                                    onChange={(e) => handleChange(capitaliseWord(e.target.value), "metalPurity", "Metal")} />
                            </div>

                        </div>
                    </div>

                    <div className="row">
                        <input

                            type="checkbox" name="Alloy" style={{ marginLeft: "10vw", marginBottom: "2vw" }} onChange={(e) => { handleChange(capitaliseWord(e.target.checked), "includesAlloy", "Metal") }} />
                        <label style={{ marginLeft: "2vw", marginBottom: "2vw" }}>Include Alloy</label>
                    </div>


                    <div className="field" style={{ display: alloyVisibility }}>
                        <label style={{ marginLeft: "10vw" }}>Alloy Color</label>
                        <div className="fields">
                            <div className="four wide field">
                                <input
                                    type="text"
                                    name="Alloy Color"
                                    placeholder="Alloy Color"
                                    disabled
                                    style={{ minWidth: "110px", width: "40vw", marginLeft: "10vw" }}
                                    value={alloyVisibility === 'block' ? capitaliseWord(attrState.Metal.metalColor) : ""}
                                />
                            </div>

                        </div>
                    </div>

                </div>



                <div className="ui form" style={{ display: activeMenu === "Stone" ? "block" : "none" }}>

                    <div className="toRowAttr">

                        <div className="toColumnAttr">
                            <div className="ui header">Type</div>
                            <input
                                type="text"
                                name="stoneType"
                                placeholder="Stone Type"
                                style={{ minWidth: "110px", width: "15vw" }}
                                value={attrState.Stone.stoneType}
                                onChange={(e) => handleChange(capitaliseWord(e.target.value), "stoneType", "Stone")}
                            />
                        </div>
                        <div className="toColumnAttr">
                            <div className="ui header">Shape</div>
                            <input
                                type="text"
                                name="stoneShape"
                                placeholder="Stone Shape"
                                style={{ minWidth: "110px", width: "15vw" }}
                                value={attrState.Stone.stoneShape}
                                onChange={(e) => handleChange(capitaliseWord(e.target.value), "stoneShape", "Stone")}
                            />
                        </div>

                        <div className="toColumnAttr">
                            <div className="ui header">Color</div>
                            <input
                                type="text"
                                name="stoneColor"
                                placeholder="Stone Color"
                                style={{ minWidth: "110px", width: "15vw" }}
                                value={attrState.Stone.stoneColor}
                                onChange={(e) => handleChange(capitaliseWord(e.target.value), "stoneColor", "Stone")}
                            />
                        </div>



                    </div>

                    <div className="multipleSelectionField" >

                        <div className="toColumnAttr">
                            <div className="ui header">Size</div>
                            <input
                                type="text"
                                placeholder="Enter Size and press Enter"
                                value={inputValue}
                                onChange={(e) => handleInputChange(e)}
                                onKeyDown={(e) => handleKeyDown(e)}
                                onPaste={handlePaste}
                                style={{ width: "40vw" }}
                            />
                        </div>


                    </div>
                    <div style={{ display: "flex", alignContent: "center", flexWrap: "wrap", margin: "1rem", marginLeft: "8vw", width: "fit-content", maxWidth: "60vw", background: entries.length > 0 ? "white" : "none", padding: "0.5rem", boxSizing: "border-box", borderRadius: "5px", border: entries.length > 0 ? "solid 1px #d5d8de" : "none" }}>

                        {entries.map((entry, index) => (
                            <div className="multipleSelectionEntry" key={index}>
                                <div key={index} style={{ marginRight: "2px" }}>{entry.size}</div>
                                <i className="close icon" style={{ cursor: "pointer" }} onClick={() => handleDelete(index)}></i>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="attrbuttons" >

                    <div className="addAttrbtn" onClick={(e) => add(e)} style={{ display: "flex" }}>

                        {isLoading ? (<FontAwesomeIcon icon={faSpinner} spin />) : (<></>)}
                        <div className="text" style={{marginLeft:isLoading?"0.5rem":""}}>Add</div>
                    </div>
                    <div className="addAttrbtn" onClick={() => changeRoute("/attrlist")} >

                        <div className="text">Back</div>
                    </div>

                </div>
            </form>
        </div>

    );

}
export default AddAtrribute;