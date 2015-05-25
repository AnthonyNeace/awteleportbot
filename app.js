var Snoocore = require('snoocore');
var fs = require('fs');
var mkdirp = require('mkdirp');

var config = require('./config')

var loggingDirectory = config.logging.directory;
// Matches activeworlds coordinates syntax. Altitude and directional values are optional. Altitude can be integer or decimal.
var re = config.coordinateregex;

mkdirp(loggingDirectory, function(err) { 
    if(err) {
        return console.log(err);
    }
    // path was created unless there was error
});

// Our new instance associated with a single account.
// It takes in various configuration options.
var reddit = new Snoocore({
  userAgent: config.reddit.useragent, // unique string identifying the app
  oauth: {
    type: 'script',
    key: config.reddit.accesskey, // OAuth client key (provided at reddit app)
    secret: config.reddit.secretkey, // OAuth secret (provided at reddit app)
    username: config.reddit.username, // Reddit username used to make the reddit app
    password: config.reddit.password, // Reddit password for the username
    // The OAuth scopes that we need to make the calls that we 
    // want. The reddit documentation will specify which scope
    // is needed for evey call
    scope: [ 'identity', 'read', 'vote' ]
  },
  throttle: 5000
});

// Get my account information.
/*
reddit('/api/v1/me').get().then(function(result) {
  console.log(result); 
});
*/

function currentISODate()
{
  var date = new Date();
  return date.toISOString();
}

function writeFileLog(logfile, message)
{
  console.log(message);
  
  var logMessage = currentISODate()+":  "+message+"\n";
  
  console.log(logMessage);
  
  fs.appendFile(logfile, logMessage, function(err) {
    if(err) {
        return console.log(err);
    }
    
  });  
}

function writeLog(message)
{
  // Write to File Logger
  writeFileLog(loggingDirectory+"awteleportbot.log", message);
  
  // Write to Console
  console.log(message);
}

function readNewSubmissions(submissionData) {  
  var selftext = submissionData.selftext;
  
  if(selftext !== null)
  {    
    writeLog("Reading submission text for "+submissionData.id);
    
    var m = [];
    
    while ((m = re.exec(selftext)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        
        if(m[0] !== null)
        {
            writeLog(m[0]);
        }
    }       
  }
}

function readSubmissionComments()
{

}

reddit('/r/awteleportbot/new').listing({ 
  // Any parameters for the endpoints can be used here as usual.
  // In this case, we specify a limit of 10 children per slice
  limit: 10
}).then(function(slice) {
  
  writeLog("Begin processing.");
  
  // Foreach submission, write out the submission name
  var submissions = [];
  
  slice.children.forEach(function(submission) {
    var submissionUrl = submission.data.id;
    writeLog("Processing Submission Id: "+submissionUrl);
    
    // Check submission text for coordinates
    readNewSubmissions(submission.data);
    
    submissions.push(submissionUrl);
  }, this);  
});