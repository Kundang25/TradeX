import React from 'react';

function Hero() {
    return ( 
        <div className='container border-bottom'>
            <div className='text-center mt-5 p-3 mb-5'>
                <h1>Technology</h1>
                <h3 className='mt-3 text-muted fs-4'>Sleek, modern and intuitive trading platforms</h3>
                <p className='mt-3'>Check out our <a href='/' style={{textDecoration:"none"}}>investment offerings <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a> </p>
            </div>
        </div>
     );
}

export default Hero;