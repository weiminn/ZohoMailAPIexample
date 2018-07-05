const fs = require('fs');
var request = require("request");
var moment = require("moment");
var jsonexport = require('jsonexport');
var records = require('./records.json');

var allEmails = [];



var fromDate = moment('12-JUN-2018','DD-MMM-YYYY');
var toDate = moment('1-JUL-2018','DD-MMM-YYYY');

// reader.pipe(jsonexport()).pipe(writer);

// for(var m = fromDate; m.isSameOrBefore(toDate); m.add(1, 'days')){
//     // console.log(m.format('DD-MMM-YYYY'))
//     setTimeout(() => {
//         getMails(m.format('DD-MMM-YYYY'));
//     }, 5000);

//     if(m.isSame(toDate)){
//         setTimeout(() => {
//             waitWrite();
//         }, 10000);
//     }
// }

getMails('01-JUL-2018');
waitWrite('01-JUL-2018');

function waitWrite(date){
    
    setTimeout(() => {
        fs.writeFile("./records.json", JSON.stringify(allEmails, null, 2), function (err) {
            if (err) {
                return console.log(err);
            }
            else{
                var reader = fs.createReadStream('./records.json');
                var writer = fs.createWriteStream('./'+ date + '.csv');
                reader.pipe(jsonexport()).pipe(writer);
                console.log("The file was saved!");
            }
        });
    }, 7000);
}

function getMails(date){
    var options = { method: 'GET',
        url: 'http://mail.zoho.com/api/accounts/7345142000000008002/messages/search',
        qs: 
        { 
            limit: '9999',
            searchKey: 'fromDate:' + date + '::toDate:' + date + '::in:sent' },
            headers: 
        { 
            'postman-token': 'b97c31b0-0617-a72c-1df1-a923a5eb7e0c',
            'cache-control': 'no-cache',
            authorization: 'Zoho-authtoken a62560be8cb336734667ec1c3fdd9ec9' } 
        };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var allMessages = JSON.parse(body).data;
        console.log(body);
        
        for(let message of allMessages){
            if(message.hasAttachment === '1'){
                getAttachment(message);
            }
        }
    });
}

function getAttachment(message){
    var mOptions = { method: 'GET',
    url: 'http://mail.zoho.com/api/accounts/7345142000000008002/folders/7345142000000008020/messages/' + message.messageId + '/attachmentinfo',
    headers: 
        { 
            'postman-token': '11d49d00-fa02-023e-43e2-65cd5194f1f3',
            'cache-control': 'no-cache',
            authorization: 'Zoho-authtoken a62560be8cb336734667ec1c3fdd9ec9' } 
        };

    request(mOptions, function (error, response, body) {
        if (error) throw new Error(error);

            // var date = new Date(message.receivedTime).toISOString().slice(-13, -5);
            var receipient = message.toAddress.replace(/&lt;/g, '').replace(/&gt;/g, '');
            var object = {
                Receipient: receipient,
                'File Name': JSON.parse(body).data.attachments[0].attachmentName,
                Time: moment.unix(message.receivedTime.substring(0, 10)).format('dddd, MMMM Do, YYYY h:mm:ss A')
            }
            console.log(object);
            allEmails.push(object);
        });
}