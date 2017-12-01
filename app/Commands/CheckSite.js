'use strict'

const request = require('request')
const rp = require('request-promise')
const { Command } = require('@adonisjs/ace')
const Site = use('App/Models/Site')
const SiteHistory = use('App/Models/SiteHistory')
const proccess = require('process')

class CheckSite extends Command {
  static get signature () {
    return 'check:site'
  }

  static get description () {
    return 'Tell something helpful about this command'
  }

  hasHttp(url) {
    return -1 != url.indexOf('http://') ||
      -1 != url.indexOf('https://')
  }

  async checkSites() {
    const sitesQuery = await Site.query().where('is_active', '=', Site.statusActive).fetch()
    const sites = sitesQuery.toJSON()
    
    const promisesRequests = []

    for (let site of sites) {
      let siteModel = await Site.findOrFail(site.id)
      let siteHistory = new SiteHistory()
      const url = !this.hasHttp(site.url) ? `http://${site.url}` : site.url
      
      promisesRequests.push(new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
          const checkTime = Math.round(new Date().getTime() / 1000)
          if (error) {
            // log error
            console.log('error')
            siteModel.last_check_time = checkTime
            siteModel.save()
            siteHistory = null
            resolve('error');
          } else {
            siteModel.last_check_time = checkTime
            siteModel.last_check_code = response.statusCode
            siteHistory.site_id = site.id
            siteHistory.check_time = checkTime
            siteHistory.check_code = response.statusCode
            siteHistory.snapshot = site.url
            console.log('filling')
            console.log('save')
            siteModel.save()
            siteHistory.save()
            resolve('success')
          }
        })
      }) )

      // rp(url)
      // .then(function (htmlString) {
      //     const checkTime = Math.round(new Date().getTime() / 1000)
      //     // Process html...
      //     siteModel.last_check_time = checkTime
      //     siteModel.last_check_code = 200
      //     siteHistory.site_id = site.id
      //     siteHistory.check_time = checkTime
      //     siteHistory.check_code = 200
      //     siteHistory.snapshot = site.url
      //     console.log('filling')
      //     console.log('save')
      //     siteModel.save()
      //     siteHistory.save()          
      // })
      // .catch(function (err) {
      //   const checkTime = Math.round(new Date().getTime() / 1000)
      //   siteModel.last_check_time = checkTime
      //   siteModel.save()
      //   siteHistory = null
      //   console.error(err)
      // });
    }
    Promise.all(promisesRequests).then(values => { 
      console.log(values);
      process.exit(1); 
    }).catch((err) => console.log(err));

  }

  async handle (args, options) {
    try {
      this.checkSites()
    } catch(e) {
      // todo log
      console.error(e)
    }
    this.info('Dummy implementation for check:site command')
  }
}

module.exports = CheckSite
