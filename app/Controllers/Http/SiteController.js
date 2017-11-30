'use strict'

const Site = use('App/Models/Site')
const {validate} = use('Validator')

class SiteController {

    async index( {view, auth} ) {
        const user = auth.user;
        const sitesQuery = await Site.query().where('user_id', '=', user.id).fetch()
        const sites = sitesQuery.toJSON()
        return view.render('site.index', { 
            sites,
            formatDate(time) {
                return new Date(time * 1000).toLocaleString();
            }
         })
    }

    create( {view, auth} ) {
        return view.render('site.create')
    }

    async store( {auth, session, request, response} ) {
        const rules = {
            name: 'required|string|min:2',
            url: 'required|string|min:2'
        }
        const validation = await validate(request.all(), rules)
        
        if (validation.fails()) {
            session
                .withErrors(validation.messages())
                .flashAll()
            return response.redirect('sites/create')
        }
        const site = new Site;
        site.name = request.input('name')
        site.url = request.input('url')
        site.description = request.input('description')
        site.is_active = 1
        site.user_id = auth.user.id
        await site.save()
        session.flash({ message: 'Site is added sucessfully' })
        return response.redirect('/sites')
    }
}

module.exports = SiteController
