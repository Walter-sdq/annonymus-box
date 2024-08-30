const express = require('express');
const Excel = require('exceljs');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3003;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../frontend')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


app.post('/submit', (req, res) => {
    const { gender, expectation, agree } = req.body;
    res.status(201).send('<h2>You have been registered successfully you can close the tab now</h2>')

    let workbook = new Excel.Workbook();
    let sheet;
    const filePath = path.join(__dirname, '../registered/users.xlsx');
    //
    
    const dirPath = path.join(__dirname, '../registered');
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    
//
    if (fs.existsSync(filePath)) {
        workbook.xlsx.readFile(filePath)
            .then(() => {
                sheet = workbook.getWorksheet('Users') || workbook.addWorksheet('Users');
                saveDataToSheet(sheet, gender, expectation, agree);
                return workbook.xlsx.writeFile(filePath);
            })
            .then(() => {
                console.log('Data saved to Excel file');
                res.sendFile(filePath);
            })
            .catch((err) => {
                console.error('Error saving Excel file:', err);
                res.status(500).send('Error saving Excel file');
            });
    } else {
        sheet = workbook.addWorksheet('Users');
        sheet.addRow(['Gender','Expectations','post']);
        saveDataToSheet(sheet, gender, expectation, agree);
        workbook.xlsx.writeFile(filePath)
            .then(() => {
                console.log('Data saved to Excel file');
                res.sendFile(filePath);
            })
            .catch((err) => {
                console.error('Error saving Excel file:', err);
                res.status(500).send('Error saving Excel file');
            });
    }
});


app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, '../registered/users.xlsx');
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found');
    }
});


function saveDataToSheet(sheet, gender, expectation, agree) {
    sheet.addRow([gender, expectation, agree]);
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
