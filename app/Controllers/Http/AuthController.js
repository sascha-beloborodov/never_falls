'use strict'

const {validate} = use('Validator')
const Hash = use('Hash')
const User = use('App/Models/User')

class AuthController {

    showLogin({view}) {
        return view.render('auth.login')
    }

    showRegister({view}) {
        return view.render('auth.register')
    }

    async login({ request, session, response, view, auth }) {
        const rules = {
            email: 'required|email',
            password: 'required|min:6'
        }
        const validation = await validate(request.all(), rules)

        if (validation.fails()) {
            session
                .withErrors(validation.messages()).flashAll()
            // .flashExcept(['password'])
            return response.redirect('/login')
        }
        const { email, password } = request.all()
        try {
            await auth.attempt(email, password)
            return response.redirect('/dashboard')
        } catch (e) {
            // todo log
            session.flash({ message: 'Wrong credentials' })
            return response.redirect('/login')
        }
    }

    async register({ request, session, response, view }) {
        const rules = {
            email: 'required|email|unique:users,email',
            first_name: 'required',
            last_name: 'required',
            password: 'required|string|min:6|confirmed'
        }
        const validation = await validate(request.all(), rules)
        
        if (validation.fails()) {
            session
                .withErrors(validation.messages()).flashAll()
            // .flashExcept(['password'])
            return response.redirect('back')
        }
        const user = new User;
        user.first_name = request.input('first_name')
        user.last_name = request.input('last_name')
        user.email = request.input('email')
        user.password = request.input('password')
        user.role_id = 5
        user.is_active = 0
        await user.save()
        session.flash({ messages: 'You have been registered sucessfully' })
        return response.redirect('/login')
    }
}

module.exports = AuthController
