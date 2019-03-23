const Store = require('configstore')
const store = new Store('@yodata/cli')

exports.command = 'config <cmd>'
exports.description = 'manage settings'
exports.builder = function(cli) {
	cli.command('get <key>', 'get config value',{},({key}) => print(store.get(key)	))
	cli.command('set <key> <value>', 'set config value', (props) => {console.log(props)})
	return cli
}
