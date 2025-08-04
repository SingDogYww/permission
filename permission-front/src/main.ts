import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css'

import Particles from '@tsparticles/vue3'
import { loadSlim } from '@tsparticles/slim'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons'
library.add(faUserAstronaut)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)

app.use(Particles as any, {
  init: async (engine: any) => {
    await loadSlim(engine)
  },
})
app.mount('#app')
