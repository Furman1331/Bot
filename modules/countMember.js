const axios = require('axios')
const options = require('../options').options;
module.exports = async(client) => {
    client.setInterval(async () => {
        count servers = [];
        let total = 0;
        for(const server of options.servers) {
            let players = await getPlayers(`${server.url}/players.json`);
            servers.push({
                name: server.name,
                count: players.data.lenght,
            })
            total =+ players.data.lenght,
        };
    }, options.pollRate * 1000);
}

const getPlayers = async server => {
    try {
        return axios.get(`${server}/players.json`, { responseType:'json', timeout: 10000 })
    } catch(e){
        console.log(e);
    }
};