<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
let router = useRouter()

let error = ref('')
let data = ref({})

async function tryAuth(data) {
  let res = await axios
    .get(
      `http://localhost:3000/api/users?_where=(email,eq,${data.email})~and(password,eq,${data.password})`
    )
    .then((res) => {
      return res.data
    })
  if (res.length == 1) {
    router.push('/stock')
  } else {
    this.error = 'Неправильный email или пароль'
  }
}
</script>

<template>
  <section
    class="bg-primary p-3 p-md-4 p-xl-5 d-flex flex-column align-items-center justify-content-center"
    style="min-height: 100vh"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-9 col-lg-7 col-xl-6 col-xxl-5">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-3 p-md-4 p-xl-5">
              <div class="row">
                <div class="col-12">
                  <div class="mb-5">
                    <h3>Вход</h3>
                  </div>
                </div>
              </div>
              <form @submit.prevent="tryAuth(data)">
                <div class="row gy-3 overflow-hidden">
                  <div class="col-12">
                    <div class="form-floating mb-3">
                      <input
                        v-model="data.email"
                        type="email"
                        class="form-control"
                        name="email"
                        id="email"
                        placeholder="name@example.com"
                        required
                      />
                      <label for="email" class="form-label">Email</label>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-floating mb-3">
                      <input
                        v-model="data.password"
                        type="password"
                        class="form-control"
                        name="password"
                        id="password"
                        value=""
                        placeholder="Password"
                        required
                      />
                      <label for="password" class="form-label">Пароль</label>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="d-grid">
                      <button class="btn bsb-btn-2xl btn-primary" type="submit">Войти</button>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="d-grid">
                      <span style="color: red" v-show="error">{{ error }}</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
