import React from 'react';
import '../App.css';


class Create extends React.Component {
    constructor(props) {
        super(props);
        var today = new Date();

        //Declare States

        this.state = {
            customerCodeValue: "Customer Code",
            allCustomers: [],
            allProducts: [],
            invoiceItems: [],
            invoiceNumber: Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111,
            date: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
            itemQuantValue: 0,
            itemPriceValue: 0,
            lineTotalValue: 0,
            itemIDValue: "Item ID",
            itemNameValue: "",
            itemIDError: true,
        };


    }

    //Call the backend

    componentDidMount() {

        //Get all customers

        fetch("/getCustomers")
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    allCustomers: json,
                });
            });

        //Get all products
        
        fetch("/getProducts")
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    allProducts: json,
                });
            });
    }

    //Handle the customer code input

    handleCustomerInput = (event) => {
        this.setState({
            customerCodeValue: event.target.value.toUpperCase(),
        });

        //Compare the given customer code to the customers in the DB

        for (let i = 0; i < this.state.allCustomers.length; i++) {
            if (event.target.value.toUpperCase() == this.state.allCustomers[i].customerCode) {
                document.getElementById('customerCodeInput').innerHTML = `<h2>${event.target.value}</h2>`
                document.getElementById('customerName').innerHTML = `<h2>${this.state.allCustomers[i].customerName}</h2>`
                document.getElementById('customerAddress').innerHTML = `${this.state.allCustomers[i].customerAddress}`
                
            }
            console.log(event.target.value)
            console.log(this.state.allCustomers)
        }

    };

    //Handle the Item ID input

    handleItemInput = (event) => {
        this.setState({
            itemIDValue: event.target.value,
        });

        //Compare the given ID to the products in the DB

        for (let i = 0; i < this.state.allProducts.length; i++) {
            if (event.target.value == this.state.allProducts[i].itemID) {
                document.getElementById('itemPrice').innerHTML = `R ${this.state.allProducts[i].itemPrice}`
                document.getElementById('itemName').innerHTML = `${this.state.allProducts[i].itemName}`
                this.setState({
                    itemPriceValue: this.state.allProducts[i].itemPrice,
                    itemNameValue: this.state.allProducts[i].itemName,
                    itemIDError: false
                })
            }
        }


    };

    //Handle the Item Quant input

    handleItemQuantInput = (event) => {
        this.setState({
            itemQuantValue: event.target.value,
            lineTotalValue: this.state.itemPriceValue * event.target.value
        });

        //Update the frontend with new line total
        document.getElementById('lineTotal').innerHTML = `R ${this.state.itemPriceValue * event.target.value}`

    };

    //Handle adding the line 

    handleAddLine = () => {

        if (!this.state.itemIDError && this.state.itemQuantValue != 0 && !isNaN(this.state.itemQuantValue)) {
            //Add a new line to the table 

            let template = `
            <tr>
                <td className="centerAlign">${this.state.itemIDValue}</td>
                <td className="centerAlign">${this.state.itemQuantValue}</td>
                <td className="centerAlign">${this.state.itemNameValue}</td>
                <td className="centerAlign">R ${this.state.itemPriceValue}</td>
                <td className="centerAlign">R ${this.state.lineTotalValue}</td>
                <td></td>
            </tr>`;

            document.getElementById('invoiceBody').innerHTML += template;

            //Update the invoice array with new information

            let invoiceNumber = this.state.invoiceNumber;
            let invoiceDate = this.state.date;
            let customerCode = this.state.customerCodeValue;
            let itemID = this.state.itemIDValue;
            let itemQuant = this.state.itemQuantValue;
            let lineTotal = this.state.lineTotalValue;

            var tempInvoiceItems = this.state.invoiceItems
            tempInvoiceItems.push({ invoiceNumber, invoiceDate, customerCode, itemID, itemQuant, lineTotal })

            //Loop through the invoice array to calculate new subtotal

            let currentSubtotal = 0;

            for (let i = 0; i < tempInvoiceItems.length; i++) {
                currentSubtotal += Number(tempInvoiceItems[i].lineTotal)
            }

            //Update new totals that are displayed

            document.getElementById('totalDiv').style.visibility = "visible";
            document.getElementById('subtotalValue').innerHTML = `R ${currentSubtotal}`;
            document.getElementById('vatValue').innerHTML = `R ${currentSubtotal * 0.15}`;
            document.getElementById('totalValue').innerHTML = `R ${currentSubtotal + (currentSubtotal * 0.15)}`;

            //Reset all states

            this.setState({
                itemIDValue: "Item ID",
                itemQuantValue: 0,
                itemPriceValue: 0,
                lineTotalValue: 0,
                itemNameValue: "",
                invoiceItems: tempInvoiceItems,
                itemIDError: true

            })

        } else {
            alert(`The line you're trying to add is invalid. Please check your item code and quantity.`)
        }

    };

    //Handle the submittion of the form

    handleSubmit(event) {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.invoiceItems)
        };
        fetch('/add', requestOptions)
            .then(response => response.json())

        alert(`INV${this.state.invoiceNumber} created! You will be redirected to the "Find an Invoice" page`)
        window.location = "/find"
    }



    render() {

        return (
            <div>
                <div className='content'>
                    <table>
                        <tbody>
                            <tr>
                                <td className='leftAlign' width={"40%"}><a href='/'><img alt='Logo' width={"50%"} src={"https://463270-1451151-1-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2020/06/Thyme_Logo-1024x330.png"}></img></a></td>
                                <td className='leftAlign'><h1>Create an Invoice</h1></td>
                            </tr>

                        </tbody>
                    </table>

                </div>

                <form>
                    <div className='content'>
                        <table className='fullWidth'>
                            <tr>
                                <td className='leftAlign' id='customerCodeInput'>
                                    <input
                                        type={"text"}
                                        value={this.state.customerCodeValue}
                                        onChange={this.handleCustomerInput}
                                        style={{ textTransform: "uppercase" }}
                                    ></input>
                                </td>
                                <td className='rightAlign' id='customerName'></td>

                            </tr>
                            <tr>
                                <td className='leftAlign' id='customerAddress'></td>
                                <td className='rightAlign'>Inv {this.state.invoiceNumber}</td>
                            </tr>
                        </table>
                    </div>
                    <div className='content'>
                        <table className='fullWidth'>
                            <thead>
                                <tr>
                                    <th className='centerAlign'>
                                        Item ID
                                    </th>
                                    <th className='centerAlign'>
                                        Item Quantity
                                    </th>
                                    <th className='centerAlign'>
                                        Item Name
                                    </th>
                                    <th className='centerAlign'>
                                        Item Price
                                    </th>
                                    <th className='centerAlign'>
                                        Line Total
                                    </th>

                                </tr>
                                <tr>
                                    <td className='centerAlign'>
                                        <input type={Text} id='itemIDInput' value={this.state.itemIDValue} onChange={this.handleItemInput}></input>
                                    </td>
                                    <td className='centerAlign'>
                                        <input type={Number} id='itemQuantInput' value={this.state.itemQuantValue} onChange={this.handleItemQuantInput}></input>
                                    </td>
                                    <td className='centerAlign' id='itemName'>

                                    </td>
                                    <td className='centerAlign' id='itemPrice'>

                                    </td>
                                    <td className='centerAlign' id='lineTotal'>

                                    </td>
                                    <td className='centerAlign'>
                                        <a style={{ color: "blue" }} onClick={this.handleAddLine}>Add Line</a>
                                    </td>
                                </tr>
                            </thead>
                            <tbody id='invoiceBody'>
                            </tbody>

                        </table>
                    </div>
                    <div className='content' id='invoiceDiv' style={{ visibility: "hidden" }}>
                        <table className='fullWidth' id='invoiceTable'>
                        </table>
                    </div>
                    <div className='content' id='totalDiv' style={{ visibility: "hidden" }}>
                        <table className='fullWidth' id='totalTable'>
                            <tr>
                                <th className='rightAlign'>Subtotal:
                                </th>
                                <td className='rightAlign' id="subtotalValue"></td>
                            </tr>
                            <tr>
                                <th className='rightAlign'>VAT (15%):
                                </th>
                                <td className='rightAlign' id="vatValue"></td>
                            </tr>
                            <tr>
                                <th className='rightAlign'>Total:
                                </th>
                                <td className='rightAlign' id="totalValue"></td>
                            </tr>
                            <tr className='rightAlign fullWidth'>
                                <a id='invoiceSubmitButton' style={{ color: "blue" }} onClick={this.handleSubmit.bind(this)}>Create invoice</a>
                            </tr>
                        </table>
                    </div>
                </form>


            </div>
        )
    }

}

export default Create;