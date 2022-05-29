require('dotenv').config()      //Import .env
const express = require("express");     //Import Express
const app = express();      //Use express
const sql = require('mssql');       //Import mssql
const bodyParser = require("body-parser");      //Import body-parser
const router = express.Router();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Create the config variable for the SQL connection

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename: process.env.DB_INSTANCE
    },
    port: Number(process.env.DB_PORT)
}


//FUNCTIONS


//Function that gets all the information for all the invoices

const getInvoices = async () => {

    try {
        let pool = await sql.connect(config);
        let invoices = pool.request().query(`SELECT * FROM invoiceTable`);
        return invoices

    } catch (err) {
        console.log(err);
    }

}

//Function that gets all the information for specific customerCode

const getCustomer = async (customerCode) => {

    try {
        let pool = await sql.connect(config);
        let customer = pool.request().query(`SELECT * FROM customerTable WHERE customerCode = '${customerCode}'`);
        return customer

    } catch (err) {
        console.log(err);
    }

}

//Function that gets all the information for all the products

const getProducts = async () => {

    try {
        let pool = await sql.connect(config);
        let products = pool.request().query(`SELECT * FROM productTable`);
        return products

    } catch (err) {
        console.log(err);
    }

}

//Function that gets all the information for all the customers

const getCustomers = async () => {

    try {
        let pool = await sql.connect(config);
        let customers = pool.request().query(`SELECT * FROM customerTable`);
        return customers

    } catch (err) {
        console.log(err);
    }

}

//Function that adds information to invoice table

const addInvoice = async (invoiceItems) => {


    for (let i = 0; i < invoiceItems.length; i++) {

        //Declare Variables
        var invNumber = invoiceItems[i].invoiceNumber;
        var invDate = invoiceItems[i].invoiceDate;
        var customerCode = invoiceItems[i].customerCode;
        var itemID = invoiceItems[i].itemID;
        var itemQuant = invoiceItems[i].itemQuant;
        var lineTotal = invoiceItems[i].lineTotal;

        try {
            let pool = await sql.connect(config);
            pool.request().query(`INSERT INTO invoiceTable VALUES (${invNumber},'${invDate}','${customerCode}',${itemID},${itemQuant},${lineTotal})`);

        } catch (err) {
            console.log(err);
        }
    }



}


//REQUEST HANDLERS  


//Handle post request to /add

router.post('/add', (req, res) => {
    let invoices = req.body;
    addInvoice(invoices)
})

//Handle the get request to /getCustomers

router.get('/getCustomers', (req, res) => {

    getCustomers().then(customers => {
        res.send(customers.recordset)
    })

})

//Handle the get request to /getProducts

router.get('/getProducts', (req, res) => {

    getProducts().then(products => {
        res.send(products.recordset)
    })

})

//Handle the get request to /getInvoices

router.get('/getinvoices', (req, res) => {

    getInvoices().then(invoices => {
        res.send(invoices.recordset)
    })

})


app.use("/", router);

//Backend should listen on port 3001
app.listen(3001, () => {
    console.log("Running on port 3001")
})