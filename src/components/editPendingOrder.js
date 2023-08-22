import React from "react";

import Addmnforder from "./Addmnforder";


const Editpendingorders = (props) => {

        return (
            <div> <Addmnforder order={props.order} addStock={props.addStock}  stock={props.stock} setStock={props.setStock} stoneOrder={props.stoneOrder} attr={props.attr} addManufacturingOrder={props.addManufacturingOrder} type={props.type} /> </div>
        )
}
export default Editpendingorders