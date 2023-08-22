import React from "react";
import { useNavigate } from "react-router-dom";
const PendingList = (props) => {
    // const{id,type,Metal,MetalColor,Purity,alloy}=props.attrDetail;
    const navigate = useNavigate()
    const edit = async (order) => {
        let response = null;
        response = await props.orderToEdit(order,"mnfOrder")
        if (response) {
            navigate("/manufacturing/edit")
        }

    }


    return (
        
            <tbody>
                <tr>
                    <td>{props.order.givenDate}</td>
                    <td>{props.order.Metal.metalType}</td>
                    <td>{props.order.Metal.metalPurity}</td>
                    <td>{props.order.Metal.metalColor}</td>
                    <td>{props.order.Metal.metalWeight}</td>
                    <td>{props.order.Metal.Alloy.alloyWeight}</td>
                    <td>{props.order.Runner.runnerWeight}</td>
                    <td>{props.order.totalMetalGiven}</td>
                    
                    <td style={{  display:"flex",justifyContent:"space-around" }}><i className="icon edit" onClick={() => { edit(props.order) }} /> <i className="icon trash" onClick={() => { props.deleteHandler(props.order, "mnfOrder") }} /></td>
                           
                </tr>
            </tbody>
    );

};
export default PendingList;
