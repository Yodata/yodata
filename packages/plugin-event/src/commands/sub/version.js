const { Command, baseFlags } = require('../../subscription')


class SubscriptionVersionCommand extends Command {
    async run() {
        const target = this.target
        const version = await this.client.data(target, 'version')
        return this.print(`${target} version:${version}`)
    }

    static description = 'returns the target subscription version'
}

SubscriptionVersionCommand.args = [
    {
        name: 'host',
        description: 'the target pod',
        parse: value => {
            if (!String(value).startsWith('http') && !value.includes(':') && !value.includes('.')) {
                return value + ':'
            } else if (value === '.') {
                return '/settings/subscriptions'
            } else {
                return value
            }
        },
        default: '.'
    }
]

module.exports = SubscriptionVersionCommand
