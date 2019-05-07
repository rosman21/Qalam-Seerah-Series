require('dotenv').config();
const cheerio = require('cheerio');
const http = require('request');
const fs = require('fs');
const array = [];
var dir = './seerah_files';
http(process.env.qalamurl, function (error, response, body) {
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
      var name = seerah[i].name;
      var url = seerah[i].url;
      if(name.includes("epsiode")){
        var newname = name.replace('epsiode', 'episode')
      } 
      else if(name.includes("intro_a")){
        var newname = name.replace('seerah_intro_a', 'seerah_episode_1')
      } 
      else if(name.includes("intro_b")){
        var newname = name.replace('intro_b', 'episode_2')
      } 
      else if(name.includes("pre_islamic_society_a")){
        var newname = name.replace('pre_islamic_society_a', 'episode_3')
      } 
      else if(name.includes("pre_islamic_society_b")){
        var newname = name.replace('pre_islamic_society_b', 'episode_4')
      } 
      else if(name.includes("monotheism_before_islam")){
        var newname = name.replace('monotheism_before_islam', 'episode_5')
      } 
      else if(name.includes("history_of_zamzam")){
        var newname = name.replace('history_of_zamzam', 'episode_6')
      }else{
        var newname = name;
      }
      console.log(newname);
      http
        .get(url)
        .on('error', function(err) {
          // handle error
        })
        .pipe(fs.createWriteStream('./seerah_files/'+newname+'.mp3'));
    } 
  });
});
