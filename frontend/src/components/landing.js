import React from 'react';

class Landing extends React.Component {

    render() {
        return (
            <div className='content'>
                <h1>Invoice Manager</h1>
                <h3>Please select an option</h3>
                <a href="find"><button className='landingButton'>Find an invoice</button></a>
                <br />
                <a href='create'><button className='landingButton'>Create an invoice</button></a>

            </div>
        )
    }

}

export default Landing;