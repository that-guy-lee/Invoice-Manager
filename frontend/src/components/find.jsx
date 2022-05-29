import React from 'react';
import '../App.css';

class Find extends React.Component {
    constructor(props) {
        super(props);

        //Declare States

        this.state = {
            inputValue: "Invoice Number",
            allInvoices: [],
            selectedInvoice: [],
            allCustomers: [],
            selectedCustomer: [],
            allProducts: []

        };

    }

    //Call the backend

    componentDidMount() {
        //Get all the invoices

        fetch("/getInvoices")
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    allInvoices: json,
                });
            });

        //Get all the customers

        fetch("/getCustomers")
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    allCustomers: json,
                });
            });

        //Get all the products

        fetch("/getProducts")
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    allProducts: json,
                });
            });

    }

    //Handle the input

    handleInput = (event) => {
        this.setState({
            inputValue: event.target.value,
        });

        //Compare the given invNumber to the invoices in the DB
        //If a match is found, add the lines to the selectedInvoice state and disable user input

        for (let i = 0; i < this.state.allInvoices.length; i++) {
            if (event.target.value == this.state.allInvoices[i].invNumber) {
                this.state.selectedInvoice.push(this.state.allInvoices[i])
                document.getElementById('invNumberInput').innerHTML = `<p>INV ${event.target.value}</p>`
            }
        }

        //Compare the customer code to the customers in the DB
        //If a match is found, add the customer to the selectedCustomer state

        for (let i = 0; i < this.state.allCustomers.length; i++) {
            if (this.state.selectedInvoice[0].customerCode == this.state.allCustomers[i].customerCode) {
                this.state.selectedCustomer.push(this.state.allCustomers[i])
            }
        }


        //POPULATE INVOICE HEADER

        //Customer Code
        document.getElementById('customerCode').style.visibility = "visible"
        document.getElementById('customerCode').innerHTML = `${this.state.selectedInvoice[0].customerCode}`

        //invDate
        let date = new Date(this.state.selectedInvoice[0].invDate);
        document.getElementById('invDate').style.visibility = "visible"
        document.getElementById('invDate').innerHTML = `${date.getDate()} - ${date.getMonth()} - ${date.getFullYear()}`

        //customerName
        document.getElementById('customerName').style.visibility = "visible"
        document.getElementById('customerName').innerHTML = `${this.state.selectedCustomer[0].customerName}`

        //customerAddress
        document.getElementById('customerAddress').style.visibility = "visible"
        document.getElementById('customerAddress').innerHTML = `${this.state.selectedCustomer[0].customerAddress}`

        //POPULATE INVOICE TABLE BODY

        var subtotal = 0;
        document.getElementById('invoiceBody').style.visibility = "visible"

        //Loop through the selectedInvoice objects, adding each one to the invoice table
        for (let i = 0; i < this.state.selectedInvoice.length; i++) {
            var currentLine = this.state.selectedInvoice[i];

            for (let j = 0; j < this.state.allProducts.length; j++) {
                var currentProduct = this.state.allProducts[j];
                if (currentProduct.itemID == currentLine.itemID) {
                    document.getElementById('invoiceTableBody').innerHTML += `
                    <tr>
                        <td>${currentProduct.itemID}</td>
                        <td>${currentProduct.itemName}</td>
                        <td class='leftAlign'>R ${currentProduct.itemPrice}</td>
                        <td>${currentLine.itemQuant}</td>
                        <td class='leftAlign'>R ${currentLine.lineTotal}</td>
                    </tr>
                    `
                    subtotal += currentLine.lineTotal
                }
            }

        }

        //POPULATE INVOICE FOOTER
        document.getElementById('invoiceFooter').style.visibility = "visible"
        document.getElementById('invoiceTableFooter').innerHTML += `
        <tr>
            <th>Subtotal:</th>
            <td class="leftAlign">R ${subtotal}</td>
        </tr>
        <tr>
            <th>VAT (15%):</th>
            <td class="leftAlign">R ${subtotal * 0.15}</td>
        </tr>
        <tr>
            <th>Total:</th>
            <td class="leftAlign">R ${subtotal + (subtotal * 0.15)}</td>
        </tr>
        `


    };


    render() {

        return (
            <div>
                {/*Main Heading*/}

                <div className='content leftAlign'>
                    <a href='/'><img alt='logo' id='logo' src={"https://463270-1451151-1-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2020/06/Thyme_Logo-1024x330.png"}></img></a>
                </div>

                {/*Invoice Header*/}

                <div className='content'>
                    <table className='fullWidth' id='invoiceHeader'>
                        <tbody>
                            <tr className='invoiceHeaderRow'>
                                <td className='leftAlign' style={{ width: "50%" }} id='invNumberInput'><input value={this.state.inputValue} onChange={this.handleInput}></input></td>
                                <td className='rightAlign' style={{ width: "50%" }}><p id='customerCode' style={{ visibility: "hidden" }}></p></td>
                            </tr>
                            <tr className='invoiceHeaderRow'>
                                <td className='leftAlign' style={{ width: "50%" }}><p id='invDate' style={{ visibility: "hidden" }}></p></td>
                                <td className='rightAlign' style={{ width: "50%" }}><p id='customerName' style={{ visibility: "hidden" }}></p></td>
                            </tr>
                            <tr className='invoiceHeaderRow'>
                                <td className='rightAlign' style={{ width: "50%" }}></td>
                                <td className='rightAlign' style={{ width: "50%" }}><p id='customerAddress' style={{ visibility: "hidden" }}></p></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/*Invoice Body*/}

                <div className='content' id='invoiceBody' style={{ visibility: "hidden" }}>
                    <table className='fullWidth' >
                        <thead>
                            <tr>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th className='leftAlign'>Unit Price</th>
                                <th>Quantity</th>
                                <th className='leftAlign'>Line Total</th>
                            </tr>
                        </thead>
                        <tbody id='invoiceTableBody'></tbody>
                    </table>
                </div>

                {/*Invoice Footer*/}

                <div className='content' id='invoiceFooter' style={{ visibility: "hidden" }}>
                    <table className='fullWidth' >
                        <tbody id='invoiceTableFooter'></tbody>
                    </table>
                </div>

            </div >
        )
    }

}

export default Find;