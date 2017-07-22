const https = require('https'), express = require('express'), fs = require('fs'), mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
console.log('Starting MCStats Node API');

// TODO make config load from a config file
const config = {
    // port: 443,
    port: 80,
    cert: './localhost.cert',
    key: './localhost.key'
};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.post('*', function(req, res) {
    const args = req.path.split('\/');
    args.shift();

    switch(args.length > 0 ? args[0].toLowerCase() : '') {
        default:
            res.send('');
            break;
        case 'plugin':
            if( args.length > 1 ) {
                const plugin = args[1];
                if( req.body != undefined && req.body != null ) {
                    handle_plugin_data(plugin, req.body, req);
                    res.send('1');
                } else {
                    res.send('7,Failed to parse data');
                }
            } else {
                res.send('');
            }
            break;
    }
}).get('*', function(req, res) {
    res.send('ok');
});

app.listen(config.port);

// https.createServer({
//     key: fs.readFileSync(config.key),
//     cert: fs.readFileSync(config.cert)
// }, app).listen(config.port, function() {
//     console.log('MCStats Node API listening on port ' + config.port);
// });


function handle_plugin_data(plugin, data, req) {
    const guid = data.guid;
    const plugin_version = data.plugin_version;
    const server_version = data.server_version;
    const players_online = data.players_online;
    const osname = data.osname;
    const osarch = data.osarch;
    const osversion = data.osversion;
    const cores = data.cores;
    const auth_mode = data.auth_mode;
    const java_version = data.java_version;
    const remote_ip = req.connection.remoteAddress;

    const sql = 'INSERT INTO `stats_PLUGIN` (`date`, `guid`, `plugin_version`, `server_version`, `players_online`, `osname`, `osarch`, `osversion`, `cores`, `auth_mode`, `java_version`, `remote_ip` ) VALUE ( "", "' + guid + '", "' + plugin_version + '", "' + server_version + '", "' + players_online + '", "' + osname + '", "' + osarch + '", "' + osversion + '", "' + cores + '", "' + auth_mode + '", "' + java_version + '", "' + remote_ip + '" );';
    console.log(sql);
}