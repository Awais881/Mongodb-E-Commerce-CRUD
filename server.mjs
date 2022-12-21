
import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
const app = express()
const port = process.env.PORT || 5001;
const mongodbURI = process.env.mongodbURI || "mongodb+srv://abc:awais123@cluster0.h4fc1n7.mongodb.net/Products?retryWrites=true&w=majority";
// const mongodbURI = process.env.mongodbURI || "mongodb+srv://dbuser:dbpassword@cluster0.gq9n2zr.mongodb.net/abcdatabase?retryWrites=true&w=majority";
mongoose.set('strictQuery', true);
app.use(cors());
app.use(express.json());

let products = []; // TODO: connect with mongodb instead

let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: Number,
    description: String,
    createdOn: { type: Date, default: Date.now }
});
const productModel = mongoose.model('products', productSchema);
 

app.post('/product', (req, res) => {

  const body = req.body;

  if ( // validation
      !body.name
      || !body.price
      || !body.description
  ) {
      res.status(400).send({
          message: "required parameters missing",
      });
      return;
  }

  console.log(body.name)
  console.log(body.price)
  console.log(body.description)

  // products.push({
  //     id: `${new Date().getTime()}`,
  //     name: body.name,
  //     price: body.price,
  //     description: body.description
  // });

  productModel.create({
      name: body.name,
      price: body.price,
      description: body.description,
  },
      (err, saved) => {
          if (!err) {
              console.log(saved);

              res.send({
                  message: "product added successfully"
              });
          } else {
              res.status(500).send({
                  message: "failed to add product"
              })
          }
      })
})


//   const body = req.body;


//   if (!body.name || !body.price || !body.description) {
//     res.status(400).send({ message: "required parameters missing" });
//     return;
//   }
//   console.log(body.name); 
//   console.log(body.price);
//   console.log(body.description);
 
//   productModel.create(
//     {
//       name: body.name,
//       price: body.price,
//       description: body.description,
//     },
//     (err, saved) => {
//       if (!err) {
//         console.log(saved);

//         res.send({
//           message: "product added successfully",
//         });
//       } else {
//         res.status(500).send({
//           message: "Post error",
//         });
//       }
//     }
//   );
// });

app.get("/products", (req, res) => {
    productModel.find({}, (err, data) => {
      if (!err) {
        res.send({
          message: "got all products successfully",
          data: data,
        });
      } else {
        res.status(500).send({
          message: "Get request  error",
        });
      }
    });
  });
// app.get('/product/:id', (req, res) => {

//     const id = req.params.id;

//     let isFound = false;
//     for (let i = 0; i < products.length; i++) {

//         if (products[i].id === id) {
//             res.send({
//                 message: `get product by id: ${products[i].id} success`,
//                 data: products[i]
//             });

//             isFound = true
//             break;
//         }
//     }
//     if (isFound === false) {
//         res.status(404)
//         res.send({
//             message: "product not found"
//         });
//     }
//     return;
// })

app.delete('/product/:id', (req, res) => {
    const id = req.params.id;

    productModel.deleteOne({ editingId: id }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "Product has been deleted successfully",
                })
            } else {
                res.status(404);
                res.send({
                    message: "No Product found with this id: " + id,
                })
            }


        } else {
            res.status(500).send({
                message: "delete error"
            })
        }
    });
})



app.put('/product/:id', async (req, res) => {

    const body = req.body;
    const id = req.params.id;

    if (
        body.name ||
        body.price ||
        body.description
    ) {
        res.status(400).send(` required parameter missing. example request body:
        {
            "name": "  body.name,",
            "price": "body.price",
            "description": "body.description"
        }`)
        return;
    }

    try {
        let data = await productModel.findByIdAndUpdate(id,
            {
                name: body.name,
                price: body.price,
                description: body.description
            },
            { new: true }
        ).exec();

        console.log('updated: ', data);

        res.send({
            message: "product modified successfully"
        });

    } catch (error) {
        res.status(500).send({
            message: "update error"
        })
    }
})







const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './e-commerce/build')))
app.use('*', express.static(path.join(__dirname, './e-commerce/build')))


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

mongoose.connect(mongodbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
