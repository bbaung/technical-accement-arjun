const config = require("../config.json")

const logger = {
    info: (...log) => {
        if (!config.logger.info) return 

        const prefix = "[INFO]"
        console.info(prefix, ...log)
    },
    log: (...log) => {
        if (!config.logger.log) return 

        const prefix = "[LOG]"
        console.log(prefix, ...log)
    }
}

module.exports = logger