import React from 'react';

function Education() {
    return ( 
        <div className='container'>
            <div className='row mt-5'>
                <div className='col-6 mt-5'>
                <img src='media/images/education.svg' alt='Hero section'  className='mb-5'/>
                </div>
                <div className='col-6 mt-5'> 
                    <h1 className='mb-3 fs-2'>Free and open market education</h1>
                    <p className='text-muted'>Karsity, the largest online stock market education book in the world covering everything from the basics to advanced trading.</p>
                    <a href='' style={{textDecoration:"none"}}>Versity <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>

                    <p className='text-muted mt-5'>TradingQ&A, the most active trading and investment community in India for all your market related queries.</p>
                    <a href='' style={{textDecoration:"none"}}>TradingQ&A <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
                
                </div>
            </div>
        </div>
     );
}

export default Education;