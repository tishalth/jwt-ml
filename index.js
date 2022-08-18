const sql = require('mssql');
const express = require('express');
const app = express();
const config = require('./config/database')
const { PORT, USERNAME, PASSWORD, SERVER, DATABASE } = process.env;
const jwt = require('jsonwebtoken');


function addHoursToDate(date, hours) {
    return new Date(new Date(date).setHours(date.getHours() + hours));
}

app.post("/user/generateToken", (req, res) => {

    let myDate = new Date();
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        timein: myDate,
        timeout: addHoursToDate(myDate, 8),
    }
    const token = jwt.sign(data, jwtSecretKey);
    res.send(token);
});

app.get('/user/validateToken', function (req, res) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    if (!token) {
        res.status(200).json({ success: false, message: "Error! Token was not provided." });
    }
    else {
        try {
            const decodedToken = jwt.verify(token, jwtSecretKey);
            console.log(decodedToken);
            if (Date() >= decodedToken.timeout) {
                try {
                    sql.connect(config, function (err) {
                        if (err) console.log(err);
                        var request = new sql.Request();
                        request.query('SELECT * FROM API_List', function (err, recordset) {
                            if (err) console.log(err)
                            // res.send(recordset);
                            res.status(200).json({
                                success: true,
                                data: recordset
                            });
                        });
                    });
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                res.status(401).json({
                    success: false,
                    data: 'ไม่สามารถเข้าถึงข้อมูลได้'
                });
            }
        }
        catch (err) {
            return res.status(401).send(err);
        }
    }
});

// console.log(config);
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));