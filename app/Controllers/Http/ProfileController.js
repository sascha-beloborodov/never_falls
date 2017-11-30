'use strict'

class ProfileController {

    index({ view }) {
        return view.render('profile.index')
    }
}

module.exports = ProfileController
