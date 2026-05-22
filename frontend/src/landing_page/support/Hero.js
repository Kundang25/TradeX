import React from 'react';

function Hero() {
    return ( 
        <section className="container-fluid" id='supportHero'>
        <div className=" p-3 " id="supportwrapper">
            <h4>Support Portal</h4>   
            <a href='/support'> Track Tickets</a>
        </div>
        <div className="row p-5 m-5" >
            <div className='col-6 p-5 '>
                <h1 className='fs-3'>Search for an answer or browse help topics to create a ticket</h1>
                <input placeholder='Eg: how do i activate F&O, why is my order getting rejected..'/><br/>
                <a href='/support' style={{ color:"white"}}>Track account opening</a> &nbsp;
                <a href='/support' style={{ color:"white"}}>Track segment activation</a> &nbsp;
                <a href='/support' style={{ color:"white"}}>Intraday margins</a> &nbsp;
                <a href='/support' style={{ color:"white"}}>Kite user manual</a> &nbsp;
            </div>
            <div className='col-6 p-5 mb-2 mt-2'>
                <h1 className='fs-3 mb-3'>Featured</h1>
                <a href='/support' style={{textDecoration:"none", color:"white"}}>1. Current Takeovers and Delisting - January 2024</a> <br/>
                <a href='/support' style={{textDecoration:"none", color:"white"}}>2. Latest Intraday leverages - MIS & CO</a> &nbsp;
            </div>
        </div>
    </section>
     );
}

export default Hero;