const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

const pageURl = "https://www.amazon.com/s?k=phone&page=2&crid=18EUYBSP7O1SQ&qid=1702535235&sprefix=phon%2Caps%2C280&ref=sr_pg_2"

const getData = async ()=>{

    try{
        const response = await axios.get(pageURl);
        const data = response.data;
        // console.log(data);
        fs.writeFileSync("data.json",data);
        // console.log("File Written Successfully!");
    }
    catch(err){
        console.log("Error Occured",err);
    }
}

getData();

const html = fs.readFileSync("data.json");
const $ = cheerio.load(html.toString());
// console.log($);

const title = $(".a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2");
const titleData = [];
title.each((index,element)=>{
    titleData.push($(element).text());
})
// console.log(titleData);

const rating = $(".a-row.a-size-small span");
const ratingData = [];
rating.each((index,element)=>{
    ratingData.push($(element).text());
});
// console.log(ratingData);

const price = $(".a-price-whole")
const priceData = [];
price.each((index,element)=>{
    priceData.push($(element).text());
})
//  console.log(priceData);

const storedData = titleData.map((title,index)=>{
    return {
        title: title,
        rating: ratingData[index],
        price: priceData[index]
    }
})

fs.writeFileSync("product.json",JSON.stringify(storedData));

// console.log(storedData);

const xlsx = require("xlsx");

const workbook = xlsx.utils.book_new();
const sheetdata = xlsx.utils.json_to_sheet(storedData);
xlsx.utils.book_append_sheet(workbook,sheetdata,"Products");
xlsx.writeFile(workbook,"product.xlsx");
console.log("Sheet created successfully");