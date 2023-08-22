import React from "react";


const CompletedList = (props) => {




    const stoneOrderrenderer = () => {

        
        return (props.order.stoneOrder.map((stone, index) => {
            return (
                <tbody key={index}>
                    <tr>
                        <td>{props.order.givenDate}</td>
                        <td>{stone.stoneType}</td>
                        <td>{stone.stoneShape}</td>
                        <td>{stone.stoneColor}</td>
                        <td>{stone.stoneSize}</td>
                        <td>{stone.stoneQty}</td>
                        <td>{stone.brokenQty}</td>
                        <td>{stone.orderId}</td>
                        <td style={{ width: "2rem" }} ><i className="icon trash" onClick={() => { props.deleteHandler(props.order, "stoneOrder") }} /></td>
                    </tr>
                </tbody>
            );
        }))
    }


    if (props.type === "Metal" && props.activeMenu === "Metal") {
        return (
            // <div className="ui inverted segment" >
            //     <div className="ui inverted relaxed divided list">
            //         {props.type === "Metal" ?
            //             (<div>
            //                 <div className="headingContainer">
            //                     <div className="dateContainer">
            //                         <div className="header " style={{ textAlign: "left", display: "inline-block" }}> Issue Date :  {props.order.givenDate}</div>
            //                         <div className="header " style={{ textAlign: "center", display: props.type === "Metal" ? "inline-block" : "none" }}> Recieve Date :  {props.order.receivedDate}</div>
            //                     </div>
            //                     <div className="iconContainer">
            //                         <i className="trash icon" onClick={()=>{props.deleteHandler(props.order._id, "mnfOrder")}} />
            //                     </div>
            //                 </div>
            //                 <div className="item">

            //                     <div className="manufacturingOrder">


            //                         <div className="weightContainer" style={{ width: "inherit" }}>
            //                             <div className="container">
            //                                 <div className="Attributes" style={{ marginRight: "10px", fontWeight: "500" }}> {props.order.Metal.metalPurity} {props.order.Metal.metalColor} : </div>
            //                                 <div className="header">{props.order.Metal.metalWeight} gms</div>

            //                                 <div className="orderItems " style={{ marginRight: "10px" }}>Alloy :</div>
            //                                 <div className="header"> {props.order.Metal.Alloy.alloyWeight} gms</div>

            //                                 <div className="orderItems" style={{ marginRight: "10px" }}>Runner : </div>
            //                                 <div className="header">{props.order.Runner.runnerWeight} gms</div>

            //                             </div>

            //                             <div className="container" style={{ marginRight: "2rem" }}>

            //                                 <div className="Items" style={{ marginRight: "10px" }}>Total Weight: </div>
            //                                 <div className="header">  {props.order.totalMetalGiven} Gms </div>
            //                             </div>
            //                         </div>

            //                         <div className=" ui fitted divider"></div>

            //                         <div className="totalContainer" style={{ width: "inherit" }}>

            //                             <div className="container">

            //                                 <div className="container">

            //                                     <div className="Items" style={{ marginRight: "10px" }}>Issued: </div>
            //                                     <div className="header">  {props.order.Runner.runnerWeight} </div>
            //                                 </div>

            //                                 <div className="container">

            //                                     <div className="orderItems" style={{ marginRight: "10px" }}>Recieved: </div>
            //                                     <div className="header">  {props.order.Runner.runnerWeight} </div>


            //                                 </div>

            //                             </div>



            //                         </div>

            //                     </div>
            //                 </div>



            //             </div>) :
            //             (<div>
            //                 <div className="headingContainer">
            //                     <div className="dateContainer">
            //                         <div className="header " style={{ textAlign: "left", display: "inline-block" }}> Issue Date :  {props.order.givenDate}</div>
            //                     </div>
            //                     <div className="iconContainer">
            //                         <i className="trash icon" onClick={()=>{props.deleteHandler(props.order._id, "stoneOrder")}} />
            //                     </div>
            //                 </div>
            //                 <div >
            //                     {stoneOrderrenderer()}
            //                 </div>
            //             </div>
            //             )}
            //     </div>

            // </div>
            <tbody>
                <tr>
                    <td>{props.order.givenDate}</td>
                    <td>{props.order.receivedDate}</td>
                    <td>{props.order.Metal.metalPurity} {props.order.Metal.metalColor}</td>
                    <td>{props.order.Metal.metalWeight}</td>
                    <td>{props.order.Metal.Alloy.alloyWeight}</td>
                    <td>{props.order.Runner.runnerWeight}</td>
                    <td>{props.order.totalMetalGiven}</td>
                    <td>{props.order.totalMetalReceived}</td>
                    <td>{props.order.totalRunnerReceived}</td>
                    <td>{props.order.usedInOrder}</td>

                    <td style={{ display: "flex", justifyContent: "space-around" }}><i className="icon trash" onClick={() => { props.deleteHandler(props.order, "mnfOrder") }} /></td>

                </tr>
            </tbody>
        );
    }

    if (props.type === "Stone" && props.activeMenu === "Stone") {

        return stoneOrderrenderer()
    }

};
export default CompletedList;
