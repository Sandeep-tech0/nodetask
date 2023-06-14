const port = 5001;
const express = require('express');
const app = express();
const multer = require('multer');
const xlsx = require('xlsx');
const  {connection} = require('./dbConnect');


app.use(express.json());
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./excel");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({
  storage: fileStorage,
});

app.post("/file-upload", upload.single("excel"), async (req, res) => {
  try {
    const file = req.file;
    const excelFile = await xlsx.readFile(`./excel/${file.originalname}`);
    const sheetNames = excelFile.SheetNames;
    
    for (const sheetName of sheetNames) {
      const sheetData = xlsx.utils.sheet_to_json(excelFile.Sheets[sheetName]);

      if (sheetName === 'Sheet1') {
        const clients = sheetData.map((row) => {
          const data = {id: row.id,
            name: row.name,
            email:row.email}
            const insertQuery = "INSERT INTO client SET ?";
            connection.query(insertQuery, data, (error, result) => {
              if (error) {
                console.error('Error inserting data into client table:', error);
              } else {
                console.log('Data inserted into client table');
              }
            });
        });

        
      } else if (sheetName === 'Sheet2') {
        const clientBankDetails = sheetData.map((row) => {
          const data = {id: row.id,
            client_id: row.clientId,
            account_number:row.accountNumber}
            const insertQuery = "INSERT INTO client_bank_details  SET ?";
            connection.query(insertQuery, data, (error, result) => {
              if (error) {
                console.error('Error inserting data into client_bank_details table:', error);
              } else {
                console.log('Data inserted into client_bank_details table');
              }
            });
            
        });

     
      } else if (sheetName === 'Sheet3') {
        const clientAddresses = sheetData.map((row) => {
          const data = {id: row.id,
            client_id: row.clientId,
            address:row.address}

            const insertQuery = "INSERT INTO client_address  SET ?";
            connection.query(insertQuery, data, (error, result) => {
              if (error) {
                console.error('Error inserting data into client_bank_details table:', error);
              } else {
                console.log('Data inserted into client_bank_details table');
              }
            });
        });
      }
    }
    const insertQuery = "INSERT INTO files_path  SET ?";
    connection.query(insertQuery, {path:`./excel/${file.originalname}`}, (error, result) => {
      if (error) {
        console.error('Error inserting data into client_bank_details table:', error);
      } else {
        console.log('Data inserted into client_bank_details table');
      }
    });
    res.json({ status: 200, message: "File uploaded and data stored successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server started at http://localhost:${port}`);
});



