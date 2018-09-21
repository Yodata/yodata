import axios from 'axios'
import { getUsers } from './src/firebase/db'

export default {
  getSiteData: () => ({
    title: 'Yodata',
  }),
  getRoutes: async () => {
    const { data: posts } = await axios.get('https://jsonplaceholder.typicode.com/posts')
    const users = await getUsers()
    return [
      {
        path: '/',
        component: 'src/containers/Home',
        children: users.map(user => ({
          path: `/${user._id}`,
          component: 'src/containers/User',
          getData: () => ({user}),
        })),
      },
      {
        path: '/about',
        component: 'src/containers/About',
      },
      {
        path: '/blog',
        component: 'src/containers/Blog',
        getData: () => ({
          posts,
        }),
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          component: 'src/containers/Post',
          getData: () => ({
            post,
          }),
        })),
      },
      {
        path: '/dashboard',
        component: 'src/containers/Dashboard',
      },
      {
        path: '/account',
        component: 'src/containers/Account',
      },
      {
        path: '/signin',
        component: 'src/containers/SignIn',
      },
      {
        path: '/signup',
        component: 'src/containers/SignUp',
      },
      {
        path: '/signout',
        component: 'src/containers/SignOut',
      },
      {
        path: '/forgotpw',
        component: 'src/containers/ForgotPassword',
      },
      {
        is404: true,
        component: 'src/containers/404',
      },
    ]
  },
}
