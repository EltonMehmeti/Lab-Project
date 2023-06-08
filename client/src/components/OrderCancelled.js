import React from "react";
import gifImage from "../img/images.png"

const OrderCancelled = () => {
    return (
        <div className="h-screen bg-gray-100 flex justify-center items-center ">
          <div className=" w-[750px] h-[600px] m-auto shadow-lg bg-white rounded-lg">
                <div className="flex flex-col items-center  h-screen">
                    <img src={gifImage} className="max-w-[350px] mt-9" />

                    <div className="text-center mt-10" >
                        <p className="text-red-500 text-4xl font-bold">Order Canceled !</p>


                        <p className="font-semibold text-gray-700 p-7 ">We're sorry, but your order has been canceled.</p>
                        <a href= "http://localhost:3000"className="font-bold bg-gray-500 rounded-lg  text-xl text-white p-3  ">Back to Home</a>
                    </div>
                </div>
         </div>

        </div>
    
    )
}


export default OrderCancelled;