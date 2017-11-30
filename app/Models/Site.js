'use strict'

const Model = use('Model')

class Site extends Model {
    
    static get table() {
        return 'sites'
    }
}

module.exports = Site
