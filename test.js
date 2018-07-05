var request = require("request");

var options = { method: 'GET',
  url: 'https://mail.zoho.com/api/accounts/7345142000000008002/messages/search',
  qs: 
   { limit: '9999',
     searchKey: 'fromDate:12-JUN-2018::toDate:12-JUN-2018::in:sent' },
  headers: 
   { 'postman-token': '1ea9128a-3745-7ef2-152a-e5c782f97af7',
     'cache-control': 'no-cache',
     authorization: 'Zoho-authtoken a62560be8cb336734667ec1c3fdd9ec9' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
