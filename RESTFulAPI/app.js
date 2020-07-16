const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


function sendError(res, code, message)
{
    res.status(code).json(
        {
            error:
            {
                code,
                message
            }
        }
    );
}

const products = [
{
    id: 0,
    name: 'Iphone 11',
    brand: 'Apple',
    amount: 52
},
{
    id: 1,
    name: 'Iphone 11 Pro',
    brand: 'Apple',
    amount: 20
},
{
    id: 2,
    name: 'Iphone 11 Pro Max',
    brand: 'Apple',
    amount: 27 
},
{
    id: 3,
    name: 'Galaxy S20',
    brand: 'Samsung',
    amount: 31
},
{
    id: 4,
    name: 'Galaxy S20 Plus',
    brand: 'Samsung',
    amount: 21
},
{
    id: 5,
    name: 'Galaxy S20 Ultra',
    brand: 'Samsung',
    amount: 35
},
{
    id: 6,
    name: 'Galaxy Note20',
    brand: 'Samsung',
    amount: 24
},
{
    id: 7,
    name: 'Galaxy Note20 Plus',
    brand: 'Samsung',
    amount: 30
}
];

IDcreating = products.length;


app.route('/products')
.get((req, res)=>{
    results = products;
    
    if(req.query === null)
    {
        if(req.query.name && req.query.brand)
        {
            sendNotFound(req);
            return;
        }
        if(req.query.name)
        {
            results = [];
            products.forEach((p)=>
            {
                if(p.name == req.query.name)
                {
                    results.append(p);
                }
            });
        }
        else if(req.query.brand)
        {
            results = [];
            products.forEach((p)=>
            {
                if(p.name == req.query.brand)
                {
                    results.append(p);
                }
            });
        }
        else
        {
            sendError(res, 400, 'Bad Request');
            return;
        }

    }
    
    res.json(results);
})
.post((req, res)=>
{
    keys = Object.keys(req.body);
    if(keys.includes('name') && keys.includes('brand') && keys.includes('amount') && keys.length == 3) 
    {
        newProduct = { id: IDcreating};
        newProduct.name = req.body.name;
        newProduct.brand = req.body.brand;
        newProduct.amount = req.body.amount;
        IDcreating++;
        products.push(newProduct);
        res.status(201).json(newProduct);
    }
    else
    {
        sendError(res, 400, 'Bad Request');
    }
})
.put((req, res)=>
{
    sendError(res, 400, 'Bad Request');
})
.delete((req, res)=>
{
    sendError(res, 400, 'Bad Request');
});

app.use('/products/:id', (req, res, next) =>
{
    req.product = products.find((p)=> p.id == req.params.id);
    if(!req.product)
    {
        sendError(res, 404, 'Not Found');
        return;
    }
    next();
})

app.route('/products/:id')
.get((req, res)=>{
    res.json(req.product);
})
.post((req, res)=>{
    sendError(res, 400, 'Bad Request');
})
.put((req, res)=>{
    if(!req.body || req.query == null)
    {
        sendError(res, 400, 'Bad Request');
        return;
    }

    if(!req.body.name || !req.body.brand || !req.body.amount)
    {
        sendError(res, 400, 'Bad Request');
        return;
    }
    product = req.product;
    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.amount = req.body.amount || product.amount;
    res.status(200).json(product);

})
.delete((req, res)=>{
    products.splice(products.indexOf(req.product), 1);
    res.sendStatus(204);
});

app.listen(port, ()=>{
    console.log('Server is listening on port '+ port);
})

