var config = {}

config.coordinateregex = /(\S{2,}[ ]\d{1,}(?:n|s)[ ]\d{1,}(?:e|w)(?: ?\d{0,}[\,\.]?\d{1,}?[a])?(?: ?\d{0,})?)+/g; 

config.logging = {};

config.logging.directory = __dirname+"/out/";

config.reddit = {};

config.reddit.useragent = '/u/awteleportbot awteleport@0.0.0 (by /u/hyperanthony)';
config.reddit.username = 'username';
config.reddit.password = 'password';
config.reddit.accesskey = 'accesskey';
config.reddit.secretkey = 'secretkey';

module.exports = config;