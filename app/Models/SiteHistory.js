'use strict'

const Model = use('Model')

class SiteHistory extends Model {

    static get table() {
        return 'sites_history'
    }
}

module.exports = SiteHistory
