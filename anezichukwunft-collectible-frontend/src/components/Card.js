import React from "react"

export default function Card(props) {
   return (
        <div className="card">
            <img src={`${props.item.imageUrl}`} className="card--image" />
        
                <div className="tree">{props.item.title} </div>
                <div className="price">{props.item.price} -</div>
                <div className="buttonBuy"><button type="button">Buy </button></div>
                <p className="cardDescribe">{props.item.description}</p>
           
            
        </div>
        
    )
}