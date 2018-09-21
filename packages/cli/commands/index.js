module.exports = function(client) {
    var loadCommand = function(name) {
        var cmd = require('./' + name)
        cmd.register(client)
        return cmd.runner()
    }

    client.login = loadCommand('login')
}
