var favicon = require('serve-favicon');
const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");
var path = require("path");

app.use(favicon(path.join(__dirname, "public","favicon.ico")));
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/index.html");
})


app.post("/" , function(req,res){
    const apiKey = "f45c49cc6b8a69ca4a47e00f34079908"
    const loc = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+loc+"&APPID="+apiKey+"&units=metric";

    https.get(url, function(response){
        response.on("data", function(data){
            const weatherData = JSON.parse(data)
            const temp = Math.round(weatherData.main.temp *10)/10
            const feelsLike = Math.round(weatherData.main.feels_like *10)/10
            const desc = weatherData.weather[0].main
            const icon = weatherData.weather[0].icon
            const imgURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png"
            res.write('<h1 style="font-size: 3rem; text-align: center; color: #172774; margin-top: 160px; margin-bottom: 30px;">Its '+temp+'<span>&#176;</span>C right now in '+loc+'</h1>');
            res.write('<h2 style="font-size: 2rem; text-align: center; color: #172774;">Feels like '+feelsLike+'<span>&#176;</span>C and '+desc+'</h2>');
            res.write('<div style="text-align: center;"><img src='+imgURL+'></div>');
            res.sendFile(__dirname+"/result.html");
            res.send();
        })

    })
})



app.listen(process.env.PORT || 3000 , function(){
    console.log("Server started at 3000");
})
