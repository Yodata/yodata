/* Foo commander component
 * To use add require('../cmds/foo.js')(program) to your commander.js based node executable before program.parse
 */
'use strict'

module.exports = function (program) {
	program
		.command('foo')
		.version('0.0.0')
		.description('A commander command')
		.action((/* Args here */) => {
			console.log('foo who')
		})

};
