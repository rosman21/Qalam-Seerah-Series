const cheerio = require('cheerio');
const http = require('request');
const fs = require('fs');
const array = [];
var dir = './seerah_files';
http('http://qalaminstitute.org/podcast/audio/seerah/?C=M;O=A', function (error, response, body) {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  const $ = cheerio.load(body);
  $('table tbody tr').each(function (i, row) {
    $(this).find('td').each(function (j, data) {
      if(data.children[0]){
        if(data.children[0].attribs){
          var url = data.children[0].attribs.href
        }
        if(data.children[0].data){
          var info = data.children[0].data
        }
        if(url && url != 'model.php' && url != '/podcast/audio/'){
          array.push({
            name: url.substring(0, url.length - 4),
            url: 'http://qalaminstitute.org/podcast/audio/seerah/' + url
          })
        }
      }
    });
  })
  // console.log(array);
  var stringify = JSON.stringify(array);
  fs.writeFile('seerah.json', stringify, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
    var json = fs.readFileSync('seerah.json');
    var seerah = JSON.parse(json);
    for(var i = 0; i < seerah.length; i++){
      let name = seerah[i].name;
      let url = seerah[i].url;
      http
        .get(url)
        .on('error', function(err) {
          // handle error
        })
        .pipe(fs.createWriteStream('./seerah_files/'+name+'.mp3'));
    } 
  });
});
