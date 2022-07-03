const { Command, flags, logger } = require('@yodata/cli-tools')
const { URL } = require('url')
const hasValue = require('@yodata/has-value')
const SUBSCRIPTION_PATH = 'settings/subscriptions'
const SOURCE_PATH = 'settings/default-subscriptions.json'
const defaultSubscriptionsDocument = (sourceUrl, targetUrl) => ({
    [ '@id' ]: targetUrl,
    id: sourceUrl,
    version: 0,
    items: []
})

class ResetSubscriptionsCommand extends Command {
    async run() {
        const defaultDoc = defaultSubscriptionsDocument(this.sourceUrl, this.targetUrl)

        const target = await this.client.data(this.targetUrl, undefined, defaultDoc)
            .then(validateSubscriptionsDocument)
            .catch(err => {
                throw new Error(`BAD_TARGET ${this.targetUrl}  ${err.statusMessage || err.message}`)
            })

        const source = await this.client.data(this.sourceUrl)
            .then(validateSubscriptionsDocument)
            .catch(err => {
                throw new Error(`BAD_SOURCE ${this.sourceUrl} ${err.statusMessage || err.message}`)
            })

        const sourceVersion = Number(source.version)
        const targetVersion = Number(target.version)

        if (sourceVersion > targetVersion) {
            await this.client.put(this.targetUrl, source)
            logger.log(`${this.targetUrl} updated from version ${targetVersion} to ${sourceVersion}`)
        } else if (targetVersion === sourceVersion) {
            logger.log(`${this.targetUrl} has current version ${targetVersion}`)
        } else if (targetVersion > sourceVersion) {
            if (this.prop.force === true) {
                const backupUrl = `/settings/subscriptions/old/version${targetVersion}`
                await this.client.put(backupUrl, target)
                await this.client.put(this.targetUrl, source)
                logger.log(`${this.targetUrl} set to version ${sourceVersion}`)
                logger.log(`previous version moved to ${backupUrl}`)
            } else {
                logger.error(`${target.id} is newer version than source, use --force to overwrite target`)
            }

        }
    }

    static description = 'reset subscription to default if target.version <= source.version'

    get targetUrl() {

        const url = this.client.resolve(this.prop.host || SUBSCRIPTION_PATH, this.profile.hostname)
        const location = new URL(url)
        if (location.pathname === '/profile/card' || location.pathname === '/') {
            location.pathname = SUBSCRIPTION_PATH
        }
        return location.href
    }

    get sourceUrl() {
        const url = this.client.resolve(this.prop.source || SOURCE_PATH, this.profile.hostname)
        const location = new URL(url)
        if (location.pathname === '/profile/card' || location.pathname === '/') {
            location.pathname = SOURCE_PATH
        }
        return location.href
    }
}

ResetSubscriptionsCommand.args = [
    {
        name: 'host',
        type: 'string',
        description: 'the target pod',
        required: true,
        parse: value => {
            if (!String(value).startsWith('http') && !value.includes(':') && !value.includes('.')) {
                return value + ':'
            } else if (value === '.') {
                return '/settings/subscriptions'
            } else {
                return value
            }
        }
    }
]

ResetSubscriptionsCommand.flags = {
    source: flags.string({
        name: 'source',
        description: 'the source subscription to replace the current one',
        required: true,
        default: 'settings/default-subscriptions.json'
    }),
    force: flags.boolean({
        name: 'force',
        description: 'replace newer subscription doc and move previous to backup dir',
        required: false,
        default: false
    })
}


module.exports = ResetSubscriptionsCommand

function validateSubscriptionsDocument(object) {
    const objectId = object?.id

    if (typeof object !== 'object') throw new Error(`INVALID_OBJECT_TYPE:${typeof object}`)
    if (!hasValue(object, 'version', value => Number.isInteger(Number(value)))) {
        throw new Error(`SUBSCRIPTION_VERSION_ERROR:${object?.version}`)
    }
    if (!hasValue(object, 'items', Array.isArray)) {
        throw new Error(`SUBSCRIPTION_ITEMS_ERROR:${objectId}`)
    }

    return object

}
