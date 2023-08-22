import React from "react";
import "./attrdetail.css";

const AttrDetail = (props) => {

    // const type = props.attrDetail.Type
    // const{id,type,Metal,MetalColor,Purity,alloy}=props.attrDetail;

    const deleteThis = (deleteItem, propName) => {
        console.log(deleteItem)
        props.deleteThisAttr(deleteItem, propName);
    }

    const showSize = (Sizelist) => {
        return Sizelist.map((Size) => {
   
            return (
                <div style={{width:"fit-content",marginTop:"0.5rem"}}>

                    {Size.size} <br />

                </div>
            )
        })
    }

    if (props.activeMenu === "Metal") {
        if (props.attr.Type === "Metal") {
            return (
                <tbody>
                    <tr>
                        
                        <td>{props.attr.Metal.metalType}</td>
                        <td>{props.attr.Metal.metalColor}</td>
                        <td>{props.attr.Metal.metalPurity}</td>
                        <td className={props.attr.Metal.includesAlloy === "True" ? "positive" : ""}><i className=" icon checkmark" style={{ display: props.attr.Metal.includesAlloy === "True" ? "" : "none" }}></i></td>
                        <td style={{ width: "2rem" }}><i className="icon trash" onClick={() => { deleteThis(props.attr._id, "attr") }} /></td>
                    </tr>
                </tbody>
            )
        }
    }
    if (props.activeMenu === "Stone") {
        if (props.attr.Type === "Stone") {
            return (
                <tbody>
                    <tr>
                        <td className="top aligned">{props.attr.Stone.stoneType}</td>
                        <td className="top aligned">{props.attr.Stone.stoneShape}</td>
                        <td className="top aligned">{props.attr.Stone.stoneColor}</td>
                        <td>
                            {showSize(props.attr.Stone.stoneSize)}
                        </td>
                        {/* <td className={props.attr.Metal.includesAlloy === "True" ? "positive" : ""}><i className=" icon checkmark" style={{ display: props.attr.Metal.includesAlloy === "True" ? "" : "none" }}></i></td> */}
                        <td style={{ width: "2rem" }}><i className="icon trash" onClick={() => { deleteThis(props.attr._id, "attr") }} /></td>
                    </tr>
                </tbody>
            )
        }
    }

};
export default AttrDetail;
