'use strict'

const Model = use('Model')

class Site extends Model {

    static get table() {
        return 'sites'
    }

    static get statusActive() {
        return 1;
    }

  /**
   *
   * @method sites
   *
   * @return {Object}
   */
    siteHistory() {
        return this.hasMany('App/Models/SiteHistory')
    }
}

module.exports = Site
